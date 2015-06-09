package be.g00glen00b.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import be.g00glen00b.model.BlogNews;

@RepositoryRestResource(collectionResourceRel = "blognews", path = "blognews")
public interface BlogNewsRepository extends PagingAndSortingRepository<BlogNews, Integer> {
}
