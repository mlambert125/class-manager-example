package com.example.classroom.daos;

import com.example.classroom.models.Student;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * Data access object for the students table
 */
@Component
public class StudentDao {
    /**
     * JdbcTemplate instance
     */
    private final JdbcTemplate jdbcTemplate;

    /**
     * Creates a new StudentDao
     *
     * @param dataSource The datasource to connect to
     */
    public StudentDao(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    /**
     * Returns a list of all students
     *
     * @return The list of students
     */
    public List<Student> getAllStudents() {
        return jdbcTemplate.query(
            "SELECT * FROM students order by first_name asc, last_name asc",
            this::mapRowToStudent
        );
    }

    /**
     * Returns a list of students by teacher id
     *
     * @param teacherId The id of the teacher
     * @return The list of students
     */
    public List<Student> getStudentsByTeacherId(int teacherId) {
        return jdbcTemplate.query(
            "SELECT * FROM students WHERE teacher_id = ? order by first_name asc, last_name asc",
            this::mapRowToStudent,
            teacherId
        );
    }

    /**
     * Returns a student by their id
     *
     * @param id The id of the student
     * @return The student
     */
    public Student getStudentById(int id) {
        try {
            return jdbcTemplate.queryForObject(
                "SELECT * FROM students WHERE id = ?",
                this::mapRowToStudent,
                id
            );
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new student
     *
     * @param student The student to create
     * @return The created student
     */
    public Student createStudent(Student student) {
        Integer id = jdbcTemplate.queryForObject(
            "INSERT INTO students (first_name, last_name, email, teacher_id) VALUES (?, ?, ?, ?) RETURNING id",
            Integer.class,
            student.getFirstName(),
            student.getLastName(),
            student.getEmail(),
            student.getTeacherId()
        );

        if (id != null) {
            return getStudentById(id);
        } else {
            return null;
        }
    }

    /**
     * Updates a student
     *
     * @param student The student to update
     * @return The updated student
     */
    public Student updateStudent(Student student) {
        int affectedRows = jdbcTemplate.update(
            "UPDATE students SET first_name = ?, last_name = ?, email = ?, teacher_id = ? WHERE id = ?",
            student.getFirstName(),
            student.getLastName(),
            student.getEmail(),
            student.getTeacherId(),
            student.getId()
        );

        if (affectedRows > 0) {
            return getStudentById(student.getId());
        } else {
            return null;
        }
    }

    /**
     * Deletes a student by their id
     *
     * @param id The id of the student
     * @return The number of affected rows
     */
    public int deleteStudent(int id) {
        return jdbcTemplate.update(
            "DELETE FROM students WHERE id = ?",
            id
        );
    }

    /**
     * Maps a row in the result set to a student
     *
     * @param row The result set
     * @param rowNumber The row number
     * @return The student
     * @throws SQLException If an error occurs
     */
    private Student mapRowToStudent(ResultSet row, int rowNumber) throws SQLException {
        Student student = new Student();
        student.setId(row.getInt("id"));
        student.setFirstName(row.getString("first_name"));
        student.setLastName(row.getString("last_name"));
        student.setEmail(row.getString("email"));
        student.setTeacherId(row.getInt("teacher_id"));

        return student;
    }
}
