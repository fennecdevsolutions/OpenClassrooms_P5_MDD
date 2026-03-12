package com.oc.mdd.dto;

import jakarta.validation.constraints.NotBlank;

public record CommentCreationDto(@NotBlank String content) {

}
