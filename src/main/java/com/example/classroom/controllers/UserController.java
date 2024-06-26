package com.example.classroom.controllers;

import com.example.classroom.models.User;
import com.example.classroom.daos.UserDao;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * User controller
 */
@RestController
@RequestMapping("/users")
public class UserController {
    /**
     * User data access object
     */
    private UserDao userDao;

    /**
     * Constructor
     *
     * @param userDao user data access object
     */
    public UserController(UserDao userDao) {
        this.userDao = userDao;
    }

    /**
     * Get all users
     *
     * @return list of users
     */
    @GetMapping("")
    public List<User> getAllUsers() {
        return userDao.getAllUsers();
    }

    /**
     * Get user by username
     *
     * @param username username
     * @return user
     */
    @GetMapping("/{username}")
    public User getUser(@PathVariable String username) {
        return userDao.getUser(username);
    }

    /**
     * Create user
     *
     * @param user user
     * @return created user
     */
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("")
    public User createUser(@RequestBody User user) {
        return userDao.createUser(user);
    }

    /**
     * Update user
     *
     * @param username username
     * @param user user
     * @return updated user
     */
    @PutMapping("/{username}")
    public User updateUser(@PathVariable String username, @RequestBody User user) {
        return userDao.updateUser(user, false);
    }

    /**
     * Delete user
     *
     * @param username username
     */
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{username}")
    public void deleteUser(@PathVariable String username) {
        userDao.deleteUser(username);
    }

    /**
     * Get user roles
     *
     * @param username username
     * @return list of roles
     */
    @GetMapping("/{username}/roles")
    public List<String> getUserRoles(@PathVariable String username) {
        return userDao.getRolesForUser(username);
    }

    /**
     * Add user role
     *
     * @param username username
     * @param role role
     */
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/{username}/roles")
    public void addUserRole(@PathVariable String username, @RequestBody String role) {
        userDao.addRoleToUser(username, role);
    }

    /**
     * Remove user role
     *
     * @param username username
     * @param role role
     */
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{username}/roles/{role}")
    public void removeUserRole(@PathVariable String username, @PathVariable String role) {
        userDao.removeRoleFromUser(username, role);
    }
}
