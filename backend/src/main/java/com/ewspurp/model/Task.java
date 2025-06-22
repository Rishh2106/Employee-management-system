package com.ewspurp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String status; // e.g., NEW, ACCEPTED, COMPLETED, FAILED

    @ManyToMany
    @JoinTable(
        name = "task_users",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private java.util.List<User> assignedTo = new java.util.ArrayList<>();

    @ManyToOne
    @JoinColumn(name="project_id")
    private Project project;

    @Column
    private java.time.LocalDate startDate;

    @Column
    private java.time.LocalDate deadline;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public java.util.List<User> getAssignedTo() { return assignedTo; }
    public void setAssignedTo(java.util.List<User> assignedTo) { this.assignedTo = assignedTo; }
    public java.time.LocalDate getStartDate() { return startDate; }
    public void setStartDate(java.time.LocalDate startDate) { this.startDate = startDate; }
    public java.time.LocalDate getDeadline() { return deadline; }
    public void setDeadline(java.time.LocalDate deadline) { this.deadline = deadline; }
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
} 