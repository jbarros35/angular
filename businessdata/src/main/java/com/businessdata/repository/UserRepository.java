package com.businessdata.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.businessdata.model.UserData;

@RepositoryRestResource(collectionResourceRel = "userdata", path = "userdata")
public interface UserRepository extends PagingAndSortingRepository<UserData, Long> {

	UserData findByUsername(String username);

}
