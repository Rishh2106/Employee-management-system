package com.ewspurp.controller;

import com.ewspurp.model.Project;
import com.ewspurp.repository.ProjectRepository;
import com.ewspurp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectRepository.save(project);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project projectDetails) {
        return projectRepository.findById(id)
            .map(project -> {
                project.setName(projectDetails.getName());
                project.setDescription(projectDetails.getDescription());
                return ResponseEntity.ok(projectRepository.save(project));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        return projectRepository.findById(id)
            .map(project -> {
                project.setActive(false);
                projectRepository.save(project);
                return ResponseEntity.ok().build();
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{projectId}/employees")
    public ResponseEntity<?> addEmployeeToProject(@PathVariable Long projectId, @RequestBody Map<String, Long> payload) {
        Long userId = payload.get("userId");
        return projectRepository.findById(projectId).map(project ->
            userRepository.findById(userId).map(user -> {
                project.getEmployees().add(user);
                projectRepository.save(project);
                return ResponseEntity.ok(Map.of("message", "Employee added to project"));
            }).orElse(ResponseEntity.notFound().build())
        ).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{projectId}/employees/{userId}")
    public ResponseEntity<?> removeEmployeeFromProject(@PathVariable Long projectId, @PathVariable Long userId) {
        return projectRepository.findById(projectId).map(project ->
            userRepository.findById(userId).map(user -> {
                project.getEmployees().remove(user);
                projectRepository.save(project);
                return ResponseEntity.ok(Map.of("message", "Employee removed from project"));
            }).orElse(ResponseEntity.notFound().build())
        ).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/active")
    public List<Project> getActiveProjects() {
        return projectRepository.findAll().stream().filter(Project::isActive).toList();
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<?> activateProject(@PathVariable Long id) {
        return projectRepository.findById(id)
            .map(project -> {
                project.setActive(true);
                projectRepository.save(project);
                return ResponseEntity.ok().build();
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateProject(@PathVariable Long id) {
        return projectRepository.findById(id)
            .map(project -> {
                project.setActive(false);
                projectRepository.save(project);
                return ResponseEntity.ok().build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
} 