import './server-types.js';

/**
 * A class that represents a session with the Classroom API.
 */
export class ClassRoomApiSession {
    /**
     * The token used to authenticate with the API.
     * 
     * @type {string?}
     */
    token = null;

    /**
     * Tries to automatically log in using a token stored in local storage.
     * 
     * @returns {boolean} Whether the login was successful.
     */
    tryAutoLogin() {
        const token = localStorage.getItem('token');

        if (token && token !== '') {
            this.token = token;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Logs in using a username and password.
     * 
     * @param {string} username The username to log in with.
     * @param {string} password The password to log in with.
     * 
     * @returns {Promise<boolean>} Whether the login was successful.
     */
    async login(username, password) {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        });

        if (response.status !== 200) {
            return false;
        } else {
            /** @type TokenResponse */
            const data = await response.json();
            this.token = data.accessToken.token;

            localStorage.setItem('token', this.token);
            return true;
        }
    }

    /**
     * Logs out of the API.
     * 
     * @returns {Promise<void>}
     */
    async logout() {
        this.token = null;
        localStorage.removeItem('token');
        window.dispatchEvent(new CustomEvent('logout'));
    }

    /**
     * Gets all teachers.
     * 
     * @returns {Promise<Teacher[]|null>} The teachers, or null if the request failed.
     */
    async getTeachers() {
        const response = await fetch('/teachers', {
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });

        if (response.status === 401) {
            this.logout();
            return null;
        } else if (response.status !== 200) {
            return null;
        } else {
            return await response.json();
        }
    }

