import { session } from '../classroom-api-session.js';
import './icon-pen.js';
import './icon-trash.js';

const view = /*html*/`
<style>
    :host {
        #header {
            button {
                cursor: pointer;
                width: 150px;
            }
        }
        #teacher-list {
            padding: 0;
            li {
                display: flex;
                justify-content: space-between;
                align-items: center;

                label {
                    display: flex;
                    gap: 0.5rem;

                    .teacher-email {
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
<div id="header">
    <h2>Teachers</h2>    
    <button id="add-teacher">Add Teacher</button>    
</div>
<ul id="teacher-list"></ul>
<template id="teacher-template">
    <li>
        <label>
            <a href="javascript:void(0)" class="teacher-name"></a>
            <span class="teacher-email"></span>
        </label>
        <span>
            <button class="teacher-edit-button">
                <icon-pen></icon-pen>
            </button>
            <button class="teacher-delete-button">
                <icon-trash></icon-trash>
            </button>
        </span>
    </li>
</template>
<dialog id="teacher-dialog">
    <h1>Add Teacher</h1>
    <form id="teacher-form">
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
            <button id="cancel-teacher-button" type="button">Cancel</button>
        </div>
    </form>
</dialog>
`;

class TeacherList extends HTMLElement {
    editMode = false;
    teacherBeingEdited = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = view;
    }

    connectedCallback() {
        this.shadowRoot.getElementById('add-teacher').addEventListener('click', () => this.showAddTeacherDialog());
        this.shadowRoot.getElementById('teacher-form').addEventListener('submit', event => {
            event.preventDefault();
            if (this.editMode) {
                this.updateTeacher();
            } else {
                this.addTeacher();
            }
        });
        this.shadowRoot.getElementById('cancel-teacher-button').addEventListener('click', () => this.shadowRoot.querySelector('#teacher-dialog').close());
        this.loadTeachers();
    }

    async loadTeachers() {
        const teachers = await session.getTeachers();
        if (teachers) {
            const teacherList = this.shadowRoot.getElementById('teacher-list');
            teacherList.innerHTML = '';
            teachers.forEach(teacher => {
                const template = this.shadowRoot.getElementById('teacher-template');
                const clone = template.content.cloneNode(true);
                clone.querySelector('.teacher-name').textContent = `${teacher.firstName} ${teacher.lastName}`;
                clone.querySelector('.teacher-email').textContent = teacher.email;
                clone.querySelector('.teacher-edit-button').addEventListener('click', () => this.showEditTeacherDialog(teacher));
                clone.querySelector('.teacher-delete-button').addEventListener('click', () => this.deleteTeacher(teacher));
                clone.querySelector('.teacher-name').addEventListener('click', () => {
                    this.dispatchEvent(new CustomEvent('teacher-selected', { detail: teacher }));
                });
                
                teacherList.appendChild(clone);
            });
        }
    }

    showAddTeacherDialog() {
        const dialog = this.shadowRoot.getElementById('teacher-dialog');
        this.editMode = false;
        this.teacherBeingEdited = null;
        dialog.querySelector('h1').textContent = 'Add Teacher';

        const form = dialog.querySelector('form');
        form.reset();

        dialog.showModal();
    }

    showEditTeacherDialog(teacher) {
        const dialog = this.shadowRoot.getElementById('teacher-dialog');
        this.editMode = true;
        this.teacherBeingEdited = teacher;
        dialog.querySelector('h1').textContent = 'Edit Teacher';

        const form = dialog.querySelector('form');
        form.reset();
        form.firstName.value = teacher.firstName;
        form.lastName.value = teacher.lastName;
        form.email.value = teacher.email;

        dialog.showModal();
    }

    async addTeacher() {
        const form = this.shadowRoot.getElementById('teacher-form');
        const teacher = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            email: form.email.value
        };
        const newTeacher = await session.createTeacher(teacher);
        this.loadTeachers();
        this.shadowRoot.querySelector('#teacher-dialog').close();
    }

    async updateTeacher() {
        const form = this.shadowRoot.getElementById('teacher-form');
        const teacher = {
            id: this.teacherBeingEdited.id,
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            email: form.email.value
        };
        await session.updateTeacher(this.teacherBeingEdited.id, teacher);
        this.loadTeachers();
        this.shadowRoot.querySelector('#teacher-dialog').close();
    }

    async deleteTeacher(teacher) {
        if (confirm(`Are you sure you want to delete [${teacher.firstName} ${teacher.lastName}]?`)) {
            await session.deleteTeacher(teacher.id);
            this.loadTeachers();
        }
    }
}

customElements.define('teacher-list', TeacherList);