package com.greencode;

import java.io.File;
import java.io.IOException;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.antlr.v4.runtime.BaseErrorListener;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.CharStreams;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.RecognitionException;
import org.antlr.v4.runtime.Recognizer;
import org.antlr.v4.gui.Trees;

public class Main {

    private static final String EXTENSION = "grc";
    private static final String DIRBASE = "src/test/resources/";

    static class Errores extends BaseErrorListener {
        final List<String> mensajes = new ArrayList<String>();

        @Override
        public void syntaxError(Recognizer<?, ?> recognizer, Object offendingSymbol, int line,
                                int charPositionInLine, String msg, RecognitionException e) {
            mensajes.add("  línea " + line + ":" + charPositionInLine + "  " + msg);
        }
    }

    public static void main(String[] args) throws IOException {
    
        System.setOut(new PrintStream(System.out, true, "UTF-8"));

        if (args.length == 1 && args[0].equals("--suite")) {
            System.exit(suite() ? 0 : 1);
        } 
        

        String files[] = args.length == 0 ? new String[]{ "test." + EXTENSION } : args;
        System.out.println("Dirbase: " + DIRBASE);
        //boolean todoOk = true;
        for (String file : files) {
            System.out.println("START: " + file);
            Errores errores = analizar(file);
            
            if (errores.mensajes.isEmpty()) {
                System.out.println("OK");
            } else {
                //todoOk = false;
                System.out.println("ERRORES (" + errores.mensajes.size() + ")");
                for (String m : errores.mensajes) System.out.println(m);
            }
            System.out.println("FINISH: " + file);
        }
       // System.exit(todoOk ? 0 : 1);
    }

    //Analiza un archivo (ruta relativa a DIRBASE) y devuelve sus errores
    static Errores analizar(String file) throws IOException {
        Errores errores = new Errores();

        CharStream in = CharStreams.fromFileName(DIRBASE + file);
        greenCodeLexer lexer = new greenCodeLexer(in);
        lexer.removeErrorListeners();
        lexer.addErrorListener(errores);

        CommonTokenStream tokens = new CommonTokenStream(lexer);
        greenCodeParser parser = new greenCodeParser(tokens);
        parser.removeErrorListeners();
        parser.addErrorListener(errores);

        greenCodeParser.StartContext tree = parser.start();

        // El visitor solo se ejecuta si el programa no tiene errores
        if (errores.mensajes.isEmpty()) {
            greenCodeCustomVisitor visitor = new greenCodeCustomVisitor();
            visitor.visit(tree);
        }
        return errores;
    }

    // Valida que validos/ se acepte e invalidos/ se rechace.
    static boolean suite() throws IOException {
        int total = 0, fallos = 0;
        for (String carpeta : new String[]{ "validos", "invalidos" }) {
            boolean debeAceptarse = carpeta.equals("validos");
            File[] archivos = new File(DIRBASE + carpeta).listFiles();
            if (archivos == null) {
                System.out.println("No existe la carpeta " + DIRBASE + carpeta);
                return false;
            }
            Arrays.sort(archivos);
            for (File f : archivos) {
                if (!f.getName().endsWith("." + EXTENSION)) continue;
                total++;
                String ruta = carpeta + "/" + f.getName();
                Errores errores = analizar(ruta);
                boolean aceptado = errores.mensajes.isEmpty();
                if (aceptado == debeAceptarse) {
                    System.out.println("PASA   " + (debeAceptarse ? "(válido)   " : "(inválido) ") + ruta);
                } else {
                    fallos++;
                    System.out.println("FALLA  " + (debeAceptarse ? "(debía aceptarse) " : "(debía rechazarse) ") + ruta);
                    for (String m : errores.mensajes) System.out.println(m);
                }
            }
        }
        System.out.println();
        System.out.println("Resultado: " + (total - fallos) + "/" + total + " pruebas correctas");
        return fallos == 0;
    }
}
