package com.oc.mdd.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RegisterRequestDto {

	private String username;
	private String email;
	private String password;
}
