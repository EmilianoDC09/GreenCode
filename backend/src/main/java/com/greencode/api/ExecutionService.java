package com.greencode.api;

import com.greencode.runner.Runner;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Ejecuta cada programa en un proceso Java hijo (com.greencode.runner.Runner).
 *
 * Por qué un proceso aparte y no un hilo:
 *  - el Visitor escribe en System.out y lee de System.in, que son globales:
 *    dos ejecuciones en el mismo proceso mezclarían su salida;
 *  - un ciclo infinito (regar) no se puede detener desde otro hilo,
 *    pero un proceso sí se puede terminar con destroyForcibly().
 */
@Service
public class ExecutionService {

    static final long TIMEOUT_MS = 5_000;
    static final int MAX_SALIDA = 64 * 1024;
    private static final String MARCA_EMITIR = "Emitir: ";

    public RunResponse ejecutar(String codigo, String entrada) throws IOException, InterruptedException {
        long inicio = System.nanoTime();
        Path archivo = Files.createTempFile("greencode-", ".grc");
        try {
            Files.writeString(archivo, codigo, StandardCharsets.UTF_8);
            Process proceso = new ProcessBuilder(comando(archivo)).start();

            Lector stdout = new Lector(proceso.getInputStream(), proceso);
            Lector stderr = new Lector(proceso.getErrorStream(), proceso);
            stdout.start();
            stderr.start();

            try (OutputStream stdin = proceso.getOutputStream()) {
                stdin.write(entrada.getBytes(StandardCharsets.UTF_8));
            } catch (IOException ignorada) {
                // El proceso terminó antes de leer la entrada (por ejemplo, error de sintaxis).
            }

            boolean termino = proceso.waitFor(TIMEOUT_MS, TimeUnit.MILLISECONDS);
            if (!termino) {
                proceso.destroyForcibly();
                proceso.waitFor(1, TimeUnit.SECONDS);
            }
            stdout.join(1_000);
            stderr.join(1_000);

            List<String> output = new ArrayList<>();
            List<String> trace = new ArrayList<>();
            separarSalida(stdout.texto(), output, trace);

            List<RunError> errores = leerErrores(stderr.texto());
            if (!termino && !stdout.excedido && !stderr.excedido) {
                errores.add(new RunError("ejecucion", null, null,
                        "Tiempo de ejecución excedido (5 s). ¿Hay un ciclo regar o madurar que nunca termina?"));
            } else if (stdout.excedido || stderr.excedido) {
                errores.add(new RunError("ejecucion", null, null,
                        "La salida superó 64 KB y la ejecución se detuvo. ¿Hay un ciclo que nunca termina?"));
            } else if (proceso.exitValue() != 0 && errores.isEmpty()) {
                errores.add(new RunError("ejecucion", null, null,
                        "El intérprete terminó de forma inesperada (código " + proceso.exitValue() + ")."));
            }

            long ms = (System.nanoTime() - inicio) / 1_000_000;
            return new RunResponse(errores.isEmpty(), output, trace, errores, ms);
        } finally {
            Files.deleteIfExists(archivo);
        }
    }

    /**
     * El proceso hijo usa el mismo Java y el mismo classpath que el servidor.
     * Funciona con "mvn spring-boot:run" y desde el IDE. Con el .jar empaquetado
     * (java -jar) el classpath es solo el .jar y habría que ajustar esto (E4).
     */
    private static List<String> comando(Path archivo) {
        boolean windows = System.getProperty("os.name", "").toLowerCase().startsWith("windows");
        String java = Path.of(System.getProperty("java.home"), "bin", windows ? "java.exe" : "java").toString();
        return List.of(
                java,
                "-Xmx128m",
                "-XX:TieredStopAtLevel=1",
                "-Dfile.encoding=UTF-8",
                "-Dstdin.encoding=UTF-8",
                "-cp", System.getProperty("java.class.path"),
                Runner.class.getName(),
                archivo.toString());
    }

    /**
     * El Visitor imprime todo en stdout: la traza ("Sentencia: ...") y la salida de
     * emitir ("Emitir: valor"). 'captar' imprime su aviso con print (sin salto de línea),
     * así que la marca puede quedar a media línea: se busca en cualquier posición.
     */
    static void separarSalida(String texto, List<String> output, List<String> trace) {
        if (texto.isEmpty()) {
            return;
        }
        for (String linea : texto.split("\\R")) {
            int i = linea.indexOf(MARCA_EMITIR);
            if (i < 0) {
                if (!linea.isBlank()) {
                    trace.add(linea);
                }
                continue;
            }
            String antes = linea.substring(0, i).trim();
            if (!antes.isEmpty()) {
                trace.add(antes);
            }
            output.add(linea.substring(i + MARCA_EMITIR.length()));
        }
    }

    /** Lee las líneas @@ERR del Runner; ignora cualquier otro texto en stderr (avisos de la JVM). */
    static List<RunError> leerErrores(String texto) {
        List<RunError> errores = new ArrayList<>();
        for (String linea : texto.split("\\R")) {
            if (!linea.startsWith(Runner.MARCA_ERROR + "\t")) {
                continue;
            }
            String[] p = linea.split("\t", 5);
            if (p.length < 5) {
                continue;
            }
            errores.add(new RunError(p[1], entero(p[2]), entero(p[3]), p[4]));
        }
        return errores;
    }

    private static Integer entero(String s) {
        return s.isEmpty() ? null : Integer.valueOf(s);
    }

    /** Lee un flujo del proceso hasta MAX_SALIDA bytes; si se pasa, termina el proceso. */
    private static final class Lector extends Thread {
        private final InputStream in;
        private final Process proceso;
        private final ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        volatile boolean excedido = false;

        Lector(InputStream in, Process proceso) {
            this.in = in;
            this.proceso = proceso;
            setDaemon(true);
        }

        @Override
        public void run() {
            byte[] bloque = new byte[8192];
            try (in) {
                int n;
                while ((n = in.read(bloque)) != -1) {
                    int espacio = MAX_SALIDA - buffer.size();
                    if (n > espacio) {
                        buffer.write(bloque, 0, Math.max(espacio, 0));
                        excedido = true;
                        proceso.destroyForcibly();
                        return;
                    }
                    buffer.write(bloque, 0, n);
                }
            } catch (IOException ignorada) {
                // El flujo se cierra al terminar o matar el proceso.
            }
        }

        synchronized String texto() {
            return buffer.toString(StandardCharsets.UTF_8);
        }
    }
}
