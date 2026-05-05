package com.pu_deltaforce.resqnet_backend.controller;


import com.pu_deltaforce.resqnet_backend.dto.RegisterRequest;
import com.pu_deltaforce.resqnet_backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }
}
