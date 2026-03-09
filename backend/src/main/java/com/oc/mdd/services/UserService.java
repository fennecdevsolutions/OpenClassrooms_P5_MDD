package com.oc.mdd.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.oc.mdd.dto.JwtTokenDto;
import com.oc.mdd.dto.RegisterRequestDto;
import com.oc.mdd.exceptions.ResourceAlreadyExistsException;
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

	JwtTokenDto registerUser(RegisterRequestDto registerRequest) {

		// check if username or email are already registered
		if (userRepo.existsByUsername(registerRequest.getUsername())) {
			throw new ResourceAlreadyExistsException(
					"Username '" + registerRequest.getUsername() + "' is already taken!");
		}

		if (userRepo.existsByEmail(registerRequest.getEmail())) {
			throw new ResourceAlreadyExistsException(
					"Email '" + registerRequest.getEmail() + "' is already registered!");
		}

		// Encode password
		String encodedPw = pwEncoder.encode(registerRequest.getPassword());

		// Prepare entity and save it
		User userToRegister = userMapper.toEntity(registerRequest);
		userToRegister.setPassword(encodedPw);

		User registeredUser = userRepo.save(userToRegister);

		// Generate Jwt token and return it
		String token = jwtService.generateToken(registeredUser);

		return new JwtTokenDto(token);
	}

}
