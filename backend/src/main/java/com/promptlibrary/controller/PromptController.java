package com.promptlibrary.controller;

import com.promptlibrary.api.PromptsApi;
import com.promptlibrary.dto.PromptResponse;
import com.promptlibrary.service.PromptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PromptController implements PromptsApi {

    private final PromptService promptService;

    public PromptController(PromptService promptService) {
        this.promptService = promptService;
    }

    @Override
    public ResponseEntity<PromptResponse> getPromptById(Long id) {
        PromptResponse response = promptService.getPromptById(id);
        return ResponseEntity.ok(response);
    }
}
