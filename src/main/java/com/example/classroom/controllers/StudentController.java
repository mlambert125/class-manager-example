package com.example.classroom.controllers;

import com.example.classroom.daos.StudentDao;
import com.example.classroom.models.Student;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Handles REST requests to /students/*
 */
@RestController
@RequestMapping("/students")
public class StudentController {
    /**
     * Student data access object
     */
    private final StudentDao studentDao;

    /**
     * Creates a new StudentController
     *
     * @param studentDao The student data access object
     */
    public StudentController(StudentDao studentDao) {
        this.studentDao = studentDao;
    }

    /**
     * Returns a list of all students
     *
     * @param teacherId Optional teacher id to constrain which students are returned
     * @return The list of students
     */
    @GetMapping("")
    public List<Student> listStudents(
        @RequestParam(required = false) String teacherId
    ) {
        if (teacherId != null) {
            return studentDao.getStudentsByTeacherId(Integer.parseInt(teacherId));
        } else {
            return studentDao.getAllStudents();
        }
    }

    /**
     * Returns a student by their id
     *
     * @param id The id of the student
     * @return The student
     */
    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable int id) {
        return studentDao.getStudentById(id);
    }

    /**
     * Adds a new student
     *
     * @param student The student to add
     * @return The added student
     */
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("")
    public Student addStudent(@Valid @RequestBody Student student) {
        return studentDao.createStudent(student);
    }

    /**
     * Updates a student
     *
     * @param id The id of the student
     * @param student The student to update
     * @return The updated student
     */
    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable int id, @Valid @RequestBody Student student) {
        student.setId(id);
        return studentDao.updateStudent(student);
    }

    /**
     * Deletes a student
     *
     * @param id The id of the student
     */
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable int id) {
        studentDao.deleteStudent(id);
    }
}
