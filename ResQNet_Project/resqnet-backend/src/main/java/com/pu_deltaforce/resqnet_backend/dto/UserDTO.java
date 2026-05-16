package com.pu_deltaforce.resqnet_backend.dto;

import com.pu_deltaforce.resqnet_backend.model.User.Role;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
}