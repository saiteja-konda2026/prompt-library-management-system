package com.promptlibrary.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
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
}
