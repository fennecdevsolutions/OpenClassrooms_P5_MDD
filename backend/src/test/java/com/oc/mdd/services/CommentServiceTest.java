package com.oc.mdd.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.tuple;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import com.oc.mdd.dto.CommentCreationDto;
import com.oc.mdd.dto.CommentDto;
import com.oc.mdd.exceptions.ResourceNotFoundException;
import com.oc.mdd.mapper.CommentMapper;
import com.oc.mdd.models.Article;
import com.oc.mdd.models.Comment;
import com.oc.mdd.models.User;
import com.oc.mdd.repositories.CommentRepository;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

	@Mock
	private CommentRepository commentRepo;

	@Mock
	private CommentMapper commentMapper;

	@Mock
	private ArticleService articleService;

	@Mock
	private UserService userService;

	@InjectMocks
	private CommentService commentService;

	private User author;
	private Article article;
	private Comment comment1;
	private CommentDto commentDto1;
	private List<Comment> comments;
	private List<CommentDto> commentDtos;

	@BeforeEach
	void setUp() {
		author = User.builder().id(1L).username("Abdel_Dev").build();
		article = Article.builder().id(1L).title("Test Article").build();
		comment1 = Comment.builder().id(1L).content("This is a great article!").author(author).article(article).build();
		commentDto1 = CommentDto.builder().content("This is a great article!").authorUsername("Abdel_Dev").build();
		comments = List.of(comment1);
		commentDtos = List.of(commentDto1);
	}

	@Test
	@DisplayName("Should return all comments for an existing article")
	void findAllCommentsByArticleId_shouldReturnCommentList_whenArticleExists() {
		Long articleId = 1L;
		when(articleService.existById(articleId)).thenReturn(true);
		when(commentRepo.findAllByArticleId(anyLong(), any(Sort.class))).thenReturn(comments);
		when(commentMapper.toCommentDtoList(comments)).thenReturn(commentDtos);

		List<CommentDto> result = commentService.findAllCommentsByArticleId(articleId);

		assertThat(result).hasSize(1);
		assertThat(result).extracting("authorUsername", "content")
				.containsExactly(tuple("Abdel_Dev", "This is a great article!"));

		verify(articleService, times(1)).existById(articleId);
		verify(commentRepo, times(1)).findAllByArticleId(anyLong(), any(Sort.class));
	}

	@Test
	@DisplayName("Should throw ResourceNotFoundException when fetching comments for non-existing article")
	void findAllCommentsByArticleId_shouldThrowException_whenArticleDoesNotExist() {

		when(articleService.existById(99L)).thenReturn(false);

		assertThatThrownBy(() -> commentService.findAllCommentsByArticleId(99L))
				.isInstanceOf(ResourceNotFoundException.class).hasMessage("Article not found");

		verify(commentRepo, never()).findAllByArticleId(anyLong(), any());
	}

	@Test
	@DisplayName("Should successfully create a comment")
	void createComment_shouldSaveAndReturnDto() {

		CommentCreationDto request = new CommentCreationDto("New Comment Content");
		Long articleId = 1L;
		String username = "Abdel_Dev";
		comment1.setContent(request.content());

		when(articleService.getArtcileById(articleId)).thenReturn(article);
		when(userService.findUserByUsername(username)).thenReturn(author);
		when(commentRepo.save(any(Comment.class))).thenReturn(comment1);
		CommentDto newCommentDto = CommentDto.builder().id(1L).content(comment1.getContent())
				.authorUsername(author.getUsername()).articleId(article.getId()).build();
		when(commentMapper.toCommentDto(comment1)).thenReturn(newCommentDto);

		CommentDto result = commentService.createComment(request, articleId, username);

		assertThat(result).isNotNull();
		assertThat(result.content()).isEqualTo("New Comment Content");
		assertThat(result.authorUsername()).isEqualTo(author.getUsername());
		assertThat(result.articleId()).isEqualTo(article.getId());

		verify(commentRepo, times(1)).save(any(Comment.class));
		verify(articleService).getArtcileById(articleId);
		verify(userService).findUserByUsername(username);
	}

}
