package com.oc.mdd.controllers;

import static org.hamcrest.CoreMatchers.hasItem;
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
import org.junit.jupiter.api.TestInstance.Lifecycle;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.oc.mdd.dto.LoginRequestDto;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(Lifecycle.PER_CLASS)
@Transactional
@DisplayName("Article Controller Integration Tests")
class ArticleControllerIT {

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper();

	private String token;

	@BeforeAll
	void setupToken() throws Exception {
		LoginRequestDto loginReq = LoginRequestDto.builder().identifier("Abdel_Dev").password("Password123!").build();
		String response = mockMvc
				.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginReq)))
				.andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

		JsonNode jsonNode = objectMapper.readTree(response);
		token = jsonNode.get("token").asText();
	}

	@Test
	@Order(1)
	@DisplayName("Should get all articles")
	void getArticles_shouldReturnAllUserArticlesInSuccessResponse() throws Exception {
		mockMvc.perform(get("/api/articles").header("Authorization", "Bearer " + token)).andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray()).andExpect(jsonPath("$.length()").value(10))
				.andExpect(jsonPath("$[*].title", hasItem("Comprendre l'IoC dans Spring Boot")));

	}

	@Test
	@Order(2)
	@DisplayName("Should get specific article details")
	void getArticleDetails_shouldReturnArticle_whenIdExists() throws Exception {
		mockMvc.perform(get("/api/articles/1").header("Authorization", "Bearer " + token)).andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(1))
				.andExpect(jsonPath("$.title").value("La révolution des Signals en Angular"))
				.andExpect(jsonPath("$.themeTitle").value("Angular & TypeScript"));
	}

	@Test
	@Order(3)
	@DisplayName("Should successfully publish a new article")
	void publishArticle_shouldCreateAndReturnArticle() throws Exception {
		String jsonRequest = """
				{
				    "articleTitle": "Integration Test Article",
				    "content": "This content was created during an integration test.",
				    "themeId": 1
				}
				""";

		mockMvc.perform(post("/api/articles").header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON).content(jsonRequest)).andExpect(status().isOk())
				.andExpect(jsonPath("$.title").value("Integration Test Article"))
				.andExpect(jsonPath("$.authorName").value("Abdel_Dev"))
				.andExpect(jsonPath("$.themeTitle").value("Java & Spring"));

		mockMvc.perform(get("/api/articles").header("Authorization", "Bearer " + token))
				.andExpect(jsonPath("$.length()").value(11));

	}

}
