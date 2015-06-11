'use strict';

define([
	'angular',
	'angularRoute',
	'home/home',
	'about/about',
	'blog/blog',
	'contact/contact',
	'admin/admin',
	'utility/util'
], function(angular, angularRoute) {
	// Declare app level module which depends on views, and components
	return angular.module('myApp', [
		'ngRoute',
		'myApp.home',
		'myApp.about',
		'myApp.blog',
		'myApp.contact',
		'myApp.admin',
		'myApp.util'
	]).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.otherwise({redirectTo: '/home'});
	}]);
});


