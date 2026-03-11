package com.oc.mdd.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oc.mdd.dto.ErrorResponseDto;
import com.oc.mdd.dto.JwtTokenDto;
import com.oc.mdd.dto.LoginRequestDto;
import com.oc.mdd.dto.RegisterRequestDto;
import com.oc.mdd.dto.UpdateRequestDto;
import com.oc.mdd.dto.UserDto;
import com.oc.mdd.services.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@Tag(name = "Authentication", description = "Endpoints for user management")
public class UserController {

	@Autowired
	private UserService userService;

	@Operation(summary = "Register a new user", description = "Creates a new user account and returns a JWT token upon success.")
	@ApiResponse(responseCode = "201", description = "User registered successfully", content = @Content(schema = @Schema(implementation = JwtTokenDto.class)))
	@ApiResponse(responseCode = "409", description = "Username or Email already registered", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@ApiResponse(responseCode = "400", description = "Registration form invalid", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@PostMapping("/auth/register")
	public ResponseEntity<JwtTokenDto> registerUser(@Valid @RequestBody RegisterRequestDto registerRequest) {
		return ResponseEntity.status(HttpStatus.CREATED).body(userService.registerUser(registerRequest));
	}

	@Operation(summary = "Login user", description = "Login user and returns a JWT token upon success.")
	@ApiResponse(responseCode = "200", description = "User logged in successfully", content = @Content(schema = @Schema(implementation = JwtTokenDto.class)))
	@ApiResponse(responseCode = "401", description = "Invalid credentials", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@PostMapping("/auth/login")
	public ResponseEntity<JwtTokenDto> registerUser(@Valid @RequestBody LoginRequestDto loginRequest) {
		return ResponseEntity.ok(userService.loginUser(loginRequest));
	}

	@Operation(summary = "Get user data by username", description = "Fetches user by username and returns user data")
	@ApiResponse(responseCode = "200", description = "User data found", content = @Content(schema = @Schema(implementation = UserDto.class)))
	@ApiResponse(responseCode = "403", description = "Access denied", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@GetMapping("/users/{username}")
	@PreAuthorize("#username == authentication.principal")
	public ResponseEntity<UserDto> getUserData(@PathVariable String username) {
		return ResponseEntity.ok(userService.fetchUserData(username));
	}

	@Operation(summary = "Update user profile", description = "Updates user profile if modified and returns a JWT token upon success.")
	@ApiResponse(responseCode = "200", description = "User profile updated", content = @Content(schema = @Schema(implementation = JwtTokenDto.class)))
	@ApiResponse(responseCode = "403", description = "Access denied", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@ApiResponse(responseCode = "409", description = "Username or Email already registered", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@ApiResponse(responseCode = "400", description = "Password invalid", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@PutMapping("/users/{username}")
	@PreAuthorize("#username == authentication.principal")
	public ResponseEntity<JwtTokenDto> updateUserProfile(@PathVariable String username,
			@Valid @RequestBody UpdateRequestDto updateRequest) {

		return ResponseEntity.ok(userService.updateUserData(username, updateRequest));
	}

	@Operation(summary = "Subscribe to Theme", description = "Subscribes user to theme, returns empty body")
	@ApiResponse(responseCode = "204", description = "User subscribed successfully")
	@ApiResponse(responseCode = "403", description = "Access denied", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@ApiResponse(responseCode = "409", description = "User already subscribed", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@PostMapping("/users/{username}/themes/{id}")
	@PreAuthorize("#username == authentication.principal")
	public ResponseEntity subscribeUserToTheme(@PathVariable String username, @PathVariable Long id) {
		userService.subscribeToTheme(username, id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

	@Operation(summary = "Unsubscribe from Theme", description = "Unubscribes user from theme, returns empty body")
	@ApiResponse(responseCode = "204", description = "User unsubscribed successfully")
	@ApiResponse(responseCode = "403", description = "Access denied", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@DeleteMapping("/users/{username}/themes/{id}")
	@PreAuthorize("#username == authentication.principal")
	public ResponseEntity unSubscribeUserFromTheme(@PathVariable String username, @PathVariable Long id) {
		userService.unsubscribeFromTheme(username, id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

}
