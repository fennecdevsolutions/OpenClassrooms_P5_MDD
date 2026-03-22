package com.oc.mdd.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.oc.mdd.dto.JwtTokenDto;
import com.oc.mdd.dto.LoginRequestDto;
import com.oc.mdd.dto.RegisterRequestDto;
import com.oc.mdd.dto.UpdateRequestDto;
import com.oc.mdd.dto.UserDto;
import com.oc.mdd.exceptions.InvalidCredentialsException;
import com.oc.mdd.exceptions.ResourceAlreadyExistsException;
import com.oc.mdd.exceptions.ResourceNotFoundException;
import com.oc.mdd.exceptions.ValidationException;
import com.oc.mdd.mapper.UserMapper;
import com.oc.mdd.models.User;
import com.oc.mdd.repositories.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

	@Mock
	private UserRepository userRepo;

	@Mock
	private PasswordEncoder pwEncoder;

	@Mock
	private UserMapper userMapper;

	@Mock
	private JwtService jwtService;

	@InjectMocks
	private UserService userService;

	private User user;
	private UserDto userDto;
	private String token;

	@BeforeEach
	void setUp() {
		user = User.builder().id(1L).username("Abdel_Dev").email("abdel@test.com").password("EncodedPassword123!")
				.build();
		userDto = UserDto.builder().username("Abdel_Dev").email("abdel@test.com").build();
		token = "mocked-jwt-token";
	}

	@Test
	@DisplayName("Should register user successfully")
	void registerUser_shouldRegisterAndReturnToken() {
		RegisterRequestDto request = new RegisterRequestDto("Abdel_Dev", "abdel@test.com", "PlainPassword123!");

		when(userRepo.existsByUsername(request.username())).thenReturn(false);
		when(userRepo.existsByEmail(request.email())).thenReturn(false);
		when(pwEncoder.encode(request.password())).thenReturn("EncodedPassword123!");
		when(userMapper.toEntity(request)).thenReturn(user);
		when(userRepo.save(user)).thenReturn(user);
		when(jwtService.generateToken(user)).thenReturn(token);

		JwtTokenDto result = userService.registerUser(request);

		assertThat(result.token()).isEqualTo(token);
		verify(userRepo, times(1)).save(any(User.class));
		verify(pwEncoder).encode("PlainPassword123!");
		verify(userRepo, times(1)).existsByUsername(request.username());
		verify(userRepo, times(1)).existsByEmail(request.email());
		verify(userMapper, times(1)).toEntity(request);
		verify(jwtService, times(1)).generateToken(user);
	}

	@Test
	@DisplayName("Should throw exception if username already exists during registration")
	void registerUser_shouldThrowException_whenUsernameExists() {
		RegisterRequestDto request = new RegisterRequestDto("ExistingUser", "email@test.com", "pass");
		when(userRepo.existsByUsername("ExistingUser")).thenReturn(true);

		assertThatThrownBy(() -> userService.registerUser(request)).isInstanceOf(ResourceAlreadyExistsException.class)
				.hasMessageContaining("already taken");

		verify(userRepo, times(1)).existsByUsername(request.username());
		verify(userRepo, never()).existsByEmail(request.email());
		verify(userRepo, never()).save(any(User.class));
		verify(jwtService, never()).generateToken(any(User.class));

	}

	@Test
	@DisplayName("Should throw exception if email already exists during registration")
	void registerUser_shouldThrowException_whenEmailExists() {
		RegisterRequestDto request = new RegisterRequestDto("NewUser", "existing@email.com", "pass");
		when(userRepo.existsByUsername(request.username())).thenReturn(false);
		when(userRepo.existsByEmail("existing@email.com")).thenReturn(true);

		assertThatThrownBy(() -> userService.registerUser(request)).isInstanceOf(ResourceAlreadyExistsException.class)
				.hasMessageContaining("already registered!");

		verify(userRepo, times(1)).existsByUsername(request.username());
		verify(userRepo, times(1)).existsByEmail(request.email());
		verify(userRepo, never()).save(any(User.class));
		verify(jwtService, never()).generateToken(any(User.class));

	}

	@Test
	@DisplayName("Should login successfully with valid credentials")
	void loginUser_shouldReturnToken_whenCredentialsValid() {
		LoginRequestDto request = new LoginRequestDto("Abdel_Dev", "PlainPassword123!");

		when(userRepo.findByUsernameOrEmail(anyString(), anyString())).thenReturn(Optional.of(user));
		when(pwEncoder.matches("PlainPassword123!", user.getPassword())).thenReturn(true);
		when(jwtService.generateToken(user)).thenReturn(token);

		JwtTokenDto result = userService.loginUser(request);

		assertThat(result.token()).isEqualTo(token);
		verify(userRepo, times(1)).findByUsernameOrEmail("Abdel_Dev", "Abdel_Dev");
		verify(pwEncoder, times(1)).matches(anyString(), anyString());
		verify(jwtService, times(1)).generateToken(user);
	}

	@Test
	@DisplayName("Should throw exception if password doesn't match on login")
	void loginUser_shouldThrowException_whenPasswordInvalid() {
		LoginRequestDto request = new LoginRequestDto("Abdel_Dev", "WrongPass");

		when(userRepo.findByUsernameOrEmail(anyString(), anyString())).thenReturn(Optional.of(user));
		when(pwEncoder.matches("WrongPass", user.getPassword())).thenReturn(false);

		assertThatThrownBy(() -> userService.loginUser(request)).isInstanceOf(InvalidCredentialsException.class)
				.hasMessageContaining("Invalid credentials");
		verify(userRepo, times(1)).findByUsernameOrEmail("Abdel_Dev", "Abdel_Dev");
		verify(pwEncoder, times(1)).matches("WrongPass", user.getPassword());

	}

	@Test
	@DisplayName("Should update username, email and password successfully")
	void updateUserData_shouldUpdateFieldsAndSave() {
		UpdateRequestDto request = new UpdateRequestDto("NewUsername", "new@test.com", "NewPassword123!");

		when(userRepo.findByUsername("Abdel_Dev")).thenReturn(Optional.of(user));
		when(userRepo.existsByUsername("NewUsername")).thenReturn(false);
		when(userRepo.existsByEmail("new@test.com")).thenReturn(false);
		when(jwtService.generateToken(user)).thenReturn(token);
		when(pwEncoder.encode("NewPassword123!")).thenReturn("NewEncodedPassword");

		userService.updateUserData("Abdel_Dev", request);

		ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
		verify(userRepo).save(userCaptor.capture());

		User updatedUser = userCaptor.getValue();
		assertThat(updatedUser.getUsername()).isEqualTo("NewUsername");
		assertThat(updatedUser.getEmail()).isEqualTo("new@test.com");
		assertThat(updatedUser.getPassword()).isEqualTo("NewEncodedPassword");
		verify(userRepo, times(1)).findByUsername("Abdel_Dev");
		verify(userRepo, times(1)).existsByEmail(request.email());
		verify(userRepo, times(1)).existsByUsername(request.username());
		verify(jwtService, times(1)).generateToken(user);
	}

	@Test
	@DisplayName("Should throw ValidationException if new password is too short")
	void updateUserData_shouldThrowException_whenPasswordTooShort() {

		UpdateRequestDto request = new UpdateRequestDto("Abdel_Dev", "abdel@test.com", "1234");

		when(userRepo.findByUsername("Abdel_Dev")).thenReturn(Optional.of(user));

		assertThatThrownBy(() -> userService.updateUserData("Abdel_Dev", request))
				.isInstanceOf(ValidationException.class)
				.hasMessageContaining("Password must be at least 8 characters long");

		verify(userRepo, never()).save(any());
		verify(userRepo, times(1)).findByUsername("Abdel_Dev");
	}

	@Test
	@DisplayName("Should find user by username")
	void findUserByUsername_shouldReturnUser() {
		when(userRepo.findByUsername("Abdel_Dev")).thenReturn(Optional.of(user));

		User result = userService.findUserByUsername("Abdel_Dev");

		assertThat(result).isEqualTo(user);

		verify(userRepo, times(1)).findByUsername("Abdel_Dev");
	}

	@Test
	@DisplayName("Should throw ResourceNotFoundException when user not found")
	void findUserByUsername_shouldThrowException_whenNotFound() {
		when(userRepo.findByUsername("Unknown")).thenReturn(Optional.empty());

		assertThatThrownBy(() -> userService.findUserByUsername("Unknown"))
				.isInstanceOf(ResourceNotFoundException.class).hasMessageContaining("not found");

		verify(userRepo, times(1)).findByUsername("Unknown");
	}

	@Test
	@DisplayName("Should find user data by username and return user dto")
	void fetchUserData_shouldReturnUserDto() {
		when(userRepo.findByUsername("Abdel_Dev")).thenReturn(Optional.of(user));
		when(userMapper.toUserDto(user)).thenReturn(userDto);

		UserDto result = userService.fetchUserData("Abdel_Dev");

		assertThat(result).isEqualTo(userDto);
		verify(userRepo, times(1)).findByUsername("Abdel_Dev");
		verify(userMapper, times(1)).toUserDto(user);
	}
}
