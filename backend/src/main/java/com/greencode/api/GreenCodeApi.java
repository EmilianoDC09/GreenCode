package com.greencode.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/** Arranque de la API REST que expone el intérprete GreenCode. */
@SpringBootApplication
public class GreenCodeApi {

    public static void main(String[] args) {
        SpringApplication.run(GreenCodeApi.class, args);
    }
}
