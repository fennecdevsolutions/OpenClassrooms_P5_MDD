package com.oc.mdd.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.tuple;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import com.oc.mdd.dto.ArticleCreationDto;
import com.oc.mdd.dto.ArticleDto;
import com.oc.mdd.exceptions.ResourceNotFoundException;
import com.oc.mdd.mapper.ArticleMapper;
import com.oc.mdd.models.Article;
import com.oc.mdd.models.Theme;
import com.oc.mdd.models.User;
import com.oc.mdd.repositories.ArticleRepository;

import io.jsonwebtoken.lang.Collections;

@ExtendWith(MockitoExtension.class)
class ArticleServiceTest {

	@Mock
	private ArticleRepository articleRepo;

	@Mock
	private UserService userService;

	@Mock
	private ThemeService themeService;

	@Mock
	private ArticleMapper articleMapper;

	@InjectMocks
	private ArticleService articleService;

	private User user1;
	private User user2;
	private Article article1;
	private Article article2;
	private List<Article> articles;
	private Theme theme1;
	private Theme theme2;
	private List<Theme> themes;
	private String direction;
	private Sort sort;
	private ArticleDto dto1;
	private ArticleDto dto2;
	private List<ArticleDto> articleDtos;

	@BeforeEach
	void setUp() {
		sort = Sort.by("createdAt").descending();
		direction = "Desc";
		theme1 = Theme.builder().id(1L).title("Theme1").description("This is Theme1").build();
		theme2 = Theme.builder().id(2L).title("Theme2").description("This is Theme2").build();
		themes = List.of(theme1, theme2);
		user1 = User.builder().username("Abdel_Dev").subscribedThemes(themes).build();
		user2 = User.builder().username("Sophie_Code").subscribedThemes(Collections.emptyList()).build();
		article1 = Article.builder().author(user1).content("This is article1 content").id(1L).title("Article1").build();
		article2 = Article.builder().author(user2).content("This is article1 content").id(2L).title("Article2").build();
		articles = List.of(article1, article2);
		dto1 = ArticleDto.builder().id(article1.getId()).authorName(user1.getUsername()).title(article1.getTitle())
				.themeTitle(theme1.getTitle()).content(article1.getContent()).build();
		dto2 = ArticleDto.builder().id(article2.getId()).authorName(user2.getUsername()).title(article2.getTitle())
				.themeTitle(theme2.getTitle()).content(article2.getContent()).build();
		articleDtos = List.of(dto1, dto2);
	}

	@Test
	@DisplayName("Should return a list of articles")
	void fetchSubscribedArticles_shouldReturnListOfArticles() {

		when(articleRepo.findAllByThemeIn(themes, sort)).thenReturn(articles);
		when(userService.findUserByUsername(user1.getUsername())).thenReturn(user1);
		when(articleMapper.toArticleDtoList(articles)).thenReturn(articleDtos);

		List<ArticleDto> articlesRecieved = articleService.fetchSubscribedArticles(user1.getUsername(), direction);

		assertThat(articlesRecieved).hasSize(2).doesNotContainNull();
		assertThat(articlesRecieved).extracting("id", "title", "authorName", "themeTitle", "content").containsExactly(
				tuple(1L, article1.getTitle(), user1.getUsername(), theme1.getTitle(), article1.getContent()),
				tuple(2L, article2.getTitle(), user2.getUsername(), theme2.getTitle(), article2.getContent()));
		verify(articleRepo, times(1)).findAllByThemeIn(themes, sort);
		verify(userService, times(1)).findUserByUsername(user1.getUsername());
		verify(articleMapper, times(1)).toArticleDtoList(articles);

	}

	@Test
	@DisplayName("Should return an empty list if the user has no themes subscriptions")
	void fetchSubscribedArticles_shouldReturnEmptyList() {

		when(userService.findUserByUsername(user2.getUsername())).thenReturn(user2);

		List<ArticleDto> articlesRecieved = articleService.fetchSubscribedArticles(user2.getUsername(), direction);

		assertThat(articlesRecieved).isEmpty();
		verify(userService, times(1)).findUserByUsername(user2.getUsername());
		verify(articleRepo, never()).findAllByThemeIn(themes, sort);
		verify(articleMapper, never()).toArticleDtoList(articles);
	}

	@Test
	@DisplayName("Should return article details by Id")
	void getArticleDetails_shouldReturnArticlDto_whenFetchisSuccessful() {

		when(articleRepo.findById(1L)).thenReturn(Optional.of(article1));
		when(articleMapper.toArticleDto(article1)).thenReturn(dto1);

		ArticleDto articleReceived = articleService.getArticleDetails(1L);

		assertThat(articleReceived).isNotNull();
		assertThat(articleReceived).extracting("id", "title", "authorName", "themeTitle", "content").containsExactly(1L,
				article1.getTitle(), user1.getUsername(), theme1.getTitle(), article1.getContent());
		verify(articleRepo, times(1)).findById(1L);
		verify(articleMapper, times(1)).toArticleDto(article1);

	}

	@Test
	@DisplayName("Should create an article and return it")
	void createArticle_shouldSaveAndReturnDto() {
		// Arrange
		ArticleCreationDto request = ArticleCreationDto.builder().themeId(1L).articleTitle("New Title")
				.content("New Content").build();
		Article savedArticle = Article.builder().id(100L).title("New Title").content("New Content").build();
		ArticleDto savedArticleDto = ArticleDto.builder().id(100L).title("New Title").content("New Content")
				.authorName(user1.getUsername()).themeTitle(theme1.getTitle()).build();

		when(userService.findUserByUsername(user1.getUsername())).thenReturn(user1);
		when(themeService.findById(1L)).thenReturn(theme1);
		when(articleRepo.save(any(Article.class))).thenReturn(savedArticle);
		when(articleMapper.toArticleDto(savedArticle)).thenReturn(savedArticleDto);

		ArticleDto result = articleService.createArticle(request, user1.getUsername());

		assertThat(result).isNotNull();

		verify(articleRepo, times(1)).save(any(Article.class));

		assertThat(result.title()).isEqualTo("New Title");
		assertThat(result.content()).isEqualTo("New Content");
		assertThat(result.authorName()).isEqualTo(user1.getUsername());
		assertThat(result.themeTitle()).isEqualTo(theme1.getTitle());
	}

	@Test
	@DisplayName("Should return true if article exists")
	void existById_shouldReturnTrue_whenExists() {
		when(articleRepo.existsById(1L)).thenReturn(true);

		boolean exists = articleService.existById(1L);

		assertThat(exists).isTrue();
		verify(articleRepo, times(1)).existsById(1L);
	}

	@Test
	@DisplayName("Should return article when ID is found")
	void getArticleById_shouldReturnArticle() {
		when(articleRepo.findById(1L)).thenReturn(Optional.of(article1));

		Article result = articleService.getArtcileById(1L);

		assertThat(result).isEqualTo(article1);
	}

	@Test
	@DisplayName("Should throw ResourceNotFoundException when ID is not found")
	void getArticleById_shouldThrowException_whenNotFound() {
		when(articleRepo.findById(99L)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> articleService.getArtcileById(99L)).isInstanceOf(ResourceNotFoundException.class)
				.hasMessage("Article not found");

		verify(articleRepo, times(1)).findById(99L);
	}

}
