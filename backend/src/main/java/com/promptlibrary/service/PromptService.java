package com.promptlibrary.service;

import com.promptlibrary.dto.PromptResponse;
import com.promptlibrary.exception.ResourceNotFoundException;
import com.promptlibrary.mapper.PromptMapper;
import com.promptlibrary.model.Prompt;
import com.promptlibrary.repository.PromptRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PromptService {

    private final PromptRepository promptRepository;
    private final PromptMapper promptMapper;

    public PromptService(PromptRepository promptRepository, PromptMapper promptMapper) {
        this.promptRepository = promptRepository;
        this.promptMapper = promptMapper;
    }

    @Transactional(readOnly = true)
    public PromptResponse getPromptById(Long id) {

        Prompt prompt = promptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prompt not found with id: " + id));
        return promptMapper.toPromptResponse(prompt);
    }
}
