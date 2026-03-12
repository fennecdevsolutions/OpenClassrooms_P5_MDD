package com.oc.mdd.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.oc.mdd.dto.ThemeDto;
import com.oc.mdd.exceptions.ResourceAlreadyExistsException;
import com.oc.mdd.exceptions.ResourceNotFoundException;
import com.oc.mdd.mapper.ThemeMapper;
import com.oc.mdd.models.Theme;
import com.oc.mdd.models.User;
import com.oc.mdd.repositories.ThemeRepository;

@Service
public class ThemeService {

	@Autowired
	private ThemeRepository themeRepo;

	@Autowired
	private ThemeMapper themeMapper;

	@Lazy
	@Autowired
	private UserService userService;

	public Theme findById(Long id) {
		return themeRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Theme not found"));
	}

	public List<ThemeDto> fetchAllThemes() {
		return themeMapper.toThemeDtoList(themeRepo.findAll());
	}

	public List<ThemeDto> fetchSubscribedThemes(String username) {

		return themeMapper.toThemeDtoList(themeRepo.findBySubscribedUsersUsername(username));

	}

	public void unsubscribeFromTheme(String username, Long themeId) {

		Theme theme = this.findById(themeId);

		theme.getSubscribedUsers().removeIf(user -> user.getUsername().equals(username));

		themeRepo.save(theme);
	}

	public void subscribeToTheme(String username, Long themeId) {
		User user = userService.findUserByUsername(username);
		Theme theme = this.findById(themeId);

		if (theme.getSubscribedUsers().contains(user)) {
			throw new ResourceAlreadyExistsException("You are already subscribed to this theme");
		}

		theme.getSubscribedUsers().add(user);
		themeRepo.save(theme);
	}

}
