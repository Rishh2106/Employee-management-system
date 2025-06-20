# Ewspurp Backend

This is the backend for Ewspurp, built with Spring Boot 3.x, Java 17+, Maven, and MySQL.

## Stack
- Spring Boot 3.x (latest)
- Java 17+ (LTS)
- Maven
- MySQL 8.x

## Setup

1. Configure your MySQL database in `src/main/resources/application.properties`.
2. Build and run:
   ```sh
   ./mvnw spring-boot:run
   ```
   Or use your IDE to run the application.

## Project Structure
- `src/main/java/com/ewspurp/` — Java source code
- `src/main/resources/` — Configuration files

## API
- Exposes REST endpoints for authentication and task management.
- Consumed by the Ewspurp frontend. 