package com.oc.mdd.repositories;

import java.util.List;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.ListPagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.oc.mdd.models.Theme;

@Repository
public interface ThemeRepository extends ListCrudRepository<Theme, Long>, ListPagingAndSortingRepository<Theme, Long> {

	List<Theme> findBySubscribedUsersUsername(String username);

}
