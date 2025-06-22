package com.ewspurp.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // e.g., ADMIN, EMPLOYEE

    @ManyToMany(mappedBy = "assignedTo")
    private java.util.List<Task> tasks = new java.util.ArrayList<>();

    @ManyToMany(mappedBy = "employees")
    @JsonIgnore
    private List<Project> projects = new ArrayList<>();

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public java.util.List<Task> getTasks() { return tasks; }
    public void setTasks(java.util.List<Task> tasks) { this.tasks = tasks; }
    public List<Project> getProjects() { return projects; }
    public void setProjects(List<Project> projects) { this.projects = projects; }
} 