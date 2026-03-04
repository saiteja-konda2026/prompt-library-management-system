package com.promptlibrary.controller;

import com.promptlibrary.api.VersioningApi;
import com.promptlibrary.dto.PromptVersionResponse;
import com.promptlibrary.service.PromptTemplateVersioningService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PromptTemplateVersioningController implements VersioningApi {

    private final PromptTemplateVersioningService promptTemplateVersioningService;

    public PromptTemplateVersioningController(PromptTemplateVersioningService promptTemplateVersioningService) {
        this.promptTemplateVersioningService = promptTemplateVersioningService;
    }

    @Override
    public ResponseEntity<List<PromptVersionResponse>> getVersionHistory(Long id) {
        List<PromptVersionResponse> versions = promptTemplateVersioningService.getVersionHistory(id);
        return ResponseEntity.ok(versions);
    }

    @Override
    public ResponseEntity<Void> rollbackVersion(Long id, Long versionId) {
        promptTemplateVersioningService.rollbackToVersion(id, versionId);
        return ResponseEntity.ok().build();
    }
}
