package com.oc.mdd.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDto(@NotBlank(message = "Username or Email required") String identifier,
		@NotBlank(message = "Password is required") String password) {

}
