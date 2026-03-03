package com.promptlibrary.repository;

import com.promptlibrary.model.PromptVariable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromptVariableRepository extends JpaRepository<PromptVariable, Long> {

    List<PromptVariable> findByPromptId(Long promptId);
}
