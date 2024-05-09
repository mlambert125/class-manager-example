export class ClassRoomApiSession {
    token = null;

    tryAutoLogin() {
        const token = localStorage.getItem('token');

        if (token && token !== '') {
            this.token = token;
            return true;
        } else {
            return false;
        }
    }

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
            const data = await response.json();
            this.token = data.accessToken.token;

            localStorage.setItem('token', this.token);
            return true;
        }
    }

    async logout() {
        this.token = null;
        localStorage.removeItem('token');
    }

    async getTeachers() {
        const response = await fetch('/teachers', {
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });

        if (response.status !== 200) {
            return null;
        } else {
            return await response.json();
        }
    }

    async getTeacher(id) {
        const response = await fetch(`/teachers/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });

        if (response.status !== 200) {
            return null;
        } else {
            return await response.json();
        }
    }

    async createTeacher(teacher) {
        const response = await fetch('/teachers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify(teacher)
        });
        if (response.status !== 201) {
            return null;
        } else {
            return await response.json();
        }
    }

    async updateTeacher(id, teacher) {
        const response = await fetch(`/teachers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify(teacher)
        });
        if (response.status !== 200) {
            return null;
        } else {
            return await response.json();
        }
    }

    async deleteTeacher(id) {
        const response = await fetch(`/teachers/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });
        return response.status === 204;
    }

    async getStudents(teacherId) {
        const response = await fetch(`/students?teacherId=${teacherId}`, {
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });

        if (response.status !== 200) {
            return null;
        } else {
            return await response.json();
        }
    }

    async getStudent(id) {
        const response = await fetch(`/students/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });

        if (response.status !== 200) {
            return null;
        } else {
            return await response.json();
        }
    }

    async createStudent(student) {
        const response = await fetch('/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify(student)
        });

        if (response.status !== 201) {
            return null;
        } else {
            return await response.json();
        }
    }

    async updateStudent(id, student) {
        const response = await fetch(`/students/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify(student)
        });

        if (response.status !== 200) {
            return null;
        } else {
            return await response.json();
        }
    }

    async deleteStudent(id) {
        const response = await fetch(`/students/${id}`, {
            method: 'DELETE',
            headers: {
                headers: {
                    'Authorization': 'Bearer ' + this.token
                }
            }
        });
        return response.status === 204;
    }

    async getUsers() {
        const response = await fetch('/users', {
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });

        if (response.status !== 200) {
            return null;
        } else {
            return await response.json();
        }
    }   

    async getUser(username) {
        const response = await fetch(`/users/${username}`, {
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });

        if (response.status !== 200) {
            return null;
        } else {
            return await response.json();
        }
    }

    async createUser(user) {
        const response = await fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify(user)
        });

        if (response.status !== 201) {
            return null;
        } else {
            return await response.json();
        }
    }

    async updateUser(username, user) {
        const response = await fetch(`/users/${username}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify(user)
        });

        if (response.status !== 200) {
            return null;
        } else {
            return await response.json();
        }
    }

    async deleteUser(username) {
        const response = await fetch(`/users/${username}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });
        return response.status === 204;
    }

    async getRolesForUser(username) {
        const response = await fetch('/roles', {
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });

        if (response.status !== 200) {
            return null;
        } else {
            return await response.json();
        }
    }

    async addRoleToUser(userId, role) {
        const response = await fetch(`/users/${userId}/roles/`, {
            method: 'POST',
            headers: {  
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            },
            body: role
        });
        return response.status == 201;
    }

    async removeRoleFromUser(userId, role) {
        const response = await fetch(`/users/${userId}/roles/${role}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });
        return response.status === 204;
    }   
}

export const session = new ClassRoomApiSession();
