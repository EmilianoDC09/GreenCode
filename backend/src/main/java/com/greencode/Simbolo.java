package com.greencode;

public class Simbolo {

    public enum TipoDato {
        CLIMA,      // Double
        ACTUADOR,   //  Boolean
        SEMILLA,    //  Integer
        CONTEXTO    // String
    }

    public String tipo;
    public Object valor;

    public Simbolo(String tipo, Object valor) {
        this.tipo = tipo;
        this.valor = valor;
    }

    @Override
    public String toString() {
        return String.valueOf(valor);
    }
    
}