    /**
     * Gets a teacher by ID.
     * 
     * @param {number} id The ID of the teacher to get.
     * @returns {Promise<Teacher|null>} The teacher, or null if the request failed.
     */
    async getTeacher(id) {
        const response = await fetch(`/teachers/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });

        if (response.status === 401) {
            this.logout();
            return null;
        } else if (response.status !== 200) {
            return null;
        } else {
            return await response.json();
        }
    }

    /**
     * Creates a teacher.
     * 
     * @param {Teacher} teacher The teacher to create.
     * @returns {Promise<Teacher|null>} The created teacher, or null if the request failed.
     */
    async createTeacher(teacher) {
        const response = await fetch('/teachers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify(teacher)
        });
        if (response.status === 401) {
            this.logout();
            return null;
        } else if (response.status !== 201) {
            return null;
        } else {
            return await response.json();
        }
    }

    /**
     * Updates a teacher.
     * 
     * @param {number} id The ID of the teacher to update.
     * @param {Teacher} teacher The teacher to update.
     * @returns {Promise<Teacher|null>} The updated teacher, or null if the request failed.
     */
    async updateTeacher(id, teacher) {
        const response = await fetch(`/teachers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify(teacher)
        });
        if (response.status === 401) {
            this.logout();
            return null;
        } else if (response.status !== 200) {
            return null;
        } else {
            return await response.json();
        }
    }

    /**
     * Deletes a teacher.
     *
     * @param {number} id The ID of the teacher to delete.
     * @returns {Promise<boolean>} Whether the deletion was successful.
     */
    async deleteTeacher(id) {
        const response = await fetch(`/teachers/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });
        return response.status === 204;
    }

    /**
     * Gets all students.
     * 
     * @param {number} teacherId The ID of the teacher to get students for.
     * @returns {Promise<Student[]|null>} The students, or null if the request failed.
     */
    async getStudents(teacherId) {
        const response = await fetch(`/students?teacherId=${teacherId}`, {
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });

        if (response.status === 401) {
            this.logout();
            return null;
        } else if (response.status !== 200) {
            return null;
        } else {
            return await response.json();
        }
    }

    /**
     * Gets a student by ID.
     * 
     * @param {number} id The ID of the student to get.
     * @returns {Promise<Student|null>} The student, or null if the request failed.
     */
    async getStudent(id) {
        const response = await fetch(`/students/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });

        if (response.status === 401) {
            this.logout();
            return null;
        } else if (response.status !== 200) {
            return null;
        } else {
            return await response.json();
        }
    }

    /**
     * Creates a student.
     * 
     * @param {Student} student The student to create.
     * @returns {Promise<Student|null>} The created student, or null if the request failed.
     */ 
    async createStudent(student) {
        const response = await fetch('/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify(student)
        });

        if (response.status === 401) {
            this.logout();
            return null;
        } else if (response.status !== 201) {
            return null;
        } else {
            return await response.json();
        }
    }

    /**
     * Updates a student.
     * 
     * @param {number} id The ID of the student to update.
     * @param {Student} student The student to update.
     * @returns {Promise<Student|null>} The updated student, or null if the request failed.
     */
    async updateStudent(id, student) {
        const response = await fetch(`/students/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify(student)
        });

        if (response.status === 401) {
            this.logout();
            return null;
        } else if (response.status !== 200) {
            return null;
        } else {
            return await response.json();
        }
    }

    /**
     * Deletes a student.
     * 
     * @param {number} id The ID of the student to delete. 
     * @returns {Promise<boolean>} Whether the deletion was successful.
     */
    async deleteStudent(id) {
        const response = await fetch(`/students/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });
        if (response.status === 401) {
            this.logout();
            return null;
        } else { 
            return response.status === 204;
        }
    }

    /**
     * Gets all users.
     * 
     * @returns {Promise<User[]|null>} The users, or null if the request failed.
     */
    async getUsers() {
        const response = await fetch('/users', {
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });
        if (response.status === 401) {
            this.logout();
            return null;
        } else if (response.status !== 200) {
            return null;
        } else {
            return await response.json();
        }
    }   

    /**
     * Gets a user by username.
     * 
     * @param {string} username The username of the user to get. 
     * @returns {Promise<User|null>} The user, or null if the request failed.
     */
    async getUser(username) {
        const response = await fetch(`/users/${username}`, {
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });

        if (response.status === 401) {
            this.logout();
            return null;
        } else if (response.status !== 200) {
            return null;
        } else {
            return await response.json();
        }
    }

    /**
     * Creates a user.
     * 
     * @param {User} user The user to create.
     * @returns {Promise<User|null>} The created user, or null if the request failed.
     */
    async createUser(user) {
        const response = await fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify(user)
        });

        if (response.status === 401) {
            this.logout();
            return null;
        } else if (response.status !== 201) {
            return null;
        } else {
            return await response.json();
        }
    }

    /**
     * Updates a user.
     * 
     * @param {string} username The username of the user to update.
     * @param {User} user The user to update.
     * @returns {Promise<User|null>} The updated user, or null if the request failed.
     */
    async updateUser(username, user) {
        const response = await fetch(`/users/${username}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify(user)
        });

        if (response.status === 401) {
            this.logout();
            return null;
        } else if (response.status !== 200) {
            return null;
        } else {
            return await response.json();
        }
    }

    /**
     * Deletes a user.
     * 
     * @param {string} username The username of the user to delete.
     * @returns {Promise<boolean>} Whether the deletion was successful.
     */
    async deleteUser(username) {
        const response = await fetch(`/users/${username}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });
        if (response.status === 401) {
            this.logout();
            return null;
        } else {
            return response.status === 204;
        }
    }

    /**
     * Gets all roles.
     * 
     * @returns {Promise<string[]|null>} The roles, or null if the request failed.
     */
    async getRolesForUser(username) {
        const response = await fetch('/roles', {
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });

        if (response.status === 401) {
            this.logout();
            return null;
        } else if (response.status !== 200) {
            return null;
        } else {
            return await response.json();
        }
    }

    /**
     * Adds a role to a user.
     * 
     * @param {string} userId The ID of the user to add the role to. 
     * @param {string} role The role to add.
     * @returns {Promise<boolean>} Whether the addition was successful.
     */
    async addRoleToUser(userId, role) {
        const response = await fetch(`/users/${userId}/roles/`, {
            method: 'POST',
            headers: {  
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            },
            body: role
        });
        if (response.status === 401) {
            this.logout();
            return null;
        } else {
            return response.status === 201;
        }
    }

    /**
     * Removes a role from a user.
     * 
     * @param {string} userId The ID of the user to remove the role from.
     * @param {string} role The role to remove.
     * @returns {Promise<boolean>} Whether the removal was successful.
     */
    async removeRoleFromUser(userId, role) {
        const response = await fetch(`/users/${userId}/roles/${role}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });
        if (response.status === 401) {
            this.logout();
            return null;
        } else {
            return response.status === 204;
        }
    }   
}

export const session = new ClassRoomApiSession();
