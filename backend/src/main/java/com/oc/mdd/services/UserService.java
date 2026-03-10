package com.oc.mdd.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.oc.mdd.dto.JwtTokenDto;
import com.oc.mdd.dto.LoginRequestDto;
import com.oc.mdd.dto.RegisterRequestDto;
import com.oc.mdd.exceptions.InvalidCredentialsException;
import com.oc.mdd.exceptions.ResourceAlreadyExistsException;
import com.oc.mdd.exceptions.ResourceNotFoundException;
import com.oc.mdd.mapper.UserMapper;
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

	public User findUserByUsername(String username) {
		return userRepo.findByUsername(username)
				.orElseThrow(() -> new ResourceNotFoundException("User with username '" + username + "' not found"));
	}

}
