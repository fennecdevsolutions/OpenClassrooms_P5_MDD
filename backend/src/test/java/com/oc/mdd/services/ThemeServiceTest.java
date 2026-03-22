package com.oc.mdd.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.oc.mdd.dto.ThemeDto;
import com.oc.mdd.exceptions.ResourceAlreadyExistsException;
import com.oc.mdd.exceptions.ResourceNotFoundException;
import com.oc.mdd.mapper.ThemeMapper;
import com.oc.mdd.models.Theme;
import com.oc.mdd.models.User;
import com.oc.mdd.repositories.ThemeRepository;

@ExtendWith(MockitoExtension.class)
class ThemeServiceTest {

	@Mock
	private ThemeRepository themeRepo;

	@Mock
	private ThemeMapper themeMapper;

	@Mock
	private UserService userService;

	@InjectMocks
	private ThemeService themeService;

	private Theme theme1;
	private ThemeDto themeDto1;
	private User user;

	@BeforeEach
	void setUp() {
		theme1 = Theme.builder().id(1L).title("Java").description("Java Programming").subscribedUsers(new ArrayList<>())
				.build();
		themeDto1 = ThemeDto.builder().id(1L).title("Java").description("Java Programming").build();
		user = User.builder().id(1L).username("Abdel_Dev").build();
	}

	@Test
	@DisplayName("Should return theme when ID is found")
	void findById_shouldReturnTheme_whenFound() {
		when(themeRepo.findById(1L)).thenReturn(Optional.of(theme1));

		Theme result = themeService.findById(1L);

		assertThat(result).isEqualTo(theme1);
		verify(themeRepo, times(1)).findById(1L);
	}

	@Test
	@DisplayName("Should throw ResourceNotFoundException when theme ID is not found")
	void findById_shouldThrowException_whenNotFound() {
		when(themeRepo.findById(99L)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> themeService.findById(99L)).isInstanceOf(ResourceNotFoundException.class)
				.hasMessage("Theme not found");

		verify(themeRepo, never()).findById(1L);
	}

	@Test
	@DisplayName("Should fetch all themes")
	void fetchAllThemes_shouldReturnThemeDtoList() {
		List<Theme> themes = List.of(theme1);
		List<ThemeDto> themeDtos = List.of(themeDto1);

		when(themeRepo.findAll()).thenReturn(themes);
		when(themeMapper.toThemeDtoList(themes)).thenReturn(themeDtos);

		List<ThemeDto> result = themeService.fetchAllThemes();

		assertThat(result).hasSize(1);
		assertThat(result.get(0).title()).isEqualTo("Java");
		verify(themeRepo, times(1)).findAll();
	}

	@Test
	@DisplayName("Should fetch Subscribed themes of user")
	void fetchSubscribedThemes_shouldReturnThemeDtoListOfUserSubscribedThemes() {
		List<Theme> themes = List.of(theme1);
		List<ThemeDto> themeDtos = List.of(themeDto1);

		when(themeRepo.findBySubscribedUsersUsername("Abdel_Dev")).thenReturn(themes);
		when(themeMapper.toThemeDtoList(themes)).thenReturn(themeDtos);

		List<ThemeDto> result = themeService.fetchSubscribedThemes("Abdel_Dev");

		assertThat(result).hasSize(1);
		assertThat(result.get(0).title()).isEqualTo("Java");
		verify(themeRepo, times(1)).findBySubscribedUsersUsername("Abdel_Dev");
	}

	@Test
	@DisplayName("Should successfully subscribe a user to a theme")
	void subscribeToTheme_shouldAddUserAndSave() {
		when(userService.findUserByUsername("Abdel_Dev")).thenReturn(user);
		when(themeRepo.findById(1L)).thenReturn(Optional.of(theme1));

		themeService.subscribeToTheme("Abdel_Dev", 1L);

		assertThat(theme1.getSubscribedUsers()).contains(user);
		verify(themeRepo, times(1)).save(theme1);
		verify(themeRepo, times(1)).findById(1L);
		verify(userService, times(1)).findUserByUsername("Abdel_Dev");

	}

	@Test
	@DisplayName("Should throw ResourceAlreadyExistsException if user is already subscribed")
	void subscribeToTheme_shouldThrowException_whenAlreadySubscribed() {
		theme1.getSubscribedUsers().add(user);
		when(userService.findUserByUsername("Abdel_Dev")).thenReturn(user);
		when(themeRepo.findById(1L)).thenReturn(Optional.of(theme1));

		assertThatThrownBy(() -> themeService.subscribeToTheme("Abdel_Dev", 1L))
				.isInstanceOf(ResourceAlreadyExistsException.class)
				.hasMessage("You are already subscribed to this theme");
		verify(themeRepo, never()).save(theme1);
		verify(themeRepo, times(1)).findById(1L);
		verify(userService, times(1)).findUserByUsername("Abdel_Dev");

	}

	@Test
	@DisplayName("Should successfully unsubscribe a user from a theme")
	void unsubscribeFromTheme_shouldRemoveUserAndSave() {
		theme1.getSubscribedUsers().add(user);
		when(themeRepo.findById(1L)).thenReturn(Optional.of(theme1));

		themeService.unsubscribeFromTheme("Abdel_Dev", 1L);

		assertThat(theme1.getSubscribedUsers()).doesNotContain(user);
		verify(themeRepo, times(1)).save(theme1);
		verify(themeRepo, times(1)).findById(1L);

	}

}
