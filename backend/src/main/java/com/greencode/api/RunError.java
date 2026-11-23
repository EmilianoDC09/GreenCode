package com.greencode.api;

/** type: lexico | sintactico | semantico | ejecucion | peticion | servidor */
public record RunError(String type, Integer line, Integer col, String message) {
}
