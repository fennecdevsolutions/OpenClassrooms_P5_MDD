package com.oc.mdd.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.oc.mdd.dto.CommentCreationDto;
import com.oc.mdd.dto.CommentDto;
import com.oc.mdd.exceptions.ResourceNotFoundException;
import com.oc.mdd.mapper.CommentMapper;
import com.oc.mdd.models.Comment;
import com.oc.mdd.repositories.CommentRepository;

@Service
public class CommentService {

	@Autowired
	private CommentRepository commentRepo;

	@Autowired
	private CommentMapper commentMapper;

	@Autowired
	private ArticleService articleService;

	@Autowired
	private UserService userService;

	public List<CommentDto> findAllCommentsByArticleId(Long articleId) {
		if (!articleService.existById(articleId)) {
			throw new ResourceNotFoundException("Article not found");
		}

		Sort sort = Sort.by("createdAt").descending();

		List<Comment> comments = commentRepo.findAllByArticleId(articleId, sort);

		return commentMapper.toCommentDtoList(comments);

	}

	public CommentDto createComment(CommentCreationDto commentRequest, Long articleId, String authorUsername) {
		Comment comment = new Comment();
		comment.setArticle(articleService.getArtcileById(articleId));
		comment.setAuthor(userService.findUserByUsername(authorUsername));
		comment.setContent(commentRequest.content());

		Comment savedComment = commentRepo.save(comment);

		return commentMapper.toCommentDto(savedComment);
	}
}
