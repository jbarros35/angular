'use strict';
define([
	'angular'
],function(angular) {
	var services = angular.module('myApp.blog.services', []);

	services.factory('blogService', ['$http', function($http) {

    var loadPosts = function(postsByPage, sort, page) {
		$http.defaults.useXDomain = true;
		return $http({method: 'GET',
			transformResponse: function (data) {
				data = angular.fromJson(data);
				if (data._embedded) {
					for (var i = 0, length = data._embedded.blognews.length; i < length; i++) {
						var blogPost = data._embedded.blognews[i];
						 if (!angular.isDate(blogPost.postDate)) {
							 blogPost.postDate = new Date(blogPost.postDate);
						 }
			    	 }
				}
				return data;
			},
			url: window.globalConfig.serviceURL+'/blognews/?size='+postsByPage+'&sort='+sort+',desc&page='+page}
		);
	};

	var updatePost = function(tableData) {
		$http.defaults.useXDomain = true;
		return $http({
			url: window.globalConfig.serviceURL+'/blognews/',
			method: "POST",
	        data: JSON.stringify(tableData),
	        headers: {'Content-Type': 'application/json'}
		});		
	};
	
	var createPost = function(post) {
		$http.defaults.useXDomain = true;
		return $http({
				url: window.globalConfig.serviceURL+'/blognews/',
				method: "POST",
		        data: JSON.stringify(post),
		        headers: {'Content-Type': 'application/json'}
		});
	};
	
	var deletePost = function(id) {
		$http.defaults.useXDomain = true;
		return $http({
				url: window.globalConfig.serviceURL+'/blognews/'+id,
				method: "DELETE"		        
		});
	};
	
    return {
    	posts: function(postsByPage, sort, page) { return loadPosts(postsByPage, sort, page); },
    	update: function(tableData)  { return updatePost(tableData); },
    	create: function(post)  { return createPost(post); },
    	deletePost: function(id)  { return deletePost(id); }
    };
  }]);
});