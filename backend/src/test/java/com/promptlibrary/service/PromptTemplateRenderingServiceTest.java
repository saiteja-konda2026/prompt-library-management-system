package com.promptlibrary.service;

import com.promptlibrary.dto.RenderResponse;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class PromptTemplateRenderingServiceTest {

    private final PromptTemplateRenderingService service = new PromptTemplateRenderingService();

    @Test
    void render_replacesAllVariables() {
        RenderResponse response = service.render(
                "Hello {{name}}, welcome to {{platform}}.",
                Map.of("name", "Alice", "platform", "PromptLib")
        );
        assertEquals("Hello Alice, welcome to PromptLib.", response.getRenderedText());
    }

    @Test
    void render_noVariables_returnsTemplateAsIs() {
        RenderResponse response = service.render(
                "Plain text with no placeholders.",
                Map.of()
        );
        assertEquals("Plain text with no placeholders.", response.getRenderedText());
    }

    @Test
    void render_missingValues_leavesPlaceholders() {
        RenderResponse response = service.render(
                "Hello {{name}}, your role is {{role}}.",
                Map.of("name", "Bob")
        );
        assertEquals("Hello Bob, your role is {{role}}.", response.getRenderedText());
    }

    @Test
    void render_emptyTemplate_returnsEmpty() {
        RenderResponse response = service.render("", Map.of());
        assertEquals("", response.getRenderedText());
    }

    @Test
    void render_duplicateVariables_replacesAll() {
        RenderResponse response = service.render(
                "{{name}} said hello to {{name}}.",
                Map.of("name", "Alice")
        );
        assertEquals("Alice said hello to Alice.", response.getRenderedText());
    }

    @Test
    void render_valuesWithSpecialCharacters() {
        RenderResponse response = service.render(
                "Query: {{sql}}",
                Map.of("sql", "SELECT * FROM users WHERE id = $1")
        );
        assertEquals("Query: SELECT * FROM users WHERE id = $1", response.getRenderedText());
    }

    @Test
    void render_extraValuesIgnored() {
        RenderResponse response = service.render(
                "Hello {{name}}.",
                Map.of("name", "Alice", "unused", "value")
        );
        assertEquals("Hello Alice.", response.getRenderedText());
    }
}
