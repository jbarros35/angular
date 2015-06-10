'use strict';
define([
	'angular',
	'angularRoute'
], function(angular) {
	var blog = angular.module('myApp.blog', ['ngRoute']);
	var postsByPage = 3;
	blog.config(['$routeProvider', function($routeProvider) {

		$routeProvider.when('/blog', {
			templateUrl: 'blog/blog.html',
			controller: 'blogCtrl'
		})
		.when('/blog/:idPost', {
			templateUrl: 'blog/viewPost.html',
			controller: 'blogViewCtrl'
		});
	}]);

	blog.controller('blogCtrl', ['$scope','$http', function($scope,$http) {
		// init page
    	$scope.page = {
    		    "size" : 0,
    		    "totalElements" : 0,
    		    "totalPages" : 0,
    		    "number" : 0
    		  };

	}]);

	// view post
	blog.controller('blogViewCtrl', ['$scope','$http', '$routeParams', '$window', function($scope, $http, $routeParams, $window) {
		var idPost = $routeParams.idPost;

    	// load post from idPost
    	var loadPost = function() {
    		$http.defaults.useXDomain = true;
			$http.get(window.globalConfig.serviceURL+'/blognews/'+idPost).
			success(function(data, status, headers, config) {
				if (data) {
					// update blog posts
					$scope.post = data;
				} else {
					// clean blog posts var
					$scope.post = null;
				}

		   }).
			error(function(data, status, headers, config) {
			  // log error
			  console.log("Error "+$scope.post);
			});
    	};

    	// back on history to blog
    	$scope.back = function() {
    		$window.history.back();
    	};
    	loadPost();

	}]);

	blog.directive("posts", function() {
		  return {
		    restrict: "A",
		    replace: true,
		    scope: false,
		    transclude: true,
		    templateUrl: "blog/blogposts.html",
		    controller: ['$scope', '$http', '$filter', function ($scope, $http, $filter) {

		    	// load page
		    	var loadPosts = function() {
		    		$http.defaults.useXDomain = true;
					$http.get(window.globalConfig.serviceURL+'/blognews/?size='+postsByPage+'&sort=postDate,desc&active=true&page='+$scope.page.number).
					success(function(data, status, headers, config) {
						if (data._embedded) {
							// update blog posts
							$scope.blogNews = data._embedded.blognews;
							//update page status
							$scope.page = data.page;
						} else {
							// clean blog posts var
							$scope.blogNews = [];
						}

				   }).
					error(function(data, status, headers, config) {
					  // log error
					  console.log("Error "+data);
					});
		    	};

				//paging control, increment page number
				$scope.next = function() {
					$scope.page.number++;
					loadPosts();
				};
				// get back from posts
				$scope.previous = function() {
					$scope.page.number--;
					loadPosts();
				};
				// check if there are more pages for button newer
				$scope.hasMore = function() {
					// pagenumber starts with 0
					var number = $scope.page.number + 1;
					var totalPages = $scope.page.totalPages;
					return number < totalPages;
				};
				loadPosts();
			}]
		    };
		  });
});

