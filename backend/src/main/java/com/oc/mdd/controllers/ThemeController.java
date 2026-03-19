package com.oc.mdd.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.oc.mdd.dto.ErrorResponseDto;
import com.oc.mdd.dto.ThemeDto;
import com.oc.mdd.services.ThemeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@Controller
@RequestMapping("/api")
@Tag(name = "Themes Management", description = "Endpoints for themes management")
public class ThemeController {

	@Autowired
	private ThemeService themeService;

	@Operation(summary = "Get all themes", description = "Returns all themes")
	@ApiResponse(responseCode = "200", description = "Themes retrieved successfully", content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = ThemeDto.class))))
	@ApiResponse(responseCode = "403", description = "Access denied", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@GetMapping("/themes")
	public ResponseEntity<List<ThemeDto>> getThemes() {
		return ResponseEntity.ok(themeService.fetchAllThemes());
	}

	@Operation(summary = "Get user subscribed themes", description = "Returns user's theme subscriptions")
	@ApiResponse(responseCode = "200", description = "Themes retrieved successfully", content = @Content(schema = @Schema(implementation = ThemeDto.class)))
	@ApiResponse(responseCode = "403", description = "Access denied", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@GetMapping("/themes/subscriptions")
	public ResponseEntity<List<ThemeDto>> getThemesSubscriptions(@AuthenticationPrincipal String username) {
		return ResponseEntity.ok(themeService.fetchSubscribedThemes(username));
	}

	@Operation(summary = "Subscribe to Theme", description = "Subscribes user to theme, returns empty body")
	@ApiResponse(responseCode = "204", description = "User subscribed successfully")
	@ApiResponse(responseCode = "403", description = "Access denied", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@ApiResponse(responseCode = "409", description = "User already subscribed", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@PostMapping("/themes/{id}/subscribe")
	public ResponseEntity subscribeUserToTheme(@AuthenticationPrincipal String username, @PathVariable Long id) {
		themeService.subscribeToTheme(username, id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

	@Operation(summary = "Unsubscribe from Theme", description = "Unubscribes user from theme, returns empty body")
	@ApiResponse(responseCode = "204", description = "User unsubscribed successfully")
	@ApiResponse(responseCode = "403", description = "Access denied", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@DeleteMapping("/themes/{id}/unsubscribe")
	public ResponseEntity unSubscribeUserFromTheme(@AuthenticationPrincipal String username, @PathVariable Long id) {
		themeService.unsubscribeFromTheme(username, id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

}
