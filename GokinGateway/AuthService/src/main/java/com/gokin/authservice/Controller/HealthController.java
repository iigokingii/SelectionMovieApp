package com.gokin.authservice.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class HealthController {

    @GetMapping("/ready")
    public ResponseEntity<String> ready() {
        // Логика, которая проверяет, что сервис полностью готов
        return ResponseEntity.ok("AuthService is ready");
    }
}

