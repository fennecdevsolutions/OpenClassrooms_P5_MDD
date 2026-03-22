package com.oc.mdd.dto;

import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record ErrorResponseDto(LocalDateTime timestamp, int status, String error, String message, String path) {

}
