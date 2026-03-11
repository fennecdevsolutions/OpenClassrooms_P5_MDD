package com.oc.mdd.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
import com.oc.mdd.models.Theme;
import com.oc.mdd.models.User;
import com.oc.mdd.repositories.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private PasswordEncoder pwEncoder;

	@Autowired
	private UserMapper userMapper;

	@Autowired
	private JwtService jwtService;

	@Autowired
	private ThemeService themeService;

	public JwtTokenDto registerUser(RegisterRequestDto registerRequest) {

		// check if username or email are already registered
		if (userRepo.existsByUsername(registerRequest.username())) {
			throw new ResourceAlreadyExistsException("Username '" + registerRequest.username() + "' is already taken!");
		}

		if (userRepo.existsByEmail(registerRequest.email())) {
			throw new ResourceAlreadyExistsException("Email '" + registerRequest.email() + "' is already registered!");
		}

		// Encode password
		String encodedPw = pwEncoder.encode(registerRequest.password());

		// Prepare entity and save it
		User userToRegister = userMapper.toEntity(registerRequest);
		userToRegister.setPassword(encodedPw);

		User registeredUser = userRepo.save(userToRegister);

		// Generate Jwt token and return it
		String token = jwtService.generateToken(registeredUser);

		return new JwtTokenDto(token);
	}

	public JwtTokenDto loginUser(LoginRequestDto loginRequest) {
		User user = userRepo.findByUsernameOrEmail(loginRequest.identifier(), loginRequest.identifier())
				.orElseThrow(() -> new InvalidCredentialsException("Invalid credentials"));
		if (!pwEncoder.matches(loginRequest.password(), user.getPassword())) {
			throw new InvalidCredentialsException("Invalid credentials");
		}

		return new JwtTokenDto(jwtService.generateToken(user));
	}

	public UserDto fetchUserData(String username) {

		User user = this.findUserByUsername(username);
		return userMapper.toUserDto(user);

	}

	public JwtTokenDto updateUserData(String currentUsername, UpdateRequestDto updateRequest) {
		// fetch User
		User user = this.findUserByUsername(currentUsername);
		boolean updated = false;

		// Update username if modified
		if (!updateRequest.username().equals(user.getUsername())) {
			if (userRepo.existsByUsername(updateRequest.username())) {
				throw new ResourceAlreadyExistsException(
						"Username '" + updateRequest.username() + "' is already taken!");
			}
			user.setUsername(updateRequest.username());
			updated = true;
		}

		// Update email if modified
		if (!updateRequest.email().equals(user.getEmail())) {
			if (userRepo.existsByEmail(updateRequest.email())) {
				throw new ResourceAlreadyExistsException(
						"Email '" + updateRequest.email() + "' is already registered!");
			}
			user.setEmail(updateRequest.email());
			updated = true;
		}

		// Update password if not empty

		if (updateRequest.password() != null && !updateRequest.password().isBlank()) {
			if (updateRequest.password().length() < 8
					|| !updateRequest.password().matches("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$")) {
				throw new ValidationException("Password must be at least 8 characters long");
			}
			user.setPassword(pwEncoder.encode(updateRequest.password()));
			updated = true;
		}

		// save user if changed
		if (updated) {
			userRepo.save(user);

		}
		return new JwtTokenDto(jwtService.generateToken(user));
	}

	public void unsubscribeFromTheme(String username, Long themeId) {
		User user = this.findUserByUsername(username);

		user.getSubscribedThemes().removeIf(theme -> theme.getId().equals(themeId));
		userRepo.save(user);
	}

	public void subscribeToTheme(String username, Long themeId) {
		User user = this.findUserByUsername(username);
		Theme theme = themeService.findById(themeId);

		if (user.getSubscribedThemes().contains(theme)) {
			throw new ResourceAlreadyExistsException("You are already subscribed to this theme");
		}

		user.getSubscribedThemes().add(theme);
		userRepo.save(user);
	}

	public User findUserByUsername(String username) {
		return userRepo.findByUsername(username)
				.orElseThrow(() -> new ResourceNotFoundException("User with username '" + username + "' not found"));
	}

}
