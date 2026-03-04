package com.promptlibrary.controller;

import com.promptlibrary.api.OperationsApi;
import com.promptlibrary.dto.RenderRequest;
import com.promptlibrary.dto.RenderResponse;
import com.promptlibrary.service.PromptTemplateRenderingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PromptTemplateRenderingController implements OperationsApi {

    private final PromptTemplateRenderingService renderingService;

    public PromptTemplateRenderingController(PromptTemplateRenderingService renderingService) {
        this.renderingService = renderingService;
    }

    @Override
    public ResponseEntity<RenderResponse> renderTemplate(RenderRequest renderRequest) {
        RenderResponse response = renderingService.render(
                renderRequest.getTemplate(),
                renderRequest.getValues()
        );
        return ResponseEntity.ok(response);
    }
}
