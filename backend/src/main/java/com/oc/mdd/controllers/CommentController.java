package com.oc.mdd.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.oc.mdd.dto.CommentCreationDto;
import com.oc.mdd.dto.CommentDto;
import com.oc.mdd.dto.ErrorResponseDto;
import com.oc.mdd.services.CommentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Controller
@Tag(name = "Comment Management", description = "Endpoint for comments management")
@RequestMapping("/api")
public class CommentController {

	@Autowired
	private CommentService commentService;

	@Operation(summary = "Get all comments of article", description = "Returns all comments by article id")
	@ApiResponse(responseCode = "200", description = "Comments retrieved successfully", content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = CommentDto.class))))
	@ApiResponse(responseCode = "403", description = "Access denied", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@ApiResponse(responseCode = "404", description = "Article not found", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@GetMapping("/articles/{id}/comments")
	public ResponseEntity<List<CommentDto>> getAllArticleComments(@PathVariable Long id) {
		return ResponseEntity.ok(commentService.findAllCommentsByArticleId(id));

	}

	@Operation(summary = "Create a new comment", description = "Creates comment and returns it")
	@ApiResponse(responseCode = "201", description = "Comment created successfully", content = @Content(schema = @Schema(implementation = CommentDto.class)))
	@ApiResponse(responseCode = "403", description = "Access denied", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
	@PostMapping("/articles/{id}/comments")
	public ResponseEntity<CommentDto> createComment(@PathVariable Long id, @AuthenticationPrincipal String username,
			@Valid @RequestBody CommentCreationDto commentRequest) {
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(commentService.createComment(commentRequest, id, username));

	}

}
