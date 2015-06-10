'use strict';
define([
	'angular',
	'angularRoute'	
], function(angular) {
	var blog = angular.module('myApp.blog', ['ngRoute']);
	
	blog.config(['$routeProvider', function($routeProvider) {
		
		$routeProvider.when('/blog', {
			templateUrl: 'blog/blog.html',
			controller: 'blogCtrl'
		});
	}]);
	
	blog.controller('blogCtrl', ['$http', function($http) {
		//console.log('blogCtrl');
		/*var news;
		
		$http.defaults.useXDomain = true;
		$http.get('http://localhost:8080/businessdata/api/blognews/').
		success(function(data, status, headers, config) {		
			news = data._embedded.blognews;			
	   }).
		error(function(data, status, headers, config) {
		  // log error
		  console.log("Error "+data);
		});*/
	}]);
	blog.directive("posts", function() {
		  return {
		    restrict: "A",
		    replace: true,
		    templateUrl: "blog/blogposts.html",
		    controller: ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
				$http.defaults.useXDomain = true;
				$http.get('http://localhost:8080/businessdata/api/blognews/').
				success(function(data, status, headers, config) {
					$scope.blogNews = data._embedded.blognews;					
			   }).
				error(function(data, status, headers, config) {
				  // log error
				  console.log("Error "+data);
				});
			}]
		    };
		  });
});

