package com.oc.mdd.controllers;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oc.mdd.dto.CommentCreationDto;
import com.oc.mdd.dto.LoginRequestDto;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DisplayName("Comment Controller Integration Tests")
public class CommentControllerIT {

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper();

	private String token;

	@BeforeAll
	void setup() throws Exception {
		LoginRequestDto loginReq = LoginRequestDto.builder().identifier("Abdel_Dev").password("Password123!").build();

		String response = mockMvc
				.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginReq)))
				.andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

		token = objectMapper.readTree(response).get("token").asText();
	}

	@Test
	@Order(1)
	@DisplayName("GET /articles/{id}/comments - Should return existing comments")
	void getAllArticleComments_shouldReturnListOfCommentsForArticle() throws Exception {

		mockMvc.perform(get("/api/articles/1/comments").header("Authorization", "Bearer " + token))
				.andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(2)))
				.andExpect(jsonPath("$[0].content").value("Excellente explication sur les Signals !"));
	}

	@Test
	@Order(2)
	@DisplayName("POST /articles/{id}/comments - Should create a comment successfully")
	void createComment_shouldAddCommentToArticle() throws Exception {

		CommentCreationDto commentReq = CommentCreationDto.builder()
				.content("Ceci est un commentaire de test d'intégration.").build();

		mockMvc.perform(post("/api/articles/1/comments").header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(commentReq)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.content").value("Ceci est un commentaire de test d'intégration."))
				.andExpect(jsonPath("$.authorUsername").value("Abdel_Dev"));

		mockMvc.perform(get("/api/articles/1/comments").header("Authorization", "Bearer " + token))
				.andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(3)));
	}

	@Test
	@Order(3)
	@DisplayName("GET /articles/{id}/comments - Should return 404 for non-existent article")
	void getComments_shouldReturn404_whenArticleNotFound() throws Exception {

		mockMvc.perform(get("/api/articles/999/comments").header("Authorization", "Bearer " + token))
				.andExpect(status().isNotFound());
	}
}