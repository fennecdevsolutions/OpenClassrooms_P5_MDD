package com.oc.mdd.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Duration;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.oc.mdd.exceptions.InvalidCredentialsException;
import com.oc.mdd.models.User;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {
	@InjectMocks
	private JwtService jwtService;

	private User user;

	private final String DUMMY_SECRET = "my-ultra-secret-key-that-is-at-least-32-characters-long";
	private final Duration DUMMY_EXPIRATION = Duration.ofHours(1);

	@BeforeEach
	void setUp() {
		ReflectionTestUtils.setField(jwtService, "secretKey", DUMMY_SECRET);
		ReflectionTestUtils.setField(jwtService, "expirationPeriod", DUMMY_EXPIRATION);

		user = User.builder().username("Abdel_Dev").email("abdel@test.com").build();
	}

	@Test
	@DisplayName("Should generate a valid JWT token")
	void generateToken_shouldReturnTokenString() {

		String token = jwtService.generateToken(user);

		assertThat(token).isNotNull();
		// A JWT consists of 3 parts separated by dots: Header.Payload.Signature
		assertThat(token.split("\\.")).hasSize(3);
	}

	@Test
	@DisplayName("Should extract correct username from a valid token")
	void extractUsername_shouldReturnUsername_whenTokenIsValid() {

		String token = jwtService.generateToken(user);

		String extractedUsername = jwtService.extractUsername(token);

		assertThat(extractedUsername).isEqualTo("Abdel_Dev");
	}

	@Test
	@DisplayName("Should throw InvalidCredentialsException when token is malformed")
	void extractUsername_shouldThrowException_whenTokenIsInvalid() {

		String malformedToken = "not.a.real.jwt.token";

		assertThatThrownBy(() -> jwtService.extractUsername(malformedToken))
				.isInstanceOf(InvalidCredentialsException.class).hasMessage("Invalid JWT token");
	}

	@Test
	@DisplayName("Should throw InvalidCredentialsException when token is expired")
	void extractUsername_shouldThrowException_whenTokenIsExpired() {
		// set expiration to 0 to simulate immediate expiry
		ReflectionTestUtils.setField(jwtService, "expirationPeriod", Duration.ZERO);
		String expiredToken = jwtService.generateToken(user);

		assertThatThrownBy(() -> jwtService.extractUsername(expiredToken))
				.isInstanceOf(InvalidCredentialsException.class).hasMessage("JWT token expired");
	}

}
