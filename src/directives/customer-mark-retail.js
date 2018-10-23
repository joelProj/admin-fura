module.exports = ['$http', '$q', 'notification', '$state', function($http, $q, notification, $state) {
	return {
		restrict: 'E',
		scope: { customer: '&' },
		link: function (scope) {
			scope.markRetail = function () {
				$http.put('/api/customers/set/retail', { customers: [scope.customer().values._id]})
				.then(function(response) {
					if(response.data && !response.data.error) {
						notification.log('Customers marked as retail');
						$state.reload();
					}
					else notification.log(response.data.error || "Unable to complete the action");
				})
				.catch(function(){
					notification.log("Could not connect to the server");
				});
			};
		},
		template: '<a class="btn btn-success" ng-click="markRetail()"><span class="glyphicon glyphicon-send"></span> <span class="hidden-xs">Mark as retail</span></a>'
	};
}];
