package com.oc.mdd.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateRequestDto(@NotBlank(message = "Username is required") String username,
		@NotBlank(message = "Email is required") @Email(message = "please provide a valid email address") String email,
		String password) {

}
