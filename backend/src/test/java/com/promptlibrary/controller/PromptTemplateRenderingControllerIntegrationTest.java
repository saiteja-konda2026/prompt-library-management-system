package com.promptlibrary.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class PromptTemplateRenderingControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void renderTemplate_basicVariables() throws Exception {
        String body = """
                {
                    "template": "Hello {{name}}, welcome to {{platform}}.",
                    "values": {
                        "name": "Alice",
                        "platform": "PromptLib"
                    }
                }
                """;
        mockMvc.perform(post("/api/prompts/render")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.renderedText").value("Hello Alice, welcome to PromptLib."));
    }

    @Test
    void renderTemplate_noVariables_passthrough() throws Exception {
        String body = """
                {
                    "template": "This is a plain template with no variables.",
                    "values": {}
                }
                """;
        mockMvc.perform(post("/api/prompts/render")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.renderedText").value("This is a plain template with no variables."));
    }

    @Test
    void renderTemplate_missingValues_leavesPlaceholders() throws Exception {
        String body = """
                {
                    "template": "Hello {{name}}, your role is {{role}}.",
                    "values": {
                        "name": "Bob"
                    }
                }
                """;
        mockMvc.perform(post("/api/prompts/render")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.renderedText").value("Hello Bob, your role is {{role}}."));
    }

    @Test
    void renderTemplate_emptyTemplate() throws Exception {
        String body = """
                {
                    "template": "",
                    "values": {}
                }
                """;
        mockMvc.perform(post("/api/prompts/render")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.renderedText").value(""));
    }

    @Test
    void renderTemplate_nullTemplate_returns400() throws Exception {
        String body = """
                {
                    "values": {}
                }
                """;
        mockMvc.perform(post("/api/prompts/render")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }
}
