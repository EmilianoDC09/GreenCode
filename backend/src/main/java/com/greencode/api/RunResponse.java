package com.greencode.api;

import java.util.List;

/** Respuesta de POST /api/run. Ver docs/api.md. */
public record RunResponse(boolean ok, List<String> output, List<String> trace, List<RunError> errors, long timeMs) {

    static RunResponse soloError(RunError error) {
        return new RunResponse(false, List.of(), List.of(), List.of(error), 0);
    }
}
