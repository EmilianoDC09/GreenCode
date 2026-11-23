package com.greencode;

import java.util.HashMap;
import java.util.Scanner;

import com.greencode.greenCodeParser.AsignacionContext;
import com.greencode.greenCodeParser.BloqueContext;
import com.greencode.greenCodeParser.DeclaracionContext;
import com.greencode.greenCodeParser.EntradaContext;
import com.greencode.greenCodeParser.ExpresionContext;
import com.greencode.greenCodeParser.FuncionContext;
import com.greencode.greenCodeParser.LlamadaContext;
import com.greencode.greenCodeParser.MadurarContext;
import com.greencode.greenCodeParser.MonitorearContext;
import com.greencode.greenCodeParser.ParcelaContext;
import com.greencode.greenCodeParser.RegarContext;
import com.greencode.greenCodeParser.RetornoContext;
import com.greencode.greenCodeParser.SalidaContext;
import com.greencode.greenCodeParser.SentenciaContext;
import com.greencode.greenCodeParser.StartContext;


public class greenCodeCustomVisitor extends greenCodeBaseVisitor<Simbolo> {

    public final HashMap<String, Simbolo> tablaSimbolos = new HashMap<>();
    public final HashMap<String, FuncionContext> tablaFunciones = new HashMap<>();
    private final Scanner scanner = new Scanner(System.in);

    private String tipoRetornoEsperado = null;

    private static class RetornoException extends RuntimeException {
        final Simbolo valor;
        RetornoException(Simbolo valor) {
            this.valor = valor;
        }
    }


    @Override
    public Simbolo visitStart(StartContext ctx) {

       for(FuncionContext intr: ctx.funcion()){
        visit(intr);
       }

       if (ctx.parcela() != null) {
        return visit(ctx.parcela());
       }

       return null;
    }

    
    @Override
    public Simbolo visitFuncion(FuncionContext ctx) {
        String nombreFunc = ctx.ID_PARCELA().getText();
        if (tablaFunciones.containsKey(nombreFunc)) {
            throw new RuntimeException("Error: el injerto '" + nombreFunc + "' ya fue declarado. (Linea: " + ctx.getStart().getLine() + ")");
        }
        tablaFunciones.put(nombreFunc, ctx);
        System.out.println("Se registro funcion (injerto): " + nombreFunc);
        return null;
    }


    @Override
    public Simbolo visitParcela(ParcelaContext ctx) {
        System.out.println("Iniciando parcela: " + ctx.ID_PARCELA().getText());
        if (ctx.bloque() != null) {
            System.out.println("Se identifico un bloque");
            return visit(ctx.bloque());
        }

        System.out.println("Cosecha finalizada.");
        return null;
    }

    @Override
    public Simbolo visitBloque(BloqueContext ctx) {
        for(SentenciaContext setn : ctx.sentencia()){
            visit(setn);
        }

        return null;
    }

    @Override
    public Simbolo visitSentencia(SentenciaContext ctx) {
        if (ctx.declaracion() != null) {
            System.out.println("Sentencia: declaracion (brotar)");
            return visit(ctx.declaracion());
        } else if (ctx.asignacion() != null) {
            System.out.println("Sentencia: asignacion (nutrir)");
            return visit(ctx.asignacion());
        } else if (ctx.salida() != null) {
            System.out.println("Sentencia: salida (emitir)");
            return visit(ctx.salida());
        } else if (ctx.entrada() != null) {
            System.out.println("Sentencia: entrada (captar)");
            return visit(ctx.entrada());
        } else if (ctx.retorno() != null) {
            System.out.println("Sentencia: retorno (fruto)");
            return visit(ctx.retorno());
        } else if (ctx.monitorear() != null) {
            System.out.println("Sentencia: monitorear");
            return visit(ctx.monitorear());
        } else if (ctx.regar() != null) {
            System.out.println("Sentencia: regar");
            return visit(ctx.regar());
        } else if (ctx.madurar() != null) {
            System.out.println("Sentencia: madurar");
            return visit(ctx.madurar());
        }
        return null;
    }

