package com.ewspurp.controller;

import com.ewspurp.model.Task;
import com.ewspurp.model.User;
import com.ewspurp.repository.TaskRepository;
import com.ewspurp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Task> getTasksByUser(@PathVariable Long userId) {
        return taskRepository.findByAssignedTo_Id(userId);
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Map<String, Object> body) {
        Task task = new Task();
        task.setTitle((String) body.get("title"));
        task.setDescription((String) body.get("description"));
        task.setStatus("NEW");
        if (body.get("startDate") != null) task.setStartDate(java.time.LocalDate.parse((String) body.get("startDate")));
        if (body.get("deadline") != null) task.setDeadline(java.time.LocalDate.parse((String) body.get("deadline")));
        if (body.get("assignedTo") instanceof List<?> assignedToList) {
            List<User> users = new java.util.ArrayList<>();
            for (Object userObj : assignedToList) {
                if (userObj instanceof Map<?,?> userMap && userMap.get("id") != null) {
                    Long userId = Long.valueOf(userMap.get("id").toString());
                    userRepository.findById(userId).ifPresent(users::add);
                }
            }
            task.setAssignedTo(users);
        }
        return ResponseEntity.ok(taskRepository.save(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Optional<Task> taskOpt = taskRepository.findById(id);
        if (taskOpt.isEmpty()) return ResponseEntity.notFound().build();
        Task task = taskOpt.get();

        // Extract userId and role from request body
        Long userId = updates.get("userId") != null ? Long.valueOf(updates.get("userId").toString()) : null;
        String role = updates.get("role") != null ? updates.get("role").toString() : null;

        // Only assigned employee can update status
        if (updates.containsKey("status")) {
            boolean isAssigned = task.getAssignedTo().stream().anyMatch(u -> u.getId().equals(userId));
            if (isAssigned) {
                task.setStatus(updates.get("status").toString());
            } else {
                return ResponseEntity.status(403).body("Only assigned employees can update the status.");
            }
        }

        // Only admin can update startDate and deadline
        if ("ADMIN".equals(role)) {
            if (updates.containsKey("startDate")) {
                task.setStartDate(java.time.LocalDate.parse(updates.get("startDate").toString()));
            }
            if (updates.containsKey("deadline")) {
                task.setDeadline(java.time.LocalDate.parse(updates.get("deadline").toString()));
            }
            if (updates.containsKey("title")) {
                task.setTitle(updates.get("title").toString());
            }
            if (updates.containsKey("description")) {
                task.setDescription(updates.get("description").toString());
            }
            if (updates.containsKey("assignedTo") && updates.get("assignedTo") instanceof List<?> assignedToList) {
                List<User> users = new java.util.ArrayList<>();
                for (Object userObj : assignedToList) {
                    if (userObj instanceof Map<?,?> userMap && userMap.get("id") != null) {
                        Long uid = Long.valueOf(userMap.get("id").toString());
                        userRepository.findById(uid).ifPresent(users::add);
                    }
                }
                task.setAssignedTo(users);
            }
        }

        return ResponseEntity.ok(taskRepository.save(task));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) return ResponseEntity.notFound().build();
        taskRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        return taskRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
} 