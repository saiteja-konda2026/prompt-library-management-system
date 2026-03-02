# Prompt Library Management System

A Spring Boot application for managing AI prompts — create, organize, categorize, and search your prompt library.

## Tech Stack

- **Backend**: Spring Boot 3.4.3, Java 17+, Spring Data JPA
- **Database**: H2 in-memory
- **Build**: Maven

## Prerequisites

- Java 17+
- Maven 3.9+

## Running the Application

```bash
cd backend
mvn spring-boot:run
```

The application starts on `http://localhost:8080`.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/prompts` | List all prompts |
| GET | `/api/prompts/{id}` | Get prompt by ID |
| POST | `/api/prompts` | Create a new prompt |
| PUT | `/api/prompts/{id}` | Update an existing prompt |
| DELETE | `/api/prompts/{id}` | Delete a prompt |
| GET | `/api/prompts/search?q=` | Search prompts |
| GET | `/api/prompts/category/{category}` | Filter by category |

## H2 Console

Access the H2 database console at `http://localhost:8080/h2-console`:
- JDBC URL: `jdbc:h2:mem:promptdb`
- Username: `sa`
- Password: *(empty)*

## Running Tests

```bash
cd backend
mvn test
```
