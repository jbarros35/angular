var app = angular.module('statelessApp', []).factory('TokenStorage', function() {
	var storageKey = 'auth_token';
	return {
		store : function(token) {
			return localStorage.setItem(storageKey, token);
		},
		retrieve : function() {
			return localStorage.getItem(storageKey);
		},
		clear : function() {
			return localStorage.removeItem(storageKey);
		}
	};
}).factory('TokenAuthInterceptor', function($q, TokenStorage) {
	return {
		request: function(config) {
			var authToken = TokenStorage.retrieve();
			if (authToken) {
				config.headers['X-AUTH-TOKEN'] = authToken;
			}
			return config;
		},
		responseError: function(error) {
			if (error.status === 401 || error.status === 403) {
				TokenStorage.clear();
			}
			return $q.reject(error);
		}
	};
}).config(function($httpProvider) {
	$httpProvider.interceptors.push('TokenAuthInterceptor');
});

app.controller('AuthCtrl', function ($scope, $http, TokenStorage) {
	$scope.authenticated = false;
	$scope.token; // For display purposes only

	$scope.init = function () {
		$http.get('http://localhost:8080/businessdata/api/users/current').success(function (user) {
			if(user.username !== 'anonymousUser'){
				$scope.authenticated = true;
				$scope.username = user.username;
				if (TokenStorage.retrieve()) {
					// For display purposes only
					$scope.token = JSON.parse(atob(TokenStorage.retrieve().split('.')[0]));
				} else {
					$scope.authenticated = false;
				}
			}
		});
	};

	$scope.login = function () {
		$http.post('http://localhost:8080/businessdata/api/login', { username: $scope.username, password: $scope.password })
		.success(function (result, status, headers) {
			$scope.authenticated = true;
			TokenStorage.store(headers('X-AUTH-TOKEN'));
			if (TokenStorage.retrieve()) {
				// For display purposes only
				$scope.token = JSON.parse(atob(TokenStorage.retrieve().split('.')[0]));
			} else {
				$scope.authenticated = false;
			}
		})
		.error(function(result,status,headers){
			$scope.showerror = true;
			$scope.msg = result;
		});
	};

	$scope.logout = function () {

		//login?logout
		$http.get('http://localhost:8080/businessdata/api/users/logout', {})
		.success(function (result, status, headers) {
			// Just clear the local storage
			TokenStorage.clear();
			$scope.authenticated = false;
			console.log('log out success');
		})
		.error(function(result,status,headers){
			$scope.showerror = true;
			$scope.msg = result;
		});
	};
	/*
	 *  $http.post('logout', {}).success(function() {
    $rootScope.authenticated = false;
    $location.path("/");
  }).error(function(data) {
    $rootScope.authenticated = false;
  });
	 */
});