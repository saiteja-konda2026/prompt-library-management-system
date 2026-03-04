package com.promptlibrary.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class PromptTemplateVersioningControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getVersionHistory_returnsVersions() throws Exception {
        // First update prompt id=1 to create a version snapshot
        String updateBody = """
                {
                    "name": "SQL Query Assistant v2",
                    "type": "SYSTEM",
                    "templateBody": "Updated template body"
                }
                """;
        mockMvc.perform(put("/api/prompts/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateBody))
                .andExpect(status().isOk());

        // Now get version history
        mockMvc.perform(get("/api/prompts/1/versions").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].version").value(1))
                .andExpect(jsonPath("$[0].name").value("SQL Query Assistant"))
                .andExpect(jsonPath("$[0].type").value("SYSTEM"))
                .andExpect(jsonPath("$[0].status").value("ACTIVE"))
                .andExpect(jsonPath("$[0].templateBody").isNotEmpty())
                .andExpect(jsonPath("$[0].tags", hasSize(3)))
                .andExpect(jsonPath("$[0].tags", containsInAnyOrder("sql", "database", "query-optimization")))
                .andExpect(jsonPath("$[0].variables", hasSize(4)))
                .andExpect(jsonPath("$[0].variables[*].name",
                        containsInAnyOrder("agent_name", "database_type", "context", "sql_style")))
                .andExpect(jsonPath("$[0].createdAt").isNotEmpty());
    }

    @Test
    void getVersionHistory_noVersions_returnsEmptyList() throws Exception {
        // Seed prompt id=2 has never been updated, so no versions
        mockMvc.perform(get("/api/prompts/2/versions").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void getVersionHistory_notFound_returns404() throws Exception {
        mockMvc.perform(get("/api/prompts/999/versions").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("NOT_FOUND"));
    }

    // --- Rollback Tests ---

    @Test
    void rollbackVersion_success() throws Exception {
        // Update prompt id=1 to create version 1 snapshot
        String updateBody = """
                {
                    "name": "SQL Query Assistant v2",
                    "type": "SYSTEM",
                    "templateBody": "Updated template body"
                }
                """;
        mockMvc.perform(put("/api/prompts/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.version").value(2));

        // Rollback to version 1
        mockMvc.perform(post("/api/prompts/1/rollback/1"))
                .andExpect(status().isOk());

        // Verify the prompt was restored with version incremented to 3
        mockMvc.perform(get("/api/prompts/1").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.version").value(3))
                .andExpect(jsonPath("$.name").value("SQL Query Assistant"))
                .andExpect(jsonPath("$.type").value("SYSTEM"))
                .andExpect(jsonPath("$.status").value("ACTIVE"))
                .andExpect(jsonPath("$.tags", hasSize(3)))
                .andExpect(jsonPath("$.tags", containsInAnyOrder("sql", "database", "query-optimization")))
                .andExpect(jsonPath("$.variables", hasSize(4)))
                .andExpect(jsonPath("$.variables[*].name",
                        containsInAnyOrder("agent_name", "database_type", "context", "sql_style")));

        // Verify version history now has 2 entries (v1 and v2 snapshots)
        mockMvc.perform(get("/api/prompts/1/versions").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void rollbackVersion_promptNotFound_returns404() throws Exception {
        mockMvc.perform(post("/api/prompts/999/rollback/1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("NOT_FOUND"));
    }

    @Test
    void rollbackVersion_versionNotFound_returns404() throws Exception {
        mockMvc.perform(post("/api/prompts/1/rollback/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("NOT_FOUND"));
    }
}
