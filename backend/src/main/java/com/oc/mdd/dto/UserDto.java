package com.oc.mdd.dto;

import lombok.Builder;

@Builder
public record UserDto(String username, String email) {

}
