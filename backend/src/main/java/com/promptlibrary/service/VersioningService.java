package com.promptlibrary.service;

import com.promptlibrary.dto.PromptVersionResponse;
import com.promptlibrary.exception.ResourceNotFoundException;
import com.promptlibrary.mapper.PromptMapper;
import com.promptlibrary.model.Prompt;
import com.promptlibrary.model.PromptVersion;
import com.promptlibrary.repository.PromptRepository;
import com.promptlibrary.repository.PromptVersionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VersioningService {

    private final PromptRepository promptRepository;
    private final PromptVersionRepository promptVersionRepository;
    private final PromptMapper promptMapper;

    public VersioningService(PromptRepository promptRepository,
                             PromptVersionRepository promptVersionRepository,
                             PromptMapper promptMapper) {
        this.promptRepository = promptRepository;
        this.promptVersionRepository = promptVersionRepository;
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

    @Transactional
    public void rollbackToVersion(Long promptId, Long versionNumber) {
        Prompt prompt = promptRepository.findById(promptId)
                .orElseThrow(() -> new ResourceNotFoundException("Prompt not found with id: " + promptId));

        PromptVersion targetVersion = promptVersionRepository
                .findByPromptIdAndVersion(promptId, versionNumber.intValue())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Version " + versionNumber + " not found for prompt id: " + promptId));

        // Snapshot current state before rollback
        prompt.getVersions().add(promptMapper.toPromptVersion(prompt));

        // Restore prompt from the target version
        promptMapper.restorePromptFromVersion(prompt, targetVersion);
        prompt.setVersion(prompt.getVersion() + 1);

        promptRepository.save(prompt);
    }
}
