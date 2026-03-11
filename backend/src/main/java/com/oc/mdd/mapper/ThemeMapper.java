package com.oc.mdd.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.oc.mdd.dto.ThemeDto;
import com.oc.mdd.models.Theme;

@Mapper(componentModel = "spring")
public interface ThemeMapper {
	ThemeDto toThemeDto(Theme theme);

	List<ThemeDto> toThemeDtoList(List<Theme> themes);

}
