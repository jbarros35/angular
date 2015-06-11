'use strict';
define([
	'angular',
	'angularRoute'
], function(angular) {
	
	var admin = angular.module('myApp.adminBlog', ['ngRoute']);
	
	admin.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/admin/blog', {
			templateUrl: 'admin/blog/adminBlog.html',
			controller: 'adminBlogCtrl'
		});
	}]);
	
	admin.controller('adminBlogCtrl', ['$scope', '$location', function($scope, $location) {
		// Home controller logic
		
	}]);
	
});

