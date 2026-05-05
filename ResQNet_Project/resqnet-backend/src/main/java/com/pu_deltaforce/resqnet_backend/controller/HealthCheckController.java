package com.pu_deltaforce.resqnet_backend.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthCheckController {

    @GetMapping("/health")
    public String healthCheck() {
        return "ResQNet Backend is running! 🚀";
    }

    @GetMapping("/protected")
    public String protectedRoute() {
        return "You are authenticated!";
    }
}
