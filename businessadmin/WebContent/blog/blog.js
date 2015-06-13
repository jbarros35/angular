'use strict';
define([
	'angular',
	'angularRoute',
	'blog/services'
], function(angular) {

	var blog = angular.module('myApp.blog', ['ngRoute', 'myApp.blog.services', 'angular-flash.service', 'angular-flash.flash-alert-directive']);

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
	blog.directive("editBlog", ['$parse', '$http', '$compile', '$templateCache', 'flash', function($parse, $http, $compile, $templateCache, flash) {

		  return {
		    restrict: "A",
		    replace: true,
		    scope: false,
		    transclude: true,
		    templateUrl: "blog/editBlog.html",
		    link: function($scope, element, attrs) {
	            $scope.hideEdit = function(hide) {
	                $scope.hideTable = hide;
	            };
	            $scope.reload = function() {
	            	$scope.loadPosts();
	            };
	        },
		    controller: ['$scope', '$http', '$filter', 'blogService', 'flash', function ($scope, $http, $filter, blogService, flash) {
		    	var page = 0;
				var postsByPage = 10;
				$scope.nodataFound = "No records found.";
				$scope.hideTable = false;
				// load page
				$scope.loadPosts = function() {
					blogService.posts(postsByPage, 'postDate', page).
					success(function(data, status, headers, config) {
						if (data._embedded) {
							// update blog posts
							$scope.tabelsData = data._embedded.blognews;
							initTable();
							flash.success = 'Posts loaded';
						} else {
							// clean blog posts var
							$scope.tabelsData = [];
							flash.info = 'No posts found.';
						}

				   }).
					error(function(data, status, headers, config) {
					  // log error
					  flash.error = 'Fail to load!'+data;
					  console.log("Error "+data);
					});
		    	};

		    	$scope.loadPosts();
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
			        
			        blogService.update(tableData)
					.success(function(data, status, headers, config) {
						flash.success = 'Record updated.';						
					}).
					error(function(data, status, headers, config) {
						 flash.error = 'Fail to update!'+data;
					  // log error
					  console.log("Error "+data);
					});
			        console.log(tableData);
			    };
			    // delete record
			    $scope.deletePost = function(index) {
			    	var tableData = $scope.tabelsData[index];
			    	blogService.deletePost(tableData.newId).success(function(data, status, headers, config) {
			    		$scope.tabelsData.splice(index, 1);
			    		 flash.success = 'Post deleted.';
			    	}).
					error(function(data, status, headers, config) {
						 flash.error = 'Fail to load!'+data;
						  // log error
						  console.log("Error "+data);
					});
			    };
			}]
		    };
		  }]);

	// creation directive
	// new controller
	// controller of data table
	blog.directive("newPost", ['$parse', '$http', '$compile', '$templateCache', 'blogService', 'flash', function($parse, $http, $compile, $templateCache, blogService, flash) {
		 return {
			    restrict: "A",
			    replace: true,
			    scope: false,
			    transclude: true,
			    templateUrl: "blog/newPost.html",
			    controller: ['$scope', '$http', 'flash', function ($scope, $http, flash) {
			    	$scope.showNew = false;
					$scope.post = {};
				    $scope.showAlert = false;

					// open new edit
				    $scope.openNew = function() {
				    	$scope.showNew = true;
				    	$scope.hideEdit(true);
				    };

				    // send json post for creation
				    $scope.save = function() {
				    	tryCombineDateTime();				    	
				    	blogService.create($scope.post).
						success(function(data, status, headers, config) {
							 $scope.post = {};
							 $scope.sdate = null;
							 $scope.stime = null;
							 $scope.showAlert = true;
							 $scope.showNew = false;
							 $scope.successTextAlert = "Post saved";
							 $scope.reload();
							 $scope.hideEdit(false);
							 flash.sucess = 'Post saved.';
					   }).
						error(function(data, status, headers, config) {
							flash.error = 'Failed to save post!'+data;
						  // log error
						  console.log("Error "+data);
						});
				    };
				    //TODO DOESNT WORKS!
				    $scope.reset = function(form){
				    	event.preventDefault();
			            if(form.$setPristine){//only supported from v1.1.x
			                form.$setPristine();
			                console.log('setpristine');
			            }else{

			                /*
			                 *Underscore looping form properties, you can use for loop too like:
			                 *for(var i in form){
			                 *  var input = form[i]; ...
			                 */
			                _.each(form, function (input)
			                {
			                    if (input.$dirty) {
			                        input.$dirty = false;
			                    }
			                });
			            }
			        };

				    // switch flag
				    $scope.switchBool = function (value) {
				        $scope[value] = !$scope[value];
				    };

				    // merge date and time together
				    $scope.$watch('sdate', function() {
				       tryCombineDateTime();
				    });

				    $scope.$watch('stime', function() {
				       tryCombineDateTime();
				    });
				    // combine date and time for inserting
				    function tryCombineDateTime() {

				        if($scope.sdate && $scope.stime) {
				        	var dateParts = [$scope.sdate.getFullYear(),
				        	                 $scope.sdate.getMonth() + 1,
				        	                 $scope.sdate.getDate()
				        	                 ];
				        	var timeParts = [$scope.stime.getHours(), $scope.stime.getMinutes(), $scope.stime.getSeconds()];

				            if(dateParts && timeParts) {
				                dateParts[1] -= 1;
				                $scope.post.postDate = new Date(Date.UTC.apply(undefined,dateParts.concat(timeParts))).toISOString();
				            }
				        }
				    }

			    }]
		 };
	}]);
});

