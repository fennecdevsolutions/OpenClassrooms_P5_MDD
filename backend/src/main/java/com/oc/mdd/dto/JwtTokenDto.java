package com.oc.mdd.dto;

import lombok.Builder;

@Builder
public record JwtTokenDto(String token) {
}
