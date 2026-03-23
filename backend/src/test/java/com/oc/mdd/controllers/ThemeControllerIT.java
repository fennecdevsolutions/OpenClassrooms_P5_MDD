package com.oc.mdd.controllers;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
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
import com.oc.mdd.dto.LoginRequestDto;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Transactional
@DisplayName("Theme Controller Integration Tests")
public class ThemeControllerIT {

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper();

	private String token;

	@BeforeAll
	void setup() throws Exception {
		LoginRequestDto loginReq = LoginRequestDto.builder().identifier("Sophie_Code").password("Password123!").build();

		String response = mockMvc
				.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginReq)))
				.andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

		token = objectMapper.readTree(response).get("token").asText();
	}

	@Test
	@Order(1)
	@DisplayName("GET /themes - Should return all 5 themes")
	void getThemes_shouldReturnCompleteList() throws Exception {
		mockMvc.perform(get("/api/themes").header("Authorization", "Bearer " + token)).andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(5))).andExpect(jsonPath("$[0].title").value("Java & Spring"));
	}

	@Test
	@Order(2)
	@DisplayName("GET /themes/subscriptions - Should return Sophie's 2 themes")
	void getThemesSubscriptions_shouldReturnUserSpecificList() throws Exception {
		mockMvc.perform(get("/api/themes/subscriptions").header("Authorization", "Bearer " + token))
				.andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(2)));
	}

	@Test
	@Order(3)
	@DisplayName("POST /themes/{id}/subscribe - Should subscribe to a new theme")
	void subscribeUserToTheme_shouldAddRelationship() throws Exception {
		mockMvc.perform(post("/api/themes/4/subscribe").header("Authorization", "Bearer " + token))
				.andExpect(status().isNoContent());

		mockMvc.perform(get("/api/themes/subscriptions").header("Authorization", "Bearer " + token))
				.andExpect(jsonPath("$", hasSize(3)));
	}

	@Test
	@Order(4)
	@DisplayName("DELETE /themes/{id}/unsubscribe - Should remove relationship")
	void unSubscribeUserFromTheme_shouldRemoveRelationship() throws Exception {
		mockMvc.perform(delete("/api/themes/4/unsubscribe").header("Authorization", "Bearer " + token))
				.andExpect(status().isNoContent());

		mockMvc.perform(get("/api/themes/subscriptions").header("Authorization", "Bearer " + token))
				.andExpect(jsonPath("$", hasSize(2)));
	}
}