package com.oc.mdd.dto;

import java.util.List;

import com.oc.mdd.models.Theme;

public record UserDto(String username, String email, List<Theme> subscribedThemes) {

}
