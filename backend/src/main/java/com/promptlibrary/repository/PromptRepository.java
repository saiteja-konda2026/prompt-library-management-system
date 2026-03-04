package com.promptlibrary.repository;

import com.promptlibrary.model.Prompt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PromptRepository extends JpaRepository<Prompt, Long>, JpaSpecificationExecutor<Prompt> {

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long id);
}
