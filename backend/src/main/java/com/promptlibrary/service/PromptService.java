package com.promptlibrary.service;

import com.promptlibrary.dto.PromptCreateRequest;
import com.promptlibrary.dto.PromptPageResponse;
import com.promptlibrary.dto.PromptResponse;
import com.promptlibrary.dto.PromptStatus;
import com.promptlibrary.dto.PromptType;
import com.promptlibrary.exception.DuplicateNameException;
import com.promptlibrary.exception.ResourceNotFoundException;
import com.promptlibrary.model.PromptVariable;
import com.promptlibrary.mapper.PromptMapper;
import com.promptlibrary.model.Prompt;
import com.promptlibrary.repository.PromptRepository;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

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

    @Transactional
    public PromptResponse createPrompt(PromptCreateRequest request) {
        if (promptRepository.existsByName(request.getName())) {
            throw new DuplicateNameException("Prompt with name '" + request.getName() + "' already exists");
        }

        Prompt prompt = promptMapper.toPromptEntity(request);

        if (request.getVariables() != null) {
            List<PromptVariable> variables = request.getVariables().stream()
                    .map(v -> promptMapper.toPromptVariable(v, prompt))
                    .toList();
            prompt.getVariables().addAll(variables);
        }

        Prompt saved = promptRepository.save(prompt);
        return promptMapper.toPromptResponse(saved);
    }

    @Transactional(readOnly = true)
    public PromptPageResponse listPrompts(PromptType type, PromptStatus status,
                                          List<String> tags, String search,
                                          Integer page, Integer size) {
        Specification<Prompt> spec = buildSpecification(type, status, tags, search);
        Page<Prompt> promptPage = promptRepository.findAll(spec, PageRequest.of(page, size));
        return promptMapper.toPromptPageResponse(promptPage);
    }

    private Specification<Prompt> buildSpecification(PromptType type, PromptStatus status,
                                                     List<String> tags, String search) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (type != null) {
                predicates.add(cb.equal(root.get("type"),
                        com.promptlibrary.model.PromptType.valueOf(type.getValue())));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"),
                        com.promptlibrary.model.PromptStatus.valueOf(status.getValue())));
            }

            if (tags != null && !tags.isEmpty()) {
                List<Predicate> tagPredicates = new ArrayList<>();
                for (String tag : tags) {
                    Subquery<Long> tagSubquery = query.subquery(Long.class);
                    var tagRoot = tagSubquery.from(Prompt.class);
                    tagSubquery.select(tagRoot.get("id"))
                            .where(
                                    cb.equal(tagRoot.get("id"), root.get("id")),
                                    cb.isMember(tag, tagRoot.get("tags"))
                            );
                    tagPredicates.add(cb.exists(tagSubquery));
                }
                predicates.add(cb.or(tagPredicates.toArray(new Predicate[0])));
            }

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern),
                        cb.like(cb.lower(root.get("templateBody")), pattern)
                ));
            }

            // Avoid duplicate results from joins
            query.distinct(true);

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
