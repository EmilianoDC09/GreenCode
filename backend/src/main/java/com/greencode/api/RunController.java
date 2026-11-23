package com.greencode.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class RunController {

    private final ExecutionService servicio;

    public RunController(ExecutionService servicio) {
        this.servicio = servicio;
    }

    @PostMapping("/run")
    public ResponseEntity<RunResponse> run(@RequestBody(required = false) RunRequest peticion) {
        if (peticion == null || peticion.code() == null || peticion.code().isBlank()) {
            return ResponseEntity.badRequest().body(RunResponse.soloError(
                    new RunError("peticion", null, null, "El campo 'code' es obligatorio y no puede estar vacío.")));
        }
        String entrada = peticion.input() == null ? "" : peticion.input();
        try {
            return ResponseEntity.ok(servicio.ejecutar(peticion.code(), entrada));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(RunResponse.soloError(
                    new RunError("servidor", null, null, "No se pudo iniciar el intérprete: " + e.getMessage())));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(RunResponse.soloError(
                    new RunError("servidor", null, null, "La ejecución fue interrumpida.")));
        }
    }
}
