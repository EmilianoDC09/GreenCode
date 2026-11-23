package com.greencode.runner;

import com.greencode.greenCodeCustomVisitor;
import com.greencode.greenCodeLexer;
import com.greencode.greenCodeParser;
import org.antlr.v4.runtime.BaseErrorListener;
import org.antlr.v4.runtime.CharStreams;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.RecognitionException;
import org.antlr.v4.runtime.Recognizer;

import java.io.FileDescriptor;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.NoSuchElementException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Punto de entrada del proceso hijo que ejecuta un programa GreenCode.
 *
 * Cambio de integración (no de lógica): el intérprete original (gramática y
 * greenCodeCustomVisitor) se usa tal cual. Esta clase solo:
 *  - lee el código de un archivo temporal,
 *  - deja que el Visitor lea "captar" desde la entrada estándar,
 *  - separa errores léxicos y sintácticos,
 *  - atrapa las excepciones del Visitor y las reporta.
 *
 * Protocolo con ExecutionService:
 *  - stdout: la salida original del Visitor (traza y líneas "Emitir: ...").
 *  - stderr: una línea por error: @@ERR\ttipo\tlinea\tcolumna\tmensaje
 *  - código de salida: 0 sin errores, 1 con errores.
 */
public final class Runner {

    public static final String MARCA_ERROR = "@@ERR";
    private static final Pattern LINEA = Pattern.compile("\\(Linea:\\s*(\\d+)\\)");

    private static PrintStream err;
    private static boolean huboErrores = false;

    private Runner() {
    }

    public static void main(String[] args) throws IOException {
        System.setOut(new PrintStream(new FileOutputStream(FileDescriptor.out), true, StandardCharsets.UTF_8));
        err = new PrintStream(new FileOutputStream(FileDescriptor.err), true, StandardCharsets.UTF_8);

        if (args.length != 1) {
            reportar("ejecucion", null, null, "Uso: Runner <archivo.grc>");
            System.exit(1);
        }
        String codigo = Files.readString(Path.of(args[0]), StandardCharsets.UTF_8);

        greenCodeLexer lexer = new greenCodeLexer(CharStreams.fromString(codigo));
        lexer.removeErrorListeners();
        lexer.addErrorListener(new Escucha("lexico"));

        greenCodeParser parser = new greenCodeParser(new CommonTokenStream(lexer));
        parser.removeErrorListeners();
        parser.addErrorListener(new Escucha("sintactico"));

        greenCodeParser.StartContext arbol = parser.start();

        // Igual que el Main original: el Visitor solo corre si no hubo errores de análisis.
        if (!huboErrores) {
            try {
                new greenCodeCustomVisitor().visit(arbol);
            } catch (StackOverflowError e) {
                reportar("ejecucion", null, null,
                        "Recursión demasiado profunda: un injerto se llama a sí mismo sin terminar.");
            } catch (NoSuchElementException e) {
                reportar("ejecucion", null, null,
                        "'captar' no recibió valor: agrega una línea por cada 'captar' en el campo Entrada.");
            } catch (ClassCastException e) {
                reportar("ejecucion", null, null,
                        "Tipo inesperado durante la ejecución. Revisa que las condiciones de 'monitorear' y 'regar' sean de tipo actuador.");
            } catch (NumberFormatException e) {
                reportar("ejecucion", null, null, "Número fuera de rango: " + e.getMessage());
            } catch (RuntimeException e) {
                clasificar(e);
            } catch (Throwable t) {
                reportar("ejecucion", null, null, "Error inesperado del intérprete: " + t);
            }
        }

        System.out.flush();
        err.flush();
        System.exit(huboErrores ? 1 : 0);
    }

    /** Los errores que lanza el Visitor son RuntimeException con el texto "Error: ... (Linea: N)". */
    private static void clasificar(RuntimeException e) {
        String mensaje = e.getMessage() == null ? e.toString() : e.getMessage();
        if (e.getClass() != RuntimeException.class) {
            reportar("ejecucion", null, null, "Error inesperado del intérprete: " + e);
            return;
        }

        Integer linea = null;
        Matcher m = LINEA.matcher(mensaje);
        if (m.find()) {
            linea = Integer.valueOf(m.group(1));
        }
        String limpio = mensaje
                .replaceFirst("^Error:\\s*", "")
                .replaceAll("\\s*\\(Linea:\\s*\\d+\\)\\s*", " ")
                .trim();

        String minusculas = limpio.toLowerCase();
        boolean deEjecucion = minusculas.contains("division entre cero")
                || minusculas.contains("entrada invalida")
                || minusculas.contains("no puede ser 0");

        reportar(deEjecucion ? "ejecucion" : "semantico", linea, null, limpio);
    }

    static void reportar(String tipo, Integer linea, Integer columna, String mensaje) {
        huboErrores = true;
        err.println(String.join("\t",
                MARCA_ERROR,
                tipo,
                linea == null ? "" : linea.toString(),
                columna == null ? "" : columna.toString(),
                mensaje.replaceAll("[\\t\\r\\n]+", " ")));
    }

    private static final class Escucha extends BaseErrorListener {
        private final String tipo;

        Escucha(String tipo) {
            this.tipo = tipo;
        }

        @Override
        public void syntaxError(Recognizer<?, ?> recognizer, Object offendingSymbol, int line,
                                int charPositionInLine, String msg, RecognitionException e) {
            reportar(tipo, line, charPositionInLine + 1, msg);
        }
    }
}
