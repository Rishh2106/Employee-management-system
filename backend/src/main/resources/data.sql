INSERT INTO users (id, username, password, role) VALUES
  (1, 'admin', '$2a$10$7Qw0Qw0Qw0Qw0Qw0Qw0QwOQw0Qw0Qw0Qw0Qw0Qw0Qw0Qw0Qw0Qw0', 'ADMIN'),
  (2, 'employee', '$2a$10$7Qw0Qw0Qw0Qw0Qw0Qw0QwOQw0Qw0Qw0Qw0Qw0Qw0Qw0Qw0Qw0Qw0', 'EMPLOYEE');

INSERT INTO tasks (id, title, description, status, user_id) VALUES
  (1, 'Sample Task 1', 'This is a sample task for admin', 'NEW', 1),
  (2, 'Sample Task 2', 'This is a sample task for employee', 'NEW', 2); 