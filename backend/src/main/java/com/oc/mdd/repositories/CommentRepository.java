package com.oc.mdd.repositories;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.ListPagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.oc.mdd.models.Comment;

@Repository
public interface CommentRepository
		extends ListCrudRepository<Comment, Long>, ListPagingAndSortingRepository<Comment, Long> {
	List<Comment> findAllByArticleId(Long articleId, Sort sort);

}
