package com.oc.mdd.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record CommentCreationDto(@NotBlank String content) {

}
