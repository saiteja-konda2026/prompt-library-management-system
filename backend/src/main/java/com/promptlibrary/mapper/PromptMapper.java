package com.promptlibrary.mapper;

import com.promptlibrary.dto.PromptPageResponse;
import com.promptlibrary.dto.PromptResponse;
import com.promptlibrary.dto.PromptStatus;
import com.promptlibrary.dto.PromptType;
import com.promptlibrary.dto.VariableDefinition;
import com.promptlibrary.model.Prompt;
import com.promptlibrary.model.PromptVariable;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Component
public class PromptMapper {

    public PromptPageResponse toPromptPageResponse(Page<Prompt> page) {
        PromptPageResponse response = new PromptPageResponse();
        response.setContent(page.getContent().stream()
                .map(this::toPromptResponse)
                .toList());
        response.setTotalElements((int) page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setNumber(page.getNumber());
        return response;
    }

    public PromptResponse toPromptResponse(Prompt entity) {
        PromptResponse response = new PromptResponse();
        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setDescription(entity.getDescription());
        response.setType(toDto(entity.getType()));
        response.setTemplateBody(entity.getTemplateBody());
        response.setStatus(toDto(entity.getStatus()));
        response.setVersion(entity.getVersion());
        response.setTags(new ArrayList<>(entity.getTags()));
        response.setVariables(toVariableDefinitions(entity.getVariables()));
        response.setAuthor(entity.getCreatedBy());
        response.setCreatedAt(toOffsetDateTime(entity.getCreatedAt()));
        response.setUpdatedAt(toOffsetDateTime(entity.getUpdatedAt()));
        return response;
    }

    public List<VariableDefinition> toVariableDefinitions(List<PromptVariable> variables) {
        if (variables == null) {
            return new ArrayList<>();
        }
        return variables.stream()
                .map(this::toVariableDefinition)
                .toList();
    }

    public VariableDefinition toVariableDefinition(PromptVariable entity) {
        VariableDefinition dto = new VariableDefinition();
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setDefaultValue(entity.getDefaultValue());
        dto.setRequired(entity.getRequired());
        return dto;
    }

    private PromptType toDto(com.promptlibrary.model.PromptType type) {
        if (type == null) return null;
        return PromptType.valueOf(type.name());
    }

    private PromptStatus toDto(com.promptlibrary.model.PromptStatus status) {
        if (status == null) return null;
        return PromptStatus.valueOf(status.name());
    }

    private OffsetDateTime toOffsetDateTime(java.time.LocalDateTime localDateTime) {
        if (localDateTime == null) return null;
        return localDateTime.atOffset(ZoneOffset.UTC);
    }
}
