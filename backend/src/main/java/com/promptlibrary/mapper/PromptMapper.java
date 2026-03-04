package com.promptlibrary.mapper;

import com.promptlibrary.dto.PromptPageResponse;
import com.promptlibrary.dto.PromptResponse;
import com.promptlibrary.dto.PromptStatus;
import com.promptlibrary.dto.PromptType;
import com.promptlibrary.dto.PromptVersionResponse;
import com.promptlibrary.dto.VariableDefinition;
import com.promptlibrary.model.Prompt;
import com.promptlibrary.model.PromptVariable;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import com.promptlibrary.dto.PromptCreateRequest;
import com.promptlibrary.model.PromptVersion;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

@Component
public class PromptMapper {

    private final ObjectMapper objectMapper;

    public PromptMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

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

    public Prompt toPromptEntity(PromptCreateRequest request) {
        Prompt prompt = new Prompt();
        prompt.setName(request.getName());
        prompt.setDescription(request.getDescription());
        prompt.setType(com.promptlibrary.model.PromptType.valueOf(request.getType().getValue()));
        prompt.setTemplateBody(request.getTemplateBody());
        if (request.getTags() != null) {
            prompt.setTags(new HashSet<>(request.getTags()));
        }
        return prompt;
    }

    public PromptVariable toPromptVariable(VariableDefinition dto, Prompt prompt) {
        PromptVariable variable = new PromptVariable();
        variable.setPrompt(prompt);
        variable.setName(dto.getName());
        variable.setDescription(dto.getDescription());
        variable.setDefaultValue(dto.getDefaultValue());
        variable.setRequired(dto.getRequired());
        return variable;
    }

    public PromptVersionResponse toPromptVersionResponse(PromptVersion entity) {
        PromptVersionResponse response = new PromptVersionResponse();
        response.setVersion(entity.getVersion());
        response.setName(entity.getName());
        response.setDescription(entity.getDescription());
        response.setType(toDto(entity.getType()));
        response.setTemplateBody(entity.getTemplateBody());
        response.setStatus(toDto(entity.getStatus()));
        response.setAuthor(entity.getAuthor());
        response.setCreatedAt(toOffsetDateTime(entity.getCreatedAt()));
        try {
            if (entity.getTagsJson() != null) {
                List<String> tags = objectMapper.readValue(entity.getTagsJson(),
                        objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
                response.setTags(tags);
            }
            if (entity.getVariablesJson() != null) {
                List<VariableDefinition> variables = objectMapper.readValue(entity.getVariablesJson(),
                        objectMapper.getTypeFactory().constructCollectionType(List.class, VariableDefinition.class));
                response.setVariables(variables);
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize version data", e);
        }
        return response;
    }

    public PromptVersion toPromptVersion(Prompt prompt) {
        PromptVersion version = new PromptVersion();
        version.setPrompt(prompt);
        version.setVersion(prompt.getVersion());
        version.setName(prompt.getName());
        version.setDescription(prompt.getDescription());
        version.setType(prompt.getType());
        version.setTemplateBody(prompt.getTemplateBody());
        version.setStatus(prompt.getStatus());
        version.setAuthor(prompt.getUpdatedBy());
        version.setDisplayOrder(prompt.getDisplayOrder());
        try {
            version.setTagsJson(objectMapper.writeValueAsString(prompt.getTags()));
            List<Map<String, Object>> varList = prompt.getVariables().stream().map(v -> {
                Map<String, Object> map = new HashMap<>();
                map.put("name", v.getName());
                map.put("description", v.getDescription());
                map.put("defaultValue", v.getDefaultValue());
                map.put("required", v.getRequired());
                return map;
            }).toList();
            version.setVariablesJson(objectMapper.writeValueAsString(varList));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize version data", e);
        }
        return version;
    }

    public void updatePromptFromRequest(Prompt prompt, PromptCreateRequest request) {
        prompt.setName(request.getName());
        prompt.setDescription(request.getDescription());
        prompt.setType(com.promptlibrary.model.PromptType.valueOf(request.getType().getValue()));
        prompt.setTemplateBody(request.getTemplateBody());

        prompt.getTags().clear();
        if (request.getTags() != null) {
            prompt.getTags().addAll(request.getTags());
        }

        prompt.getVariables().clear();
        if (request.getVariables() != null) {
            List<PromptVariable> newVars = request.getVariables().stream()
                    .map(v -> toPromptVariable(v, prompt))
                    .toList();
            prompt.getVariables().addAll(newVars);
        }
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
