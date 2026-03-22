package com.oc.mdd.services;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.oc.mdd.dto.ArticleCreationDto;
import com.oc.mdd.dto.ArticleDto;
import com.oc.mdd.exceptions.ResourceNotFoundException;
import com.oc.mdd.mapper.ArticleMapper;
import com.oc.mdd.models.Article;
import com.oc.mdd.models.Theme;
import com.oc.mdd.models.User;
import com.oc.mdd.repositories.ArticleRepository;

@Service
public class ArticleService {

	@Autowired
	private ArticleRepository articleRepo;

	@Autowired
	private UserService userService;

	@Autowired
	private ThemeService themeService;

	@Autowired
	private ArticleMapper articleMapper;

	public List<ArticleDto> fetchSubscribedArticles(String username, String direction) {
		User user = userService.findUserByUsername(username);
		List<Theme> userThemes = user.getSubscribedThemes();

		if (userThemes.isEmpty()) {
			return Collections.emptyList();
		}
		// create the Sort object to use in repository
		Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by("createdAt").ascending()
				: Sort.by("createdAt").descending();

		List<Article> articles = articleRepo.findAllByThemeIn(userThemes, sort);

		return articleMapper.toArticleDtoList(articles);
	}

	public ArticleDto getArticleDetails(Long id) {
		Article article = this.getArtcileById(id);
		return articleMapper.toArticleDto(article);
	}

	public ArticleDto createArticle(ArticleCreationDto creationRequest, String username) {
		Article article = new Article();
		article.setAuthor(userService.findUserByUsername(username));
		article.setTheme(themeService.findById(creationRequest.themeId()));
		article.setTitle(creationRequest.articleTitle());
		article.setContent(creationRequest.content());
		article.setComments(Collections.emptyList());

		Article savedArticle = articleRepo.save(article);

		return articleMapper.toArticleDto(savedArticle);
	}

	public boolean existById(Long articleId) {
		return articleRepo.existsById(articleId);
	}

	public Article getArtcileById(Long articleId) {
		return articleRepo.findById(articleId).orElseThrow(() -> new ResourceNotFoundException("Article not found"));
	}
}
