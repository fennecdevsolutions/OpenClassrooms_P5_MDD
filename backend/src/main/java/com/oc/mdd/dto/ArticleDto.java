package com.oc.mdd.dto;

import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record ArticleDto(Long id, String title, String content, String authorName, String themeTitle,
		LocalDateTime createdAt) {

}
