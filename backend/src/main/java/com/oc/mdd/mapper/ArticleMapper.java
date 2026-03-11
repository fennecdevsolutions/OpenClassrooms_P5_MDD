package com.oc.mdd.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.oc.mdd.dto.ArticleDto;
import com.oc.mdd.models.Article;

@Mapper(componentModel = "spring")
public interface ArticleMapper {

	@Mapping(source = "author.username", target = "authorName")
	@Mapping(source = "theme.title", target = "themeTitle")
	ArticleDto toArticleDto(Article article);

	List<ArticleDto> toArticleDtoList(List<Article> articles);

}