    @Override
    public Simbolo visitDeclaracion(DeclaracionContext ctx) {
        String id = ctx.ID_VARIABLE().getText();
        String tipoEsperado = ctx.tipoDato().getText(); // semilla, clima, actuador o contexto

        if (tablaSimbolos.containsKey(id)) {
            throw new RuntimeException("Error: la variable '" + id + "' ya fue declarada. (Linea: " + ctx.getStart().getLine() + ")");
        }

        Simbolo simboloFinal;
        
        if (ctx.expresion() != null) {
            Simbolo valorExp = visit(ctx.expresion());
            if (!esTipoCompatible(tipoEsperado, valorExp.tipo)) {
                throw new RuntimeException("Error: no se puede asignar tipo '" + valorExp.tipo +
                        "' a la variable '" + id + "' de tipo '" + tipoEsperado + "'. (Linea: " + ctx.getStart().getLine() + ")");
            }
            Object valorAjustado = convertirValor(tipoEsperado, valorExp);
            simboloFinal = new Simbolo(tipoEsperado, valorAjustado);
        } else {
            simboloFinal = new Simbolo(tipoEsperado, valorPorDefecto(tipoEsperado));
        }

        tablaSimbolos.put(id, simboloFinal);
        System.out.println("Se declaro (brotar): " + id + " (" + tipoEsperado + ") = " + simboloFinal);
        return simboloFinal;
    }

    @Override
    public Simbolo visitAsignacion(AsignacionContext ctx) {
        String id = ctx.ID_VARIABLE().getText();

        Simbolo varDeclarada = tablaSimbolos.get(id);
        if (!tablaSimbolos.containsKey(id)) {
            throw new RuntimeException("Error: variable " + id + " no declarada con 'brotar'. (Linea: " + ctx.getStart().getLine() + ")");
        }

        Simbolo valorExp = visit(ctx.expresion());
        if (!esTipoCompatible(varDeclarada.tipo, valorExp.tipo)) {
            throw new RuntimeException("Error: incompatibilidad de tipos al asignar '" + valorExp.tipo +
                    "' a '" + id + "' (esperado: '" + varDeclarada.tipo + "'). (Linea: " + ctx.getStart().getLine() + ")");
        }
        
        varDeclarada.valor = convertirValor(varDeclarada.tipo, valorExp);
        System.out.println("Se asigno (nutrir): " + id + " = " + varDeclarada);
        return varDeclarada;
    }

    @Override
    public Simbolo visitSalida(SalidaContext ctx) {
        if (ctx.expresion() != null) {
            Simbolo res = visit(ctx.expresion());
            System.out.println("Emitir: " + res);
        }
        return null;
    }

    @Override
    public Simbolo visitEntrada(EntradaContext ctx) {
        String id = ctx.ID_VARIABLE().getText();

        Simbolo varDeclarada = tablaSimbolos.get(id);
        if (varDeclarada == null) {
            throw new RuntimeException("Error: variable " + id + " no declarada antes de 'captar'. (Linea: " + ctx.getStart().getLine() + ")");
        }
        System.out.print("Captar valor para " + id + ": ");
        String entrada = scanner.nextLine().trim();

        try {
            switch (varDeclarada.tipo) {
                case "semilla":
                    varDeclarada.valor = Integer.parseInt(entrada);
                    break;
                case "clima":
                    varDeclarada.valor = Float.parseFloat(entrada);
                    break;
                case "actuador":
                    if (entrada.equals("encendido")) varDeclarada.valor = true;
                    else if (entrada.equals("apagado")) varDeclarada.valor = false;
                    else throw new IllegalArgumentException();
                    break;
                case "contexto":
                    varDeclarada.valor = entrada;
                    break;
            }
        } catch (Exception e) {
            throw new RuntimeException("Error: entrada invalida '" + entrada + "' para el tipo '" + varDeclarada.tipo + "'. (Linea: " + ctx.getStart().getLine() + ")");
        }

        return varDeclarada;
    }

    @Override 
    public Simbolo visitRetorno(RetornoContext ctx) {

        if (tipoRetornoEsperado == null) {
            throw new RuntimeException("Error: la sentencia 'fruto' solo puede usarse dentro de un 'injerto'. (Linea: " + ctx.getStart().getLine() + ")");
        }

        Simbolo valorRetorno = visit(ctx.expresion());
        if (!esTipoCompatible(tipoRetornoEsperado, valorRetorno.tipo)) {
            throw new RuntimeException("Error: el injerto debe producir '" + tipoRetornoEsperado +
                    "', pero 'fruto' intenta devolver '" + valorRetorno.tipo + "'. (Linea: " + ctx.getStart().getLine() + ")");
        }

        Simbolo retornoFinal = new Simbolo(tipoRetornoEsperado, convertirValor(tipoRetornoEsperado, valorRetorno));
        throw new RetornoException(retornoFinal);
    }

