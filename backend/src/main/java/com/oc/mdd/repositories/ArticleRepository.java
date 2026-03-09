package com.oc.mdd.repositories;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.ListPagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.oc.mdd.models.Article;

@Repository
public interface ArticleRepository
		extends ListCrudRepository<Article, Long>, ListPagingAndSortingRepository<Article, Long> {

}
