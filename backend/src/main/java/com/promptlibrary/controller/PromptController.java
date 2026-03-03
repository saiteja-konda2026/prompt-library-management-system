package com.promptlibrary.controller;

import com.promptlibrary.api.PromptsApi;
import com.promptlibrary.dto.PromptCreateRequest;
import com.promptlibrary.dto.PromptPageResponse;
import com.promptlibrary.dto.PromptResponse;
import com.promptlibrary.dto.PromptStatus;
import com.promptlibrary.dto.PromptType;
import com.promptlibrary.service.PromptService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PromptController implements PromptsApi {

    private final PromptService promptService;

    public PromptController(PromptService promptService) {
        this.promptService = promptService;
    }

    @Override
    public ResponseEntity<PromptResponse> createPrompt(PromptCreateRequest promptCreateRequest) {
        PromptResponse response = promptService.createPrompt(promptCreateRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Override
    public ResponseEntity<PromptResponse> getPromptById(Long id) {
        PromptResponse response = promptService.getPromptById(id);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<PromptPageResponse> listPrompts(PromptType type, PromptStatus status,
                                                           List<String> tags, String search,
                                                           Integer page, Integer size) {
        PromptPageResponse response = promptService.listPrompts(type, status, tags, search, page, size);
        return ResponseEntity.ok(response);
    }
}
