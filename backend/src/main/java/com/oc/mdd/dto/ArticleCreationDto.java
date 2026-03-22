package com.oc.mdd.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record ArticleCreationDto(@NotNull(message = "Theme is required") Long themeId,
		@NotBlank(message = "Article title is required") String articleTitle,
		@NotBlank(message = "Article content cannot be empty") String content) {

}
