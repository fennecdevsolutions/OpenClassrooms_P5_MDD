package com.oc.mdd.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
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

}
