package com.oc.mdd.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oc.mdd.dto.JwtTokenDto;
import com.oc.mdd.dto.RegisterRequestDto;
import com.oc.mdd.services.UserService;

@RestController
@RequestMapping("/api")
public class UserController {

	@Autowired
	private UserService userService;

	@PostMapping("/auth/register")
	public JwtTokenDto registerUser(@RequestBody RegisterRequestDto registerRequest) {
		return userService.registerUser(registerRequest);
	}

}
