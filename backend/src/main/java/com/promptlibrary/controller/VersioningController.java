package com.promptlibrary.controller;

import com.promptlibrary.api.VersioningApi;
import com.promptlibrary.dto.PromptVersionResponse;
import com.promptlibrary.service.VersioningService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class VersioningController implements VersioningApi {

    private final VersioningService versioningService;

    public VersioningController(VersioningService versioningService) {
        this.versioningService = versioningService;
    }

    @Override
    public ResponseEntity<List<PromptVersionResponse>> getVersionHistory(Long id) {
        List<PromptVersionResponse> versions = versioningService.getVersionHistory(id);
        return ResponseEntity.ok(versions);
    }
}
