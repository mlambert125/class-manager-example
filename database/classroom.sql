begin transaction;
drop table if exists teachers, students, users, roles;

create table teachers(
    id serial primary key,
    first_name varchar(50) not null,
    last_name varchar(50) not null,
    email varchar(50) not null
);

create table students(
    id serial primary key,
    first_name varchar(50) not null,
    last_name varchar(50) not null,
    email varchar(50) not null,
    teacher_id int references teachers
);

create table users (
    username varchar(255) primary key,
    password varchar(255) not null,
    email varchar(255) not null
);

create table roles (
    username varchar(255) references users,
    role varchar(255) not null,
    primary key (username, role)
);

insert into users(username, password, email) values('admin', '$2a$10$n0cbkV4ZdJhTqVTcSdXjy./5yNk3aPR6Xf2eCK5BkHNEbIf5aw7wy', 'admin@test.com');
insert into users(username, password, email) values('test', '$2a$10$.AK9lTWvxxlIHhJaO6D4KuqH8ZC46500C6CcRfpId1YFYbYeMm8Ue', 'test@test.com');

insert into roles(username, role) values('admin', 'ADMIN');
insert into roles(username, role) values('test', 'STUDENT_CREATOR');
insert into roles(username, role) values('test', 'STUDENT_UPDATER');

insert into teachers(first_name, last_name, email) values('Mike', 'Lambert', 'mlambert@test.com');
insert into teachers(first_name, last_name, email) values('Daniel', 'Commins', 'dcommins@test.com');

insert into students (first_name, last_name, email, teacher_id) values ('Tyler', 'Mullin', 'tmullin@test.com', 2);
insert into students (first_name, last_name, email, teacher_id) values ('Regis', 'Knox', 'rknox@test.com', 2);
insert into students (first_name, last_name, email, teacher_id) values ('Guangyuan', 'Sun', 'gsun@test.scom', 2);
insert into students (first_name, last_name, email, teacher_id) values ('Annie', 'B.', 'annieb@test.com', 2);
insert into students (first_name, last_name, email, teacher_id) values ('Kyros', 'Dailey', 'kdailey@test.com', 2);
insert into students (first_name, last_name, email, teacher_id) values ('Lena', 'Johnson', 'ljohnson@test.com', 2);
insert into students (first_name, last_name, email, teacher_id) values ('Brandon', 'Cheuk', 'bcheuk@test.com', 2);
insert into students (first_name, last_name, email, teacher_id) values ('Justin', 'Wong', 'jwong@test.com', 2);
insert into students (first_name, last_name, email, teacher_id) values ('Maia', 'Sanders', 'msanders@test.com', 2);
insert into students (first_name, last_name, email, teacher_id) values ('Josh', 'Guo', 'jguo@test.com', 2);
insert into students (first_name, last_name, email, teacher_id) values ('Raina', 'Vincelli', 'rvincelli@test.com', 2);
insert into students (first_name, last_name, email, teacher_id) values ('Rose', 'O''Malley', 'romalley@test.com', 2);
insert into students (first_name, last_name, email, teacher_id) values ('Cailee', 'Abney', 'cabney@test.com', 2);
insert into students (first_name, last_name, email, teacher_id) values ('Finnian', 'Simmons', 'fsimmons@test.com', 2);
insert into students (first_name, last_name, email, teacher_id) values ('Elijah', 'Germins', 'egermins@test.com', 2);
insert into students (first_name, last_name, email, teacher_id) values ('Megan', 'Schrock', 'mshrock@test.com', 2);
insert into students (first_name, last_name, email, teacher_id) values ('Abdullah', 'Almanasseer', 'aalmanaseer@test.com', 2);
insert into students (first_name, last_name, email, teacher_id) values ('Robert', 'Hintz', 'rhintz@test.com', 2);
insert into students (first_name, last_name, email, teacher_id) values ('Elizabeth', 'Anderson', 'eanderson@test.com', 2);
insert into students (first_name, last_name, email, teacher_id) values ('Roberto', 'Barone', 'rbarone@test.com', 1);
insert into students (first_name, last_name, email, teacher_id) values ('Robert', 'Cryder', 'rcryder@test.com', 1);
insert into students (first_name, last_name, email, teacher_id) values ('James', 'Allen', 'jallen@test.com', 1);
insert into students (first_name, last_name, email, teacher_id) values ('Jason', 'Kernan', 'jkernan@test.com', 1);
insert into students (first_name, last_name, email, teacher_id) values ('Beau', 'Blevins', 'bblevins@test.com', 1);
insert into students (first_name, last_name, email, teacher_id) values ('Jesaca', 'Lin', 'jlin@test.com', 1);
insert into students (first_name, last_name, email, teacher_id) values ('Ami', 'Udvari', 'audvari@test.com', 1);
insert into students (first_name, last_name, email, teacher_id) values ('Nicholas', 'Burns', 'nburns@test.com', 1);
insert into students (first_name, last_name, email, teacher_id) values ('Geremu', 'McKinney', 'gmckinney@test.com', 1);
insert into students (first_name, last_name, email, teacher_id) values ('Marlene', 'Feliz-Nina', 'mars@test.com', 1);
insert into students (first_name, last_name, email, teacher_id) values ('Emilio', 'Alverson', 'ealverson@test.com', 1);
insert into students (first_name, last_name, email, teacher_id) values ('Zawadi', 'Kirksey-Lamb', 'zkirkseylamb@test.com', 1);
insert into students (first_name, last_name, email, teacher_id) values ('Emily', 'Gawronski', 'egawronski@test.com', 1);
insert into students (first_name, last_name, email, teacher_id) values ('Jeffrey', 'Conti', 'jconti@test.com', 1);
insert into students (first_name, last_name, email, teacher_id) values ('Cina', 'Noel', 'cnoel@test.com', 1);
insert into students (first_name, last_name, email, teacher_id) values ('Stephen', 'Buhrts', 'sbuhrts@test.com', 1);
insert into students (first_name, last_name, email, teacher_id) values ('Eddy', 'Guo', 'eguo@test.com', 1);
insert into students (first_name, last_name, email, teacher_id) values ('Anthony', 'Steele', 'asteele@test.com', 1);
insert into students (first_name, last_name, email, teacher_id) values ('Klaudiusz', 'Lech', 'klech@test.com', 1);
insert into students (first_name, last_name, email, teacher_id) values ('Hannah', 'Parks', 'hparks@test.com', 1);
insert into students (first_name, last_name, email, teacher_id) values ('Matthew', 'Morace', 'mmorace@test.com', 1);
insert into students (first_name, last_name, email, teacher_id) values ('Charles', 'McNeece', 'cmcneece@test.com', 2);

commit;
