package com.oc.mdd.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.oc.mdd.dto.ArticleCreationDto;
import com.oc.mdd.dto.ArticleDto;
import com.oc.mdd.dto.ErrorResponseDto;
import com.oc.mdd.services.ArticleService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Controller
@RequestMapping("/api")
@Tag(name = "Article Management", description = "Endpoints for articles management")
public class ArticleController {

	@Autowired
	private ArticleService articleService;

	@Operation(summary = "Get all articles", description = "Returns all articles based on the user theme subscriptions")
	@ApiResponse(responseCode = "200", description = "Articles retrieved successfully", content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = ArticleDto.class))))
	@ApiResponse(responseCode = "403", description = "Access denied", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@GetMapping("/articles")
	public ResponseEntity<List<ArticleDto>> getArticles(@AuthenticationPrincipal String username,
			@RequestParam(defaultValue = "desc") String direction) {
		return ResponseEntity.ok(articleService.fetchSubscribedArticles(username, direction));
	}

	@Operation(summary = "Get article details", description = "Returns the details of selected article")
	@ApiResponse(responseCode = "200", description = "Article retrieved successfully", content = @Content(schema = @Schema(implementation = ArticleDto.class)))
	@ApiResponse(responseCode = "403", description = "Access denied", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@ApiResponse(responseCode = "404", description = "Article not found", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@GetMapping("/articles/{id}")
	public ResponseEntity<ArticleDto> getArticleDetails(@PathVariable Long id) {
		return ResponseEntity.ok(articleService.getArticleDetails(id));
	}

	@Operation(summary = "Create a new article", description = "Creates a new article and returns it")
	@ApiResponse(responseCode = "201", description = "Article created successfully", content = @Content(schema = @Schema(implementation = ArticleDto.class)))
	@ApiResponse(responseCode = "403", description = "Access denied", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@PostMapping("/articles")
	public ResponseEntity<ArticleDto> publishArticle(@Valid @RequestBody ArticleCreationDto creationRequest,
			@AuthenticationPrincipal String username) {
		return ResponseEntity.ok(articleService.createArticle(creationRequest, username));
	}
}
