'use strict';
define([
	'angular',
	'angularRoute'
], function(angular) {
	
	var home = angular.module('myApp.home', ['ngRoute']);
	
	var menuType = 'guest';
	
	home.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/home', {
			templateUrl: 'home/home.html',
			controller: 'homeCtrl'
		});
	}]);
	
	home.controller('homeCtrl', ['$scope', function($scope) {
		// Home controller logic	
	}]);
	
	// menu directive
	home.directive("menu", ['$parse', '$http', '$compile', '$templateCache', function($parse, $http, $compile, $templateCache) {
		
		  return {
		    restrict: "A",
		    replace: true,		    
		    scope: false,
		    transclude: true,
		    templateUrl: "home/menu.html",
		   
		    controller: ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
		    	
		    	// TODO menu controller		    	
		    	$scope.menuType = menuType;
				
			}]
		    };
		  }]);
});

