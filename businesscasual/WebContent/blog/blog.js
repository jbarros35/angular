'use strict';
define([
	'angular',
	'angularRoute'
], function(angular) {
	angular.module('myApp.blog', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/blog', {
			templateUrl: 'blog/blog.html',
			controller: 'View1Ctrl'
		});
	}])
	.controller('View1Ctrl', [function() {
		
	}]);
});

