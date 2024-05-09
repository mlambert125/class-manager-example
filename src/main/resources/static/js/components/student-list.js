import { session } from '../classroom-api-session.js';
import './icon-pen.js';
import './icon-trash.js';

const view = /*html*/`
<style>
    :host {
        padding: 1rem;

        h1 {
            &:before {
                content: 'Instructor - ';
            }
        }

        #teacher-details {
            display: block;

            >button {
                cursor: pointer;
                width: 150px;
            }

            #teacher-students {
                width: 400px;
                border-top: 1px dotted #999;
                padding-left: 0;


                li {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-block: 0.35rem;
                    padding-inline: 1rem;
                    border-bottom: 1px dotted #999;
                    border-inline: 1px dotted #999;
                    &:nth-child(odd) {
                        background-color: #eee;
                    }

                    label {
                        display: flex;
                        gap: 0.5rem;

                        .student-email {
                            font-size: 0.8rem;
                            color: #666;

                            &:before {
                                content: '(';
                            }
                            &:after {
                                content: ')';
                            }
                        }
                    }
                    span {
                        display: flex-inline;

                        button {
                            cursor: pointer;
                            padding: 0.25rem;
                            border: 0;
                            background-color: transparent;
                        }
                    }
                }
            }
        }
        dialog {
            border: 1px solid #ccc;
            border-radius: 30px;
            width: 400px;
            padding: 2rem;

            h1 {
                margin-top: 10px;
                margin-bottom: 1rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid #ccc;
                font-size: 1.2rem;
            }

            form {
                label {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    align-items: center;
                    margin-bottom: 1rem;

                    input {
                        padding: 0.5rem;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        &:focus {
                            outline: 1px solid steelblue;
                        }
                    }
                }
                .buttons {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;

                    button {
                        width: 125px;
                        padding: 0.5rem 1rem;
                        border: 0;
                        border-radius: 5px;
                        background-color: lightsteelblue;
                        color: black;
                        cursor: pointer;

                        &:focus {
                            outline: 1px solid steelblue;
                        }
                    }
                }
            }
        }
    }
</style>
<div id="teacher-details">
    <h1 id="teacher-header"></h1>
    <hr>
    <button id="add-student" class="action">
        <i class="bi bi-person-fill"></i>
        Add Student
    </button>
    <ul id="teacher-students"></ul>
</div>
<template id="student-template">
    <li>
        <label>
            <span class="student-name"></span>
            <span class="student-email"></span>
        </label>
        <span>
            <button class="student-edit-button">
                <icon-pen></icon-pen>
            </button>
            <button class="student-delete-button">
                <icon-trash></icon-trash>
            </button>
        </span>
    </li>
</template>
<dialog id="student-dialog">
    <h1>Add Student</h1>
    <form id="student-form">
        <label>
            <span>First Name:</span>
            <input type="text" name="firstName" required min="2">
        </label>
        <label>
            <span>Last Name:</span>
            <input type="text" name="lastName" required min="2">
        </label>
        <label>
            <span>Email:</span>
            <input type="email" name="email" required>
        </label>
        <div class="buttons">
            <button type="submit">Save</button>
            <button id="cancel-student-button" type="button">Cancel</button>
        </div>
    </form>
</dialog>
`;

class StudentList extends HTMLElement {
    editMode = false;
    studentBeingEdited = null;

    static get observedAttributes() {
        return ['teacher-id'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = view;
    }

    connectedCallback() {
        this.shadowRoot.getElementById('add-student').addEventListener('click', () => this.showAddStudentDialog());
        this.shadowRoot.getElementById('student-form').addEventListener('submit', event => {
            event.preventDefault();
            if (this.editMode) {
                this.updateStudent();
            } else {
                this.addStudent();
            }
        });
        this.shadowRoot.getElementById('cancel-student-button').addEventListener('click', () => this.shadowRoot.querySelector('#student-dialog').close());
        this.loadStudents();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'teacher-id' && oldValue !== newValue) {
            this.loadStudents();
        }
    }

    async loadStudents() {
        const teacherId = this.getAttribute('teacher-id');

        if (!teacherId) {
            this.shadowRoot.getRootNode().host.style.display = 'none';
            return;
        }
        const teacher = await session.getTeacher(teacherId);
        this.shadowRoot.getElementById('teacher-header').textContent = `${teacher.firstName} ${teacher.lastName}'s Students`;
        const students = await session.getStudents(teacherId);
        const studentList = this.shadowRoot.getElementById('teacher-students');
        studentList.innerHTML = '';
        students.forEach(student => {
            const studentElement = this.shadowRoot.getElementById('student-template').content.cloneNode(true);
            studentElement.querySelector('.student-name').textContent = `${student.firstName} ${student.lastName}`;
            studentElement.querySelector('.student-email').textContent = student.email;
            studentElement.querySelector('.student-edit-button').addEventListener('click', () => this.showEditStudentDialog(student));
            studentElement.querySelector('.student-delete-button').addEventListener('click', () => this.deleteStudent(student));
            studentList.appendChild(studentElement);
        });
        this.shadowRoot.getRootNode().host.style.display = 'block';
    }

    showAddStudentDialog() {
        const dialog = this.shadowRoot.getElementById('student-dialog');
        this.editMode = false;
        this.studentBeingEdited = null;

        const form = dialog.querySelector('form');
        form.reset();
        dialog.showModal();
    }

    showEditStudentDialog(student) {
        const dialog = this.shadowRoot.getElementById('student-dialog');
        this.editMode = true;
        this.studentBeingEdited = student;

        const form = dialog.querySelector('form');
        form.firstName.value = student.firstName;
        form.lastName.value = student.lastName;
        form.email.value = student.email;

        dialog.showModal();
    }

    async addStudent() {
        const teacherId = this.getAttribute('teacher-id');

        if (!teacherId) {
            return;
        }

        const form = this.shadowRoot.getElementById('student-form');
        const student = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            email: form.email.value,
            teacherId: teacherId
        };
        await session.createStudent(student);
        this.loadStudents();
        this.shadowRoot.querySelector('#student-dialog').close();
    }

    async updateStudent() {
        const form = this.shadowRoot.getElementById('student-form');
        const student = {
            id: this.studentBeingEdited.id,
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            email: form.email.value,
            teacherId: this.studentBeingEdited.teacherId
        };
        await session.updateStudent(this.studentBeingEdited.id, student);
        this.loadStudents();
        this.shadowRoot.querySelector('#student-dialog').close();
    }

    async deleteStudent(student) {
        if (confirm(`Are you sure you want to delete [${student.firstName} ${student.lastName}]?`)) {
            await session.deleteStudent(student.id);
            this.loadStudents();
        }
    }
}

customElements.define('student-list', StudentList);