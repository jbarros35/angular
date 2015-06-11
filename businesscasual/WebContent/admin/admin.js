'use strict';
define([
	'angular',
	'angularRoute', 
	'admin/blog/adminBlog',
	'home/home',
	'utility/util'
], function(angular) {
	
	var admin = angular.module('myApp.admin', ['ngRoute', 'myApp.adminBlog', 'myApp.home', 'myApp.util']);
	
	admin.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/admin', {
			templateUrl: 'admin/admin.html',
			controller: 'adminHomeCtrl'
		});
	}]);
	
	admin.controller('adminHomeCtrl', ['$scope', '$location', function($scope, $location) {
		// Home controller logic
		
		// change to admin flag		
		$scope.menuType = 'admin';
		
	}]);
	
});

