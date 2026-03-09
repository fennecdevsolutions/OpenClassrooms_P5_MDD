package com.oc.mdd.repositories;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.ListPagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.oc.mdd.models.User;

@Repository
public interface UserRepository extends ListCrudRepository<User, Long>, ListPagingAndSortingRepository<User, Long> {
	boolean existsByUsername(String username);

	boolean existsByEmail(String email);

}
