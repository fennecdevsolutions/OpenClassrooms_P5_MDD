package com.oc.mdd.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.oc.mdd.dto.RegisterRequestDto;
import com.oc.mdd.dto.UserDto;
import com.oc.mdd.models.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

	// register request Dto to Entity
	@Mapping(target = "id", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	@Mapping(target = "updatedAt", ignore = true)
	@Mapping(target = "subscribedThemes", ignore = true)
	User toEntity(RegisterRequestDto registerRequest);

// User to UserDto
	UserDto toUserDto(User user);
}
