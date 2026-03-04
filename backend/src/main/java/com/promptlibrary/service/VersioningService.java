package com.promptlibrary.service;

import com.promptlibrary.dto.PromptVersionResponse;
import com.promptlibrary.exception.ResourceNotFoundException;
import com.promptlibrary.mapper.PromptMapper;
import com.promptlibrary.model.Prompt;
import com.promptlibrary.repository.PromptRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VersioningService {

    private final PromptRepository promptRepository;
    private final PromptMapper promptMapper;

    public VersioningService(PromptRepository promptRepository, PromptMapper promptMapper) {
        this.promptRepository = promptRepository;
        this.promptMapper = promptMapper;
    }

    @Transactional(readOnly = true)
    public List<PromptVersionResponse> getVersionHistory(Long promptId) {
        Prompt prompt = promptRepository.findById(promptId)
                .orElseThrow(() -> new ResourceNotFoundException("Prompt not found with id: " + promptId));

        return prompt.getVersions().stream()
                .map(promptMapper::toPromptVersionResponse)
                .toList();
    }
}
