package com.oc.mdd.repositories;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.ListPagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.oc.mdd.models.Article;
import com.oc.mdd.models.Theme;

@Repository
public interface ArticleRepository
		extends ListCrudRepository<Article, Long>, ListPagingAndSortingRepository<Article, Long> {
	List<Article> findAllByThemeIn(List<Theme> themes, Sort sort);

}
