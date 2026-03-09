package com.oc.mdd.mapper;

import org.mapstruct.Mapper;

import com.oc.mdd.dto.RegisterRequestDto;
import com.oc.mdd.models.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

	// register request Dto to Entity

	User toEntity(RegisterRequestDto registerRequest);

}
