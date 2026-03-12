package com.oc.mdd.dto;

import java.time.LocalDateTime;

public record CommentDto(Long id, String content, Long articleId, String authorUsername, LocalDateTime createdAt) {

}