    @Override
    public Simbolo visitMonitorear(MonitorearContext ctx) {

       for (int i = 0; i < ctx.expresion().size(); i++) {
            Simbolo cond = visit(ctx.expresion(i));
            if ((Boolean) cond.valor) {
                System.out.println(i == 0 ? "Se ejecuto rama FLORECE" : "Se ejecuto rama MARCHITA (" + i + ")");
                visit(ctx.bloque(i));
                return null;
            }
        }

        if (ctx.bloque().size() > ctx.expresion().size()) {
            System.out.println("Se ejecuto rama REPOSO");
            visit(ctx.bloque(ctx.expresion().size()));
        }
        return null;

    }

    @Override
    public Simbolo visitRegar(RegarContext ctx) {
        while (true) {
            Simbolo cond = visit(ctx.expresion());
            if (!(Boolean) cond.valor) {
                break;
            }
            System.out.println("Ejecutando ciclo REGAR");
            visit(ctx.bloque());
        }
        return null;
    }

    @Override
    public Simbolo visitMadurar(MadurarContext ctx) {
        String id = ctx.ID_VARIABLE().getText();
        Simbolo inicio = visit(ctx.expresion(0));
        Simbolo fin = visit(ctx.expresion(1));
        Simbolo paso = (ctx.expresion().size() > 2) ? visit(ctx.expresion(2)) : new Simbolo("semilla", 1);
        
        if (!"semilla".equals(inicio.tipo) || !"semilla".equals(fin.tipo) || !"semilla".equals(paso.tipo)) {
            throw new RuntimeException("Error: los limites y el 'paso' de 'madurar' deben ser de tipo 'semilla'. (Linea: " + ctx.getStart().getLine() + ")");
        }

        int inicioInt = (Integer) inicio.valor;
        int finInt = (Integer) fin.valor;
        int pasoInt = (Integer) paso.valor;

        if (pasoInt == 0) {
            throw new RuntimeException("Error: el 'paso' en madurar no puede ser 0.");
        }

        tablaSimbolos.put(id, new Simbolo("semilla", inicioInt));

        if (pasoInt > 0) {
            while ((Integer) tablaSimbolos.get(id).valor <= finInt) {
                System.out.println("Ejecutando ciclo MADURAR (" + id + " = " + tablaSimbolos.get(id) + ")");
                visit(ctx.bloque());
                int actual = (Integer) tablaSimbolos.get(id).valor;
                tablaSimbolos.put(id, new Simbolo("semilla", actual + pasoInt));
            }
        } else {
            while ((Integer) tablaSimbolos.get(id).valor >= finInt) {
                System.out.println("Ejecutando ciclo MADURAR (" + id + " = " + tablaSimbolos.get(id) + ")");
                visit(ctx.bloque()); 
                int actual = (Integer) tablaSimbolos.get(id).valor;
                tablaSimbolos.put(id, new Simbolo("semilla", actual + pasoInt));
            }
        }
        return null;
    }

