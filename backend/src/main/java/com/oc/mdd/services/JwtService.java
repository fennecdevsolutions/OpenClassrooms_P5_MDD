package com.oc.mdd.services;

import java.time.Duration;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.oc.mdd.exceptions.InvalidCredentialsException;
import com.oc.mdd.models.User;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	@Value("${JwtSecret}")
	private String secretKey;

	@Value("${jwt.expiration-period}")
	private Duration expirationPeriod;

	public String generateToken(User user) {
		return Jwts.builder().subject(user.getUsername()).issuedAt(new Date(System.currentTimeMillis()))
				.expiration(new Date(System.currentTimeMillis() + expirationPeriod.toMillis())).signWith(getSignInKey())
				.compact();

	}

	private SecretKey getSignInKey() {
		return Keys.hmacShaKeyFor(secretKey.getBytes());
	}

	public String extractUsername(String token) {
		try {
			return Jwts.parser().verifyWith(getSignInKey()).build().parseSignedClaims(token).getPayload().getSubject();

		} catch (ExpiredJwtException ex) {
			throw new InvalidCredentialsException("JWT token expired");
		} catch (JwtException | IllegalArgumentException ex) {
			throw new InvalidCredentialsException("Invalid JWT token");
		}
	}
}
