package com.businessdata.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.businessdata.model.BlogNews;

@RepositoryRestResource(collectionResourceRel = "blognews", path = "blognews")
public interface BlogNewsRepository extends PagingAndSortingRepository<BlogNews, Integer> {
}
