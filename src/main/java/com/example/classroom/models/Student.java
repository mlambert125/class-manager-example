package com.example.classroom.models;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * Represents a student in some class
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    /**
     * The serial id of the student (populated by postgres)
     */
    private int id;

    /**
     * First name of the student
     */
    @NotBlank(message = "First name is mandatory")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    /**
     * Last name of the student
     */
    @NotBlank(message = "Last name is mandatory")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    /**
     * Email address of the student
     */
    @NotBlank(message = "Email is mandatory")
    @Size(min = 5, max = 50, message = "Email must be between 5 and 50 characters")
    private String email;

    /**
     * Teacher that this student is assigned to
     */
    @Min(value = 1, message = "Teacher ID must be greater than 0")
    private int teacherId;
}
