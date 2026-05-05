package com.pu_deltaforce.resqnet_backend.service;

import com.pu_deltaforce.resqnet_backend.dto.LoginRequest;
import com.pu_deltaforce.resqnet_backend.dto.RegisterRequest;
import com.pu_deltaforce.resqnet_backend.model.User;
import com.pu_deltaforce.resqnet_backend.repository.UserRepository;
import com.pu_deltaforce.resqnet_backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists!";
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(User.Role.USER);

        userRepository.save(user);
        return "User registered successfully!";
    }

    private final JwtUtil jwtUtil;

    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }

        return jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    }
}