'use strict';

define([
	'angular',
	'angularRoute',
	//'angularResource',
	'home/home',
	'about/about',
	'blog/blog',
	'contact/contact'
], function(angular, angularRoute, view1, view2) {
	// Declare app level module which depends on views, and components
	return angular.module('myApp', [
		'ngRoute',
		//'ngResource',
		'myApp.home',
		'myApp.about',
		'myApp.blog',
		'myApp.contact'
	]).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.otherwise({redirectTo: '/home'});
	}]);
});


