package com.promptlibrary.repository;

import com.promptlibrary.model.PromptVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PromptVersionRepository extends JpaRepository<PromptVersion, Long> {

    List<PromptVersion> findByPromptIdOrderByVersionDesc(Long promptId);

    Optional<PromptVersion> findByPromptIdAndVersion(Long promptId, Integer version);
}
