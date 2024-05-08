package com.example.classroom.controllers;

import com.example.classroom.daos.TeacherDao;
import com.example.classroom.models.Teacher;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Handles REST requests to /teachers/*
 */
@RestController
@RequestMapping("/teachers")
public class TeacherController {
    /**
     * Teacher data access object
     */
    private final TeacherDao teacherDao;

    /**
     * Creates a new TeacherController
     *
     * @param teacherDao The teacher data access object
     */
    public TeacherController(TeacherDao teacherDao) {
        this.teacherDao = teacherDao;
    }

    /**
     * Returns a list of all teachers
     *
     * @return The list of teachers
     */
    @GetMapping("")
    public List<Teacher> listTeachers() {
        return teacherDao.getAllTeachers();
    }

    /**
     * Returns a teacher by their id
     *
     * @param id The id of the teacher
     * @return The teacher
     */
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public Teacher getTeacherById(@PathVariable int id) {
        return teacherDao.getTeacherById(id);
    }

    /**
     * Adds a new teacher
     *
     * @param teacher The teacher to add
     * @return The added teacher
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("")
    public Teacher addTeacher(@Valid @RequestBody Teacher teacher) {
        return teacherDao.createTeacher(teacher);
    }

    /**
     * Updates a teacher
     *
     * @param id The id of the teacher
     * @param teacher The teacher to update
     * @return The updated teacher
     */
    @PutMapping("/{id}")
    public Teacher updateTeacher(@PathVariable int id, @Valid @RequestBody Teacher teacher) {
        teacher.setId(id);
        return teacherDao.updateTeacher(teacher);
    }

    /**
     * Deletes a teacher
     *
     * @param id The id of the teacher
     */
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public void deleteTeacher(@PathVariable int id) {
        teacherDao.deleteTeacher(id);
    }
}
