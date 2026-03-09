package com.oc.mdd.configurations;

import java.io.IOException;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.oc.mdd.models.User;
import com.oc.mdd.services.JwtService;
import com.oc.mdd.services.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

	@Autowired
	private JwtService jwtService;

	@Lazy
	@Autowired
	private UserService userService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {

		final String authorizationHeader = request.getHeader("Authorization");

		String username = null;
		String jwt = null;

		if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
			// extracting the token String from header
			jwt = authorizationHeader.substring(7);
			// extracting the User username
			username = jwtService.extractUsername(jwt);
		}
		if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			// finding the User with extracted username
			// add exception handling for not found user

			User user = this.userService.findUserByUsername(username);

			// Create an authentication token and fill it with fetched User, null for
			// credentials, empty roles array since no roles defined in the project)

			UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
					user.getUsername(), null, new ArrayList<>());

			// add meta data from the request to the authentication token
			authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

			// update the Security Context with the user authentication token
			SecurityContextHolder.getContext().setAuthentication(authenticationToken);
		}
		chain.doFilter(request, response);

	}

}
