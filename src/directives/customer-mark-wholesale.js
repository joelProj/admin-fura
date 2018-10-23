module.exports = ['$http', '$q', 'notification', '$state', function($http, $q, notification, $state) {
	return {
		restrict: 'E',
		scope: { customer: '&' },
		link: function (scope) {
			scope.markWholesale = function () {
				$http.put('/api/customers/set/wholesale', { customers: [scope.customer().values._id]})
				.then(function(response) {
					if(response.data && !response.data.error) {
						notification.log('Customers marked as wholesale');
						$state.reload();
					}
					else notification.log(response.data.error || "Unable to complete the action");
				})
				.catch(function(){
					notification.log("Could not connect to the server");
				});
			};
		},
		template: '<a class="btn btn-primary" ng-click="markWholesale()"><span class="glyphicon glyphicon-fire"></span> <span class="hidden-xs">Mark as wholesale</span></a>'
	};
}];
