package com.oc.mdd.dto;

import java.time.LocalDateTime;

public record ArticleDto(Long id, String title, String content, String authorName, String themeTitle,
		LocalDateTime createdAt) {

}
