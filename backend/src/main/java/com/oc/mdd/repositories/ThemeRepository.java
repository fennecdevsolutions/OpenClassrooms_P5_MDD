package com.oc.mdd.repositories;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.ListPagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.oc.mdd.models.Theme;

@Repository
public interface ThemeRepository extends ListCrudRepository<Theme, Long>, ListPagingAndSortingRepository<Theme, Long> {

}
