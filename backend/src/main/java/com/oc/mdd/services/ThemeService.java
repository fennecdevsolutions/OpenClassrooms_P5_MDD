package com.oc.mdd.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oc.mdd.exceptions.ResourceNotFoundException;
import com.oc.mdd.models.Theme;
import com.oc.mdd.repositories.ThemeRepository;

@Service
public class ThemeService {

	@Autowired
	private ThemeRepository themeRepo;

	public Theme findById(Long id) {
		return themeRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Theme not found"));
	}

	public List<Theme> fetchAllThemes() {
		return themeRepo.findAll();
	}

}
