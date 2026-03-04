package com.promptlibrary.controller;

import com.promptlibrary.api.PromptsApi;
import com.promptlibrary.dto.PromptUpsertRequest;
import com.promptlibrary.dto.PromptPageResponse;
import com.promptlibrary.dto.PromptResponse;
import com.promptlibrary.dto.PromptStatus;
import com.promptlibrary.dto.PromptType;
import com.promptlibrary.dto.VariableDefinition;
import com.promptlibrary.service.PromptTemplateService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PromptTemplateController implements PromptsApi {

    private final PromptTemplateService promptTemplateService;

    public PromptTemplateController(PromptTemplateService promptTemplateService) {
        this.promptTemplateService = promptTemplateService;
    }

    @Override
    public ResponseEntity<PromptResponse> createPrompt(PromptUpsertRequest promptCreateRequest) {
        PromptResponse response = promptTemplateService.createPrompt(promptCreateRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Override
    public ResponseEntity<PromptResponse> updatePrompt(Long id, PromptUpsertRequest body) {
        PromptResponse response = promptTemplateService.updatePrompt(id, body);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<Void> deletePrompt(Long id) {
        promptTemplateService.deletePrompt(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<PromptResponse> getPromptById(Long id) {
        PromptResponse response = promptTemplateService.getPromptById(id);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<List<VariableDefinition>> getPromptVariables(Long id) {
        List<VariableDefinition> variables = promptTemplateService.getVariablesByPromptId(id);
        return ResponseEntity.ok(variables);
    }

    @Override
    public ResponseEntity<PromptPageResponse> listPrompts(PromptType type, PromptStatus status,
                                                           List<String> tags, String search,
                                                           Integer page, Integer size) {
        PromptPageResponse response = promptTemplateService.listPrompts(type, status, tags, search, page, size);
        return ResponseEntity.ok(response);
    }
}
