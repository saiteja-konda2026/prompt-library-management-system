package com.promptlibrary.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class PromptControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getPromptById_returnsPromptWithTagsAndVariables() throws Exception {
        mockMvc.perform(get("/api/prompts/1").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("SQL Query Assistant"))
                .andExpect(jsonPath("$.type").value("SYSTEM"))
                .andExpect(jsonPath("$.status").value("ACTIVE"))
                .andExpect(jsonPath("$.version").value(1))
                .andExpect(jsonPath("$.templateBody").isNotEmpty())
                .andExpect(jsonPath("$.author").value("admin"))
                .andExpect(jsonPath("$.createdAt").isNotEmpty())
                .andExpect(jsonPath("$.updatedAt").isNotEmpty())
                .andExpect(jsonPath("$.tags", hasSize(3)))
                .andExpect(jsonPath("$.tags", containsInAnyOrder("sql", "database", "query-optimization")))
                .andExpect(jsonPath("$.variables", hasSize(4)))
                .andExpect(jsonPath("$.variables[*].name",
                        containsInAnyOrder("agent_name", "database_type", "context", "sql_style")));
    }

    @Test
    void getPromptById_notFound_returns404() throws Exception {
        mockMvc.perform(get("/api/prompts/999").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("not found")))
                .andExpect(jsonPath("$.code").value("NOT_FOUND"));
    }

    @Test
    void getPromptById_negativeId_returns400() throws Exception {
        mockMvc.perform(get("/api/prompts/-1").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("BAD_REQUEST"));
    }

    @Test
    void getPromptById_starterPrompt_returnsCorrectType() throws Exception {
        mockMvc.perform(get("/api/prompts/2").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.name").value("Data Analysis Starter"))
                .andExpect(jsonPath("$.type").value("STARTER"))
                .andExpect(jsonPath("$.status").value("ACTIVE"))
                .andExpect(jsonPath("$.tags", hasSize(3)))
                .andExpect(jsonPath("$.variables", hasSize(3)));
    }

    // --- List Prompts Tests ---

    @Test
    void listPrompts_returnsAllPrompts() throws Exception {
        mockMvc.perform(get("/api/prompts").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(7))
                .andExpect(jsonPath("$.content", hasSize(7)));
    }

    @Test
    void listPrompts_filterByType() throws Exception {
        mockMvc.perform(get("/api/prompts")
                        .param("type", "SYSTEM")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(2))
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.content[*].type", everyItem(is("SYSTEM"))));
    }

    @Test
    void listPrompts_filterByStatus() throws Exception {
        mockMvc.perform(get("/api/prompts")
                        .param("status", "ACTIVE")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(4))
                .andExpect(jsonPath("$.content", hasSize(4)))
                .andExpect(jsonPath("$.content[*].status", everyItem(is("ACTIVE"))));
    }

    @Test
    void listPrompts_filterByTags() throws Exception {
        mockMvc.perform(get("/api/prompts")
                        .param("tags", "sql")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.content[0].name").value("SQL Query Assistant"));
    }

    @Test
    void listPrompts_searchByName() throws Exception {
        mockMvc.perform(get("/api/prompts")
                        .param("search", "SQL")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.content[0].name").value("SQL Query Assistant"));
    }

    @Test
    void listPrompts_pagination() throws Exception {
        mockMvc.perform(get("/api/prompts")
                        .param("page", "0")
                        .param("size", "2")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(7))
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.totalPages").value(4))
                .andExpect(jsonPath("$.number").value(0));
    }

    @Test
    void listPrompts_combinedFilters() throws Exception {
        mockMvc.perform(get("/api/prompts")
                        .param("type", "SYSTEM")
                        .param("status", "ACTIVE")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.content[0].name").value("SQL Query Assistant"));
    }

    @Test
    void listPrompts_allFilters() throws Exception {
        mockMvc.perform(get("/api/prompts")
                        .param("type", "SYSTEM")
                        .param("status", "ACTIVE")
                        .param("tags", "sql,database")
                        .param("search", "SQL")
                        .param("page", "0")
                        .param("size", "20")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].name").value("SQL Query Assistant"))
                .andExpect(jsonPath("$.content[0].type").value("SYSTEM"))
                .andExpect(jsonPath("$.content[0].status").value("ACTIVE"))
                .andExpect(jsonPath("$.number").value(0));
    }

    // --- Create Prompt Tests ---

    @Test
    void createPrompt_success() throws Exception {
        String requestBody = """
                {
                    "name": "Test Prompt",
                    "type": "USER",
                    "templateBody": "Hello {{name}}, welcome to {{platform}}.",
                    "description": "A test prompt",
                    "tags": ["test", "greeting"],
                    "variables": [
                        {"name": "name", "description": "User name", "required": true},
                        {"name": "platform", "description": "Platform name", "defaultValue": "AI Hub", "required": false}
                    ]
                }
                """;

        mockMvc.perform(post("/api/prompts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name").value("Test Prompt"))
                .andExpect(jsonPath("$.type").value("USER"))
                .andExpect(jsonPath("$.status").value("DRAFT"))
                .andExpect(jsonPath("$.version").value(1))
                .andExpect(jsonPath("$.description").value("A test prompt"))
                .andExpect(jsonPath("$.templateBody").value("Hello {{name}}, welcome to {{platform}}."))
                .andExpect(jsonPath("$.tags", hasSize(2)))
                .andExpect(jsonPath("$.tags", containsInAnyOrder("test", "greeting")))
                .andExpect(jsonPath("$.variables", hasSize(2)))
                .andExpect(jsonPath("$.variables[*].name", containsInAnyOrder("name", "platform")))
                .andExpect(jsonPath("$.createdAt").isNotEmpty())
                .andExpect(jsonPath("$.updatedAt").isNotEmpty());
    }

    @Test
    void createPrompt_duplicateName_returns409() throws Exception {
        String requestBody = """
                {
                    "name": "SQL Query Assistant",
                    "type": "SYSTEM",
                    "templateBody": "Duplicate prompt body"
                }
                """;

        mockMvc.perform(post("/api/prompts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message", containsString("already exists")))
                .andExpect(jsonPath("$.code").value("CONFLICT"));
    }

    @Test
    void createPrompt_missingRequiredFields_returns400() throws Exception {
        mockMvc.perform(post("/api/prompts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("BAD_REQUEST"))
                .andExpect(jsonPath("$.details").isArray())
                .andExpect(jsonPath("$.details", hasSize(greaterThanOrEqualTo(3))));
    }

    // --- Update Prompt Tests ---

    @Test
    void updatePrompt_success() throws Exception {
        String requestBody = """
                {
                    "name": "SQL Query Assistant Updated",
                    "type": "SYSTEM",
                    "templateBody": "You are {{agent_name}}, an updated SQL assistant.",
                    "description": "Updated description",
                    "tags": ["sql", "updated"],
                    "variables": [
                        {"name": "agent_name", "description": "Name of the agent", "required": true}
                    ]
                }
                """;

        mockMvc.perform(put("/api/prompts/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("SQL Query Assistant Updated"))
                .andExpect(jsonPath("$.type").value("SYSTEM"))
                .andExpect(jsonPath("$.version").value(2))
                .andExpect(jsonPath("$.description").value("Updated description"))
                .andExpect(jsonPath("$.templateBody").value("You are {{agent_name}}, an updated SQL assistant."))
                .andExpect(jsonPath("$.tags", hasSize(2)))
                .andExpect(jsonPath("$.tags", containsInAnyOrder("sql", "updated")))
                .andExpect(jsonPath("$.variables", hasSize(1)))
                .andExpect(jsonPath("$.variables[0].name").value("agent_name"));
    }

    @Test
    void updatePrompt_notFound_returns404() throws Exception {
        String requestBody = """
                {
                    "name": "Non-existent",
                    "type": "USER",
                    "templateBody": "Some body"
                }
                """;

        mockMvc.perform(put("/api/prompts/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("not found")))
                .andExpect(jsonPath("$.code").value("NOT_FOUND"));
    }

    @Test
    void updatePrompt_duplicateName_returns409() throws Exception {
        String requestBody = """
                {
                    "name": "Data Analysis Starter",
                    "type": "SYSTEM",
                    "templateBody": "Trying to steal another prompt's name"
                }
                """;

        mockMvc.perform(put("/api/prompts/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message", containsString("already exists")))
                .andExpect(jsonPath("$.code").value("CONFLICT"));
    }

    @Test
    void updatePrompt_missingRequiredFields_returns400() throws Exception {
        mockMvc.perform(put("/api/prompts/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("BAD_REQUEST"));
    }

    // --- Delete Prompt Tests ---

    @Test
    void deletePrompt_success() throws Exception {
        // Prompt id=1 is ACTIVE, so it can be archived
        mockMvc.perform(delete("/api/prompts/1"))
                .andExpect(status().isNoContent());

        // Verify it was archived
        mockMvc.perform(get("/api/prompts/1").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ARCHIVED"));
    }

    @Test
    void deletePrompt_draftStatus_returns400() throws Exception {
        // Prompt id=4 (Email Draft Helper) is DRAFT
        mockMvc.perform(delete("/api/prompts/4"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("DRAFT")))
                .andExpect(jsonPath("$.code").value("BAD_REQUEST"));
    }

    @Test
    void deletePrompt_notFound_returns404() throws Exception {
        mockMvc.perform(delete("/api/prompts/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("NOT_FOUND"));
    }

    // --- Status Transition Tests ---

    @Test
    void updateDraftPrompt_saveDraft_noVersionIncrement() throws Exception {
        // Prompt id=4 (Email Draft Helper) is DRAFT — update without status field stays DRAFT, no version bump
        String requestBody = """
                {
                    "name": "Email Draft Helper Updated",
                    "type": "USER",
                    "templateBody": "Updated draft body"
                }
                """;

        mockMvc.perform(put("/api/prompts/4")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(4))
                .andExpect(jsonPath("$.name").value("Email Draft Helper Updated"))
                .andExpect(jsonPath("$.status").value("DRAFT"))
                .andExpect(jsonPath("$.version").value(1));
    }

    @Test
    void updateDraftPrompt_activate_setsActive() throws Exception {
        // Prompt id=4 (Email Draft Helper) is DRAFT — setting status to ACTIVE should work
        String requestBody = """
                {
                    "name": "Email Draft Helper",
                    "type": "USER",
                    "templateBody": "Activated draft body",
                    "status": "ACTIVE"
                }
                """;

        mockMvc.perform(put("/api/prompts/4")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(4))
                .andExpect(jsonPath("$.status").value("ACTIVE"))
                .andExpect(jsonPath("$.version").value(1));
    }

    @Test
    void updateActivePrompt_toDraft_returns400() throws Exception {
        // Prompt id=1 (SQL Query Assistant) is ACTIVE — setting status to DRAFT is illegal
        String requestBody = """
                {
                    "name": "SQL Query Assistant",
                    "type": "SYSTEM",
                    "templateBody": "Some body",
                    "status": "DRAFT"
                }
                """;

        mockMvc.perform(put("/api/prompts/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Invalid status transition")))
                .andExpect(jsonPath("$.code").value("BAD_REQUEST"));
    }

    @Test
    void updateArchivedPrompt_toActive_returns400() throws Exception {
        // Prompt id=6 is ARCHIVED — setting status to ACTIVE is illegal
        String requestBody = """
                {
                    "name": "Legacy Chat Opener",
                    "type": "STARTER",
                    "templateBody": "Some body",
                    "status": "ACTIVE"
                }
                """;

        mockMvc.perform(put("/api/prompts/6")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Invalid status transition")))
                .andExpect(jsonPath("$.code").value("BAD_REQUEST"));
    }

    // --- Get Prompt Variables Tests ---

    @Test
    void getPromptVariables_returnsVariables() throws Exception {
        // Prompt id=1 (SQL Query Assistant) has 4 variables
        mockMvc.perform(get("/api/prompts/1/variables").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(4)))
                .andExpect(jsonPath("$[*].name",
                        containsInAnyOrder("agent_name", "database_type", "context", "sql_style")))
                .andExpect(jsonPath("$[0].name").isNotEmpty())
                .andExpect(jsonPath("$[0].required").isNotEmpty());
    }

    @Test
    void getPromptVariables_noVariables_returnsEmptyList() throws Exception {
        // Create a prompt with no variables
        String body = """
                {
                    "name": "No Variables Prompt",
                    "type": "USER",
                    "templateBody": "Just plain text"
                }
                """;
        String response = mockMvc.perform(post("/api/prompts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        // Extract id from response
        int id = com.jayway.jsonpath.JsonPath.read(response, "$.id");

        mockMvc.perform(get("/api/prompts/" + id + "/variables").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void getPromptVariables_notFound_returns404() throws Exception {
        mockMvc.perform(get("/api/prompts/999/variables").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("NOT_FOUND"));
    }
}
