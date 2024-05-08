package com.example.classroom.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Teacher
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {
    /**
     * The serial id of the teacher (populated by postgres)
     */
    private int id;

    /**
     * First name of the teacher
     */
    @NotBlank(message = "First name is mandatory")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    /**
     * Last name of the teacher
     */
    @NotBlank(message = "Last name is mandatory")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    /**
     * Email address of the teacher
     */
    @NotBlank(message = "Email is mandatory")
    @Size(min = 5, max = 50, message = "Email must be between 5 and 50 characters")
    private String email;
}