    @Override
    public Simbolo visitLlamada(LlamadaContext ctx) {
        String nombreFunc = ctx.ID_PARCELA().getText();
        FuncionContext funcCtx = tablaFunciones.get(nombreFunc);

        if (funcCtx == null) {
            throw new RuntimeException("Error: injerto '" + nombreFunc + "' no definido. (Linea: " + ctx.getStart().getLine() + ")");
        }

        int numParams = (funcCtx.parametros() != null) ? funcCtx.parametros().parametro().size() : 0;
        int numArgs = (ctx.argumentos() != null) ? ctx.argumentos().expresion().size() : 0;

        if (numParams != numArgs) {
            throw new RuntimeException("Error: el injerto '" + nombreFunc + "' esperaba " + numParams +
                    " argumentos, pero recibio " + numArgs + ". (Linea: " + ctx.getStart().getLine() + ")");
        }

        Simbolo[] argsEvaluados = new Simbolo[numArgs];
        for (int i = 0; i < numArgs; i++) {
            String tipoParam = funcCtx.parametros().parametro(i).tipoDato().getText();
            Simbolo argVal = visit(ctx.argumentos().expresion(i));

            if (!esTipoCompatible(tipoParam, argVal.tipo)) {
                throw new RuntimeException("Error: argumento " + (i + 1) + " de '" + nombreFunc +
                        "' incompatible (esperado: '" + tipoParam + "', recibido: '" + argVal.tipo + "'). (Linea: " + ctx.getStart().getLine() + ")");
            }
            argsEvaluados[i] = new Simbolo(tipoParam, convertirValor(tipoParam, argVal));
        }

        HashMap<String, Simbolo> respaldoTabla = new HashMap<>(tablaSimbolos);
        String respaldoRetorno = tipoRetornoEsperado;

        tablaSimbolos.clear();
        for (int i = 0; i < numParams; i++) {
            String paramName = funcCtx.parametros().parametro(i).ID_VARIABLE().getText();
            tablaSimbolos.put(paramName, argsEvaluados[i]);
        }

        String tipoProduce = funcCtx.tipoDato().getText();
        tipoRetornoEsperado = tipoProduce;
        Simbolo resultado = new Simbolo(tipoProduce, valorPorDefecto(tipoProduce));

        try {
            visit(funcCtx.bloque());
        } catch (RetornoException e) {
            resultado = e.valor;
        } finally {
            tablaSimbolos.clear();
            tablaSimbolos.putAll(respaldoTabla);
            tipoRetornoEsperado = respaldoRetorno;
        }

        return resultado;
    }
    
    
    @Override
    public Simbolo visitExpresion(ExpresionContext ctx) {
        int linea = ctx.getStart().getLine();

        //Literales y variables
        if (ctx.LIT_SEMILLA() != null) {
            return new Simbolo("semilla", Integer.parseInt(ctx.LIT_SEMILLA().getText()));
        }
        if (ctx.LIT_CLIMA() != null) {
            return new Simbolo("clima", Float.parseFloat(ctx.LIT_CLIMA().getText()));
        }
        if (ctx.LIT_ACTUADOR() != null) {
            return new Simbolo("actuador", ctx.LIT_ACTUADOR().getText().equals("encendido"));
        }
        if (ctx.LIT_CONTEXTO() != null) {
            return new Simbolo("contexto", ctx.LIT_CONTEXTO().getText().replace("\"", ""));
        }
        if (ctx.ID_VARIABLE() != null) {
            String id = ctx.ID_VARIABLE().getText();
            Simbolo sim = tablaSimbolos.get(id);
            if (sim == null) {
                throw new RuntimeException("Error: variable '" + id + "' no declarada. (Linea: " + linea + ")");
            }
            return sim;
        }
        if (ctx.llamada() != null) {
            return visit(ctx.llamada());
        }

        // Paréntesis
        if (ctx.PAR_IZQ() != null) {
            return visit(ctx.expresion(0));
        }

        // Operadores unarios
        if (ctx.getChildCount() == 2) {
            Simbolo op = visit(ctx.expresion(0));
            if (ctx.RESTA() != null) {
                if ("semilla".equals(op.tipo)) return new Simbolo("semilla", -(Integer) op.valor);
                if ("clima".equals(op.tipo)) return new Simbolo("clima", -(Float) op.valor);
                throw new RuntimeException("Error: operador '-' no aplicable al tipo '" + op.tipo + "'. (Linea: " + linea + ")");
            }
            if (ctx.OP_NO() != null) {
                if (!"actuador".equals(op.tipo)) {
                    throw new RuntimeException("Error: operador 'no' requiere tipo 'actuador', se recibio '" + op.tipo + "'. (Linea: " + linea + ")");
                }
                return new Simbolo("actuador", !(Boolean) op.valor);
            }
        }

        // Operadores binarios
        if (ctx.expresion().size() == 2) {
            Simbolo izq = visit(ctx.expresion(0));
            Simbolo der = visit(ctx.expresion(1));

            // Aritméticos
            if (ctx.SUMA() != null || ctx.RESTA() != null || ctx.MULT() != null || ctx.DIV() != null) {
                // Permitir concatenación de contexto con '+'
                if (ctx.SUMA() != null && ("contexto".equals(izq.tipo) || "contexto".equals(der.tipo))) {
                    return new Simbolo("contexto", izq.toString() + der.toString());
                }

                if (!esNumerico(izq.tipo) || !esNumerico(der.tipo)) {
                    throw new RuntimeException("Error: operacion aritmetica invalida entre '" +
                            izq.tipo + "' y '" + der.tipo + "'. (Linea: " + linea + ")");
                }

                boolean esClima = "clima".equals(izq.tipo) || "clima".equals(der.tipo);
                float vIzq = ((Number) izq.valor).floatValue();
                float vDer = ((Number) der.valor).floatValue();

                if (ctx.DIV() != null && vDer == 0f) {
                    throw new RuntimeException("Error: division entre cero. (Linea: " + linea + ")");
                }

                float res = 0f;
                if (ctx.SUMA() != null) res = vIzq + vDer;
                else if (ctx.RESTA() != null) res = vIzq - vDer;
                else if (ctx.MULT() != null) res = vIzq * vDer;
                else if (ctx.DIV() != null) res = vIzq / vDer;

                return esClima ? new Simbolo("clima", res) : new Simbolo("semilla", (int) res);
            }

            // Relacionales de orden 
            if (ctx.OP_SUPERA() != null || ctx.OP_DEBAJO() != null) {
                if (!esNumerico(izq.tipo) || !esNumerico(der.tipo)) {
                    throw new RuntimeException("Error: operadores 'supera/debajo' solo aplican a tipos numericos ('semilla' o 'clima'). (Linea: " + linea + ")");
                }
                float vIzq = ((Number) izq.valor).floatValue();
                float vDer = ((Number) der.valor).floatValue();
                boolean resultado = ctx.OP_SUPERA() != null ? (vIzq > vDer) : (vIzq < vDer);
                return new Simbolo("actuador", resultado);
            }

            // Relacionales de igualdad 
            if (ctx.OP_COINCIDE() != null || ctx.OP_DIFIERE() != null) {
                if (!esTipoCompatible(izq.tipo, der.tipo) && !esTipoCompatible(der.tipo, izq.tipo)) {
                    throw new RuntimeException("Error: no se puede comparar '" + izq.tipo + "' con '" + der.tipo + "'. (Linea: " + linea + ")");
                }
                boolean iguales;
                if (esNumerico(izq.tipo) && esNumerico(der.tipo)) {
                    iguales = Float.compare(((Number) izq.valor).floatValue(), ((Number) der.valor).floatValue()) == 0;
                } else {
                    iguales = izq.valor.equals(der.valor);
                }
                return new Simbolo("actuador", ctx.OP_COINCIDE() != null ? iguales : !iguales);
            }

            // Lógicos 
            if (ctx.OP_FUSION() != null || ctx.OP_RELEVO() != null) {
                if (!"actuador".equals(izq.tipo) || !"actuador".equals(der.tipo)) {
                    throw new RuntimeException("Error: operadores 'fusion/relevo' requieren operandos de tipo 'actuador'. (Linea: " + linea + ")");
                }
                boolean bIzq = (Boolean) izq.valor;
                boolean bDer = (Boolean) der.valor;
                return new Simbolo("actuador", ctx.OP_FUSION() != null ? (bIzq && bDer) : (bIzq || bDer));
            }
        }

        return null;
    }

    private boolean esNumerico(String tipo) {
        return "semilla".equals(tipo) || "clima".equals(tipo);
    }

    private boolean esTipoCompatible(String esperado, String recibido) {
        if (esperado.equals(recibido)) return true;
        // un 'clima' (float) puede recibir una 'semilla' (int)
        return "clima".equals(esperado) && "semilla".equals(recibido);
    }

    private Object convertirValor(String tipoDestino, Simbolo origen) {
        if ("clima".equals(tipoDestino) && origen.valor instanceof Number) {
            return ((Number) origen.valor).floatValue();
        }
        return origen.valor;
    }

    private Object valorPorDefecto(String tipo) {
        switch (tipo) {
            case "semilla":  return 0;
            case "clima":    return 0.0f;
            case "actuador": return false;
            case "contexto": return "";
            default:         return null;
        }
    }

}
