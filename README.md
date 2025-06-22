# Ewspurp

A modern Employee Management System (EMS) built with the latest tech stack:

- **Frontend:** Vite + React + Tailwind CSS
- **Backend:** Spring Boot 3.x (Java 17+), Maven, MySQL

## Project Structure

```
Ewspurp/
  frontend/   # Vite + React + Tailwind CSS
  backend/    # Spring Boot + Maven + MySQL
```

## Setup Instructions

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

### Backend
1. Import `backend` into your Java IDE (IntelliJ, Eclipse, VS Code, etc.)
2. Configure your MySQL database in `src/main/resources/application.properties`
3. Run the Spring Boot application (`./mvnw spring-boot:run` or via IDE)

---

## Features
- User authentication (login/register)
- Admin and Employee dashboards
- Task management (CRUD)

---

## Application Flow

### Roles & Permissions
- **Global Admin/Owner**: Can only be set up once (if not present). Has full access to create admin users, manage all projects and users.
- **Admin**: Created by the global admin. Can manage projects, assign employees to projects, and assign tasks to employees.
- **Employee**: Can register and sign up for active projects. Can view and mark only their own tasks as done.

### Global Admin Setup
- On first launch, if no global admin exists, a setup form is shown.
- The global admin can then create admin users from the dashboard.

### Project & User Management
- Projects are managed by admins/global admin.
- Employees can sign up for active projects during registration.
- Admins can assign employees to projects and manage project membership.

### Task Management
- Tasks can be assigned to multiple employees (many-to-many relationship).
- Only admins can set task deadlines and start dates.
- Employees can only mark their own assigned tasks as done.
- Admins can create, edit, and delete tasks for projects they manage.

### UI/UX
- Modern, responsive UI built with Tailwind CSS.
- Role-based dashboards:
  - **Global Admin/Owner**: User and admin management, project oversight.
  - **Admin**: Project and task management, employee assignment.
  - **Employee**: Project participation, task tracking, and completion.
- Multi-select dropdowns for assigning tasks to multiple employees.
- Clear navigation and visual cues for all roles.

---

For more details, see the `frontend/` and `backend/` READMEs. 