package com.oc.mdd.dto;

import lombok.Builder;

@Builder
public record ThemeDto(Long id, String title, String description) {

}
