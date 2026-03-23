package com.oc.mdd.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
import com.oc.mdd.dto.RegisterRequestDto;
import com.oc.mdd.dto.UpdateRequestDto;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Transactional
@DisplayName("User Controller Integration Tests")
public class UserControllerIT {

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper();

	private String authToken;

	@Test
	@Order(1)
	@DisplayName("POST /auth/register - Success")
	void registerUser_shouldCreateUserAndReturnToken() throws Exception {
		RegisterRequestDto registerReq = RegisterRequestDto.builder().username("NewTester").email("tester@mdd.com")
				.password("Password123!").build();

		String response = mockMvc
				.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(registerReq)))
				.andExpect(status().isCreated()).andExpect(jsonPath("$.token").exists()).andReturn().getResponse()
				.getContentAsString();

		String newlyCreatedToken = objectMapper.readTree(response).get("token").asText();

		mockMvc.perform(get("/api/user").header("Authorization", "Bearer " + newlyCreatedToken))
				.andExpect(status().isOk()).andExpect(jsonPath("$.username").value("NewTester"))
				.andExpect(jsonPath("$.email").value("tester@mdd.com"));
	}

	@Test
	@Order(2)
	@DisplayName("POST /auth/login - Success & Token Generation")
	void loginUser_shouldReturnToken() throws Exception {
		LoginRequestDto loginReq = LoginRequestDto.builder().identifier("Abdel_Dev").password("Password123!").build();

		String response = mockMvc
				.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginReq)))
				.andExpect(status().isOk()).andExpect(jsonPath("$.token").exists()).andReturn().getResponse()
				.getContentAsString();

		authToken = objectMapper.readTree(response).get("token").asText();
	}

	@Test
	@Order(3)
	@DisplayName("GET /user - Success with valid token")
	void getUserData_shouldReturnProfileInfo() throws Exception {
		mockMvc.perform(get("/api/user").header("Authorization", "Bearer " + authToken)).andExpect(status().isOk())
				.andExpect(jsonPath("$.username").value("Abdel_Dev"))
				.andExpect(jsonPath("$.email").value("abdel@mdd.com"));
	}

	@Test
	@Order(4)
	@DisplayName("PUT /user - Success update and check persistence")
	void updateUser_shouldModifyData() throws Exception {
		UpdateRequestDto updateReq = UpdateRequestDto.builder().username("Abdel_Updated").email("abdel_new@mdd.com")
				.build();

		String response = mockMvc
				.perform(put("/api/user").header("Authorization", "Bearer " + authToken)
						.contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(updateReq)))
				.andExpect(status().isOk()).andExpect(jsonPath("$.token").exists()).andReturn().getResponse()
				.getContentAsString();

		authToken = objectMapper.readTree(response).get("token").asText();

		mockMvc.perform(get("/api/user").header("Authorization", "Bearer " + authToken)).andExpect(status().isOk())
				.andExpect(jsonPath("$.username").value("Abdel_Updated"))
				.andExpect(jsonPath("$.email").value("abdel_new@mdd.com"));
	}

	@Test
	@Order(5)
	@DisplayName("POST /auth/login - Failure (Invalid Credentials)")
	void login_shouldReturn401_whenCredentialsInvalid() throws Exception {
		LoginRequestDto loginReq = LoginRequestDto.builder().identifier("Abdel_Dev").password("WrongPassword").build();

		mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(loginReq))).andExpect(status().isUnauthorized());
	}

	@Test
	@Order(6)
	@DisplayName("GET /user - Failure (Missing Token)")
	void getUserData_shouldReturn403_whenNoToken() throws Exception {
		mockMvc.perform(get("/api/user")).andExpect(status().isForbidden());
	}
}