-- Clean up old data
DELETE FROM project_users;
DELETE FROM task_users;
DELETE FROM tasks;
DELETE FROM projects;
DELETE FROM users;

-- Users
INSERT INTO users (id, username, password, role) VALUES
  (1, 'globalAdmin', '$2a$10$7QwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQw', 'GLOBAL_ADMIN'),
  (2, 'admin', '$2a$10$7Qw0Qw0Qw0Qw0Qw0Qw0QwOQw0Qw0Qw0Qw0Qw0Qw0Qw0Qw0Qw0Qw0', 'ADMIN'),
  (3, 'employee', '$2a$10$7Qw0Qw0Qw0Qw0Qw0Qw0QwOQw0Qw0Qw0Qw0Qw0Qw0Qw0Qw0Qw0Qw0', 'EMPLOYEE');

-- Projects
INSERT INTO projects (id, name, description, active) VALUES
  (1, 'Project Alpha', 'A sample project', true);

-- Project-User assignments (employees to projects)
INSERT INTO project_users (project_id, user_id) VALUES
  (1, 2), -- admin is part of Project Alpha
  (1, 3); -- employee is part of Project Alpha

-- Tasks
INSERT INTO tasks (id, title, description, status, start_date, deadline, project_id) VALUES
  (1, 'Sample Task 1', 'This is a sample task for admin', 'NEW', '2024-06-20', '2024-06-30', 1),
  (2, 'Sample Task 2', 'This is a sample task for employee', 'NEW', '2024-06-20', '2024-06-30', 1);

-- Task-User assignments (tasks to users)
INSERT INTO task_users (task_id, user_id) VALUES
  (1, 2), -- admin assigned to Sample Task 1
  (2, 3); -- employee assigned to Sample Task 2

-- Encrypted password for 'test1234' is $2a$10$7QwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQw
DELETE FROM users WHERE username = 'globaladmin';
INSERT INTO users (username, password, role) VALUES ('globalAdmin', '$2a$10$7QwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQw', 'GLOBAL_ADMIN') ON CONFLICT (username) DO NOTHING; 