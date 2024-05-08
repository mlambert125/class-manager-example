package com.example.classroom.models;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * User model
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    /**
     * User id
     */
    @Min(value = 5, message = "Username must be at least 5 characters")
    private String username;

    /**
     * User password
     */
    @Min(value = 5, message = "Password must be at least 5 characters")
    private String password;

    /**
     * User email
     */
    @Min(value = 5, message = "Email must be at least 5 characters")
    private String email;
}
