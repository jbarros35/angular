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
	
	// controller of data table
	admin.controller('adminBlogCtrl', ['$scope', '$http', function ($scope, $http) {
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
	            $scope.datePicker.opened = true;	        
	    };


	}]);

	// new controller
	// controller of data table
	admin.controller('newCtrl', ['$scope', '$http', function ($scope, $http) {
		$scope.showNew = false;
		$scope.post = {};
	    $scope.showAlert = false;

		// open new edit
	    $scope.openNew = function() {
	    	$scope.showNew = true;
	    };
	    
	    // send json post for creation
	    $scope.save = function() {
	    	tryCombineDateTime();
	    	$http.defaults.useXDomain = true;
			$http({
					url: window.globalConfig.serviceURL+'/blognews/',
					method: "POST",
			        data: JSON.stringify($scope.post),
			        headers: {'Content-Type': 'application/json'}
			}).
			success(function(data, status, headers, config) {
				 $scope.post = {};
				 $scope.sdate = null;
				 $scope.stime = null;
				 $scope.showAlert = true;
				 $scope.showNew = false;				 
				 $scope.successTextAlert = "Post saved";
		   }).
			error(function(data, status, headers, config) {
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
	}]);
	
});

