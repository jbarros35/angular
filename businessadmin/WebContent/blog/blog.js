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

	blog.controller('blogCtrl', ['$scope', function($scope) {
		// Home controller logic
	}]);

	// menu directive
	blog.directive("editBlog", ['$parse', '$http', '$compile', '$templateCache', function($parse, $http, $compile, $templateCache) {

		  return {
		    restrict: "A",
		    replace: true,
		    scope: false,
		    transclude: true,
		    templateUrl: "blog/editBlog.html",

		    controller: ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
		    	var page = 0;
				var postsByPage = 10;
				// load page
		    	var loadPosts = function() {
		    		$http.defaults.useXDomain = true;
		    		$http({method: 'GET',
						transformResponse: function (data) {
							data = angular.fromJson(data);
							for (var i = 0, length = data._embedded.blognews.length; i < length; i++) {
								var blogPost = data._embedded.blognews[i];
								 if (!angular.isDate(blogPost.postDate)) {
									 blogPost.postDate = new Date(blogPost.postDate);
									 console.log(blogPost.postDate);
								 }
					    	 }
							return data;
						},
						url: window.globalConfig.serviceURL+'/blognews/?size='+postsByPage+'&sort=postDate,desc&page='+page}
					).
					success(function(data, status, headers, config) {
						if (data._embedded) {
							// update blog posts
							$scope.tabelsData = data._embedded.blognews;
							initTable();

						} else {
							// clean blog posts var
							$scope.tabelsData = [];
						}

				   }).
					error(function(data, status, headers, config) {
					  // log error
					  console.log("Error "+data);
					});
		    	};

		    	loadPosts();
		    	// start editable table
		    	var initTable = function() {
		    		$scope.editingData = [];

		    	    for (var i = 0, length = $scope.tabelsData.length; i < length; i++) {
		    	      $scope.editingData[$scope.tabelsData[i].id] = false;
		    	    }
		    	};
		    	// open for editing
			    $scope.modify = function(tableData){
			        $scope.editingData[tableData.newId] = true;
			    };
			    // update record
			    $scope.update = function(tableData){
			        $scope.editingData[tableData.newId] = false;
			        $http.defaults.useXDomain = true;
					$http({
							url: window.globalConfig.serviceURL+'/blognews/',
							method: "POST",
					        data: JSON.stringify(tableData),
					        headers: {'Content-Type': 'application/json'}
					}).
					success(function(data, status, headers, config) {

				   }).
					error(function(data, status, headers, config) {
					  // log error
					  console.log("Error "+data);
					});
			        console.log(tableData);
			    };
			}]
		    };
		  }]);
});

