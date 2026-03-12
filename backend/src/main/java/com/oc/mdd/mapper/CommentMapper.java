package com.oc.mdd.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.oc.mdd.dto.CommentDto;
import com.oc.mdd.models.Comment;

@Mapper(componentModel = "spring")
public interface CommentMapper {

	@Mapping(source = "author.username", target = "authorUsername")
	@Mapping(source = "article.id", target = "articleId")
	CommentDto toCommentDto(Comment comment);

	List<CommentDto> toCommentDtoList(List<Comment> comments);

}
