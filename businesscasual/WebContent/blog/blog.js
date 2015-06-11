'use strict';
define([
	'angular',
	'angularRoute',
	'ui-bootstrap'
], function(angular) {
	var blog = angular.module('myApp.blog', ['ngRoute', 'ui.bootstrap']);
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
	// controller of data table
	blog.controller('modifyCtrl', ['$scope', '$http', function ($scope, $http) {
		$scope.datePicker = {opened:false};
		var page = 0;
		var postsByPage = 10;
		// load page
    	var loadPosts = function() {
    		$http.defaults.useXDomain = true;
			$http.get(window.globalConfig.serviceURL+'/blognews/?size='+postsByPage+'&sort=postDate,desc&page='+page).
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
	    // open datepicker
	    $scope.open = function($event) {
	        $event.preventDefault();
	        $event.stopPropagation();
	        //$timeout( function(){
	            $scope.datePicker.opened = true;
	         //}, 50);
	        //$scope.opened = true;
	    };


	}]);

	// new controller
	// controller of data table
	blog.controller('newCtrl', ['$scope', '$http', function ($scope, $http) {
		$scope.showNew = false;
		$scope.datePicker = {opened:false};
		// open new edit
	    $scope.openNew = function() {
	    	$scope.showNew = true;
	    	console.log('open new'+$scope.showNew);
	    };
	    $scope.post = {};
	    $scope.sdate = new Date();
	    $scope.stime = new Date();
	    // open datepicker
	    $scope.open = function($event) {
	        $event.preventDefault();
	        $event.stopPropagation();
	        $scope.datePicker.opened = true;
	    };

	    $scope.save = function() {
	    	// TODO tryCombineDateTime();
	    	$http.defaults.useXDomain = true;
			$http({
					url: window.globalConfig.serviceURL+'/blognews/',
					method: "POST",
			        data: JSON.stringify($scope.post),
			        headers: {'Content-Type': 'application/json'}
			}).
			success(function(data, status, headers, config) {
				 $scope.post = {};
		   }).
			error(function(data, status, headers, config) {
			  // log error
			  console.log("Error "+data);
			});
	    	console.log($scope.post);
	    };
	    // merge date and time together
	    $scope.title = "$Watch sample";

	    $scope.$watch('sdate', function() {
	       tryCombineDateTime();
	    });

	    $scope.$watch('stime', function() {
	       tryCombineDateTime();
	    });

	    function tryCombineDateTime() {
	        if($scope.sdate && $scope.stime) {
	            var dateParts = $scope.sdate.toString().split('-');
	            var timeParts = $scope.stime.toString().split(':');
	            console.log(dateParts);
	            console.log(timeParts);
	            if(dateParts && timeParts) {
	                dateParts[1] -= 1;
	               // $scope.post.postDate = new Date(Date.UTC.apply(undefined,dateParts.concat(timeParts))).toISOString();
	            }
	        }
	    }
	}]);

});

