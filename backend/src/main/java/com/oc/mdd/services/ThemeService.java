package com.oc.mdd.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oc.mdd.dto.ThemeDto;
import com.oc.mdd.exceptions.ResourceNotFoundException;
import com.oc.mdd.mapper.ThemeMapper;
import com.oc.mdd.models.Theme;
import com.oc.mdd.repositories.ThemeRepository;

@Service
public class ThemeService {

	@Autowired
	private ThemeRepository themeRepo;

	@Autowired
	private ThemeMapper themeMapper;

	public Theme findById(Long id) {
		return themeRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Theme not found"));
	}

	public List<ThemeDto> fetchAllThemes() {
		return themeMapper.toThemeDtoList(themeRepo.findAll());
	}

}
