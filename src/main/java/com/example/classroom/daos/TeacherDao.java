package com.example.classroom.daos;

import com.example.classroom.models.Teacher;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * Data access object for the teachers table
 */
@Component
public class TeacherDao {
    /**
     * JdbcTemplate instance
     */
    private final JdbcTemplate jdbcTemplate;

    /**
     * Creates a new TeacherDao
     *
     * @param dataSource The datasource to connect to
     */
    public TeacherDao(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    /**
     * Returns a list of all teachers
     *
     * @return The list of teachers
     */
    public List<Teacher> getAllTeachers() {
        return jdbcTemplate.query(
            "SELECT * FROM teachers order by first_name asc, last_name asc",
            this::mapRowToTeacher
        );
    }

    /**
     * Returns a teacher by their id
     *
     * @param id The id of the teacher
     * @return The teacher
     */
    public Teacher getTeacherById(int id) {
        try {
            return jdbcTemplate.queryForObject(
                "SELECT * FROM teachers WHERE id = ?",
                this::mapRowToTeacher,
                id
            );
        } catch(EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * Creates a new teacher
     *
     * @param teacher The teacher to create
     * @return The created teacher
     */
    public Teacher createTeacher(Teacher teacher) {
        Integer id = jdbcTemplate.queryForObject(
            "INSERT INTO teachers (first_name, last_name, email) VALUES (?, ?, ?) RETURNING id",
            Integer.class,
            teacher.getFirstName(),
            teacher.getLastName(),
            teacher.getEmail()
        );

        if (id != null) {
            return getTeacherById(id);
        } else {
            return null;
        }
    }

    /**
     * Updates a teacher
     *
     * @param teacher The teacher to update
     * @return The updated teacher
     */
    public Teacher updateTeacher(Teacher teacher) {
        int affectedRows = jdbcTemplate.update(
            "UPDATE teachers SET first_name = ?, last_name = ?, email = ? WHERE id = ?",
            teacher.getFirstName(),
            teacher.getLastName(),
            teacher.getEmail(),
            teacher.getId()
        );

        if (affectedRows > 0) {
            return getTeacherById(teacher.getId());
        } else {
            return null;
        }
    }

    /**
     * Deletes a teacher by their id
     *
     * @param id The id of the teacher
     * @return The number of affected rows
     */
    public int deleteTeacher(int id) {
         return jdbcTemplate.update(
            "DELETE FROM teachers WHERE id = ?",
            id
        );
    }

    /**
     * Maps a row in the teachers table to a Teacher object
     *
     * @param row The row in the table
     * @param rowNumber The row number
     * @return The teacher
     * @throws SQLException If an error occurs
     */
    private Teacher mapRowToTeacher(ResultSet row, int rowNumber) throws SQLException {
        Teacher teacher = new Teacher();
        teacher.setId(row.getInt("id"));
        teacher.setFirstName(row.getString("first_name"));
        teacher.setLastName(row.getString("last_name"));
        teacher.setEmail(row.getString("email"));
        return teacher;
    }
}
