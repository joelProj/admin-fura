module.exports = function($stateProvider){
		$stateProvider.state('summary', {
				parent: 'main',
				url: '/summary',
				controller: controller,
				controllerAs: 'controller',
				template: template
		});
};

function controller($stateParams, notification, $http) {
	var self = this;
	// this.postId = $stateParams.id;
	// notification is the service used to display notifications on the top of the screen
	self.notification = notification;

	$http.get('/api/summary')
	.then(function(response) {
		self.summary = response.data;
	})
	.catch(function(){
		self.notification.log("Could not connect to the server");
	});
}

controller.inject = ['$stateParams', 'notification', '$http'];
// controller.prototype.sendEmail = function() {
// 	this.notification.log('Email successfully sent to ' + this.email);
// };

var template =
	'<div class="row">' +
		'<div class="col-lg-12">' +
			'<div class="page-header">' +
				'<h1>Resumen <small class="pull-right">Current year</small></h1>' +
				'<h5 class="text-muted">Current summary</h5>' +
			'</div>' +
		'</div>' +
	'</div>' +

	'<div class="row">' +

			// pending
			'<div class="col-lg-4 col-md-6">' +
					'<div class="panel panel-red">' +
							'<div class="panel-heading">' +
									'<div class="row">' +
											'<div class="col-xs-3">' +
													'<i class="fa fa-th-list fa-5x"></i>' +
											'</div>' +
											'<div class="col-xs-9 text-right">' +
													'<div class="huge ng-binding">{{controller.summary.pending}}</div>' +
													'<div>Pending</div>' +
											'</div>' +
									'</div>' +
							'</div>' +
							'<a ui-sref="list({entity:\'commands\', search:{status:\'Pending\'}})" href="#/purchases/list?search=%7B%22status%22%3A%22Pending%22%7D">' +
									'<div class="panel-footer">' +
											'<span class="pull-left">See pending</span>' +
											'<span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>' +
											'<div class="clearfix"></div>' +
									'</div>' +
							'</a>' +
					'</div>' +
			'</div>' +

			// processing
			'<div class="col-lg-4 col-md-6">' +
					'<div class="panel panel-yellow">' +
							'<div class="panel-heading">' +
									'<div class="row">' +
											'<div class="col-xs-3">' +
													'<i class="fa fa-th-list fa-5x"></i>' +
											'</div>' +
											'<div class="col-xs-9 text-right">' +
													'<div class="huge ng-binding">{{controller.summary.processing || 0}}</div>' +
													'<div>Processing</div>' +
											'</div>' +
									'</div>' +
							'</div>' +
							'<a ui-sref="list({entity:\'commands\', search:{status:\'Processing\'}})" href="#/purchases/list?search=%7B%22status%22%3A%22Processing%22%7D">' +
									'<div class="panel-footer">' +
											'<span class="pull-left">See processing</span>' +
											'<span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>' +
											'<div class="clearfix"></div>' +
									'</div>' +
							'</a>' +
					'</div>' +
			'</div>' +

			// sales
			'<div class="col-lg-4 col-md-6">' +
					'<div class="panel panel-primary">' +
							'<div class="panel-heading">' +
									'<div class="row">' +
											'<div class="col-xs-3">' +
													'<i class="fa fa-usd fa-5x"></i>' +
											'</div>' +
											'<div class="col-xs-9 text-right">' +
													'<div class="huge ng-binding">{{controller.summary.revenue | number:2}} €</div>' +
													'<div>Revenue</div>' +
											'</div>' +
									'</div>' +
							'</div>' +
							'<a ui-sref="list({entity:\'invoices\'})" href="#/invoices/list">' +
									'<div class="panel-footer">' +
											'<span class="pull-left">See purchases</span>' +
											'<span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>' +
											'<div class="clearfix"></div>' +
									'</div>' +
							'</a>' +
					'</div>' +
			'</div>' +

			// new customers
			'<div class="col-lg-4 col-md-6">' +
					'<div class="panel panel-green">' +
							'<div class="panel-heading">' +
									'<div class="row">' +
											'<div class="col-xs-3">' +
													'<i class="fa fa-users fa-5x"></i>' +
											'</div>' +
											'<div class="col-xs-9 text-right">' +
													'<div class="huge ng-binding">{{controller.summary.customers}}</div>' +
													'<div>New customers</div>' +
											'</div>' +
									'</div>' +
							'</div>' +
							'<a ui-sref="list({entity:\'customers\'})" href="#/customers/list">' +
									'<div class="panel-footer">' +
											'<span class="pull-left">See customers</span>' +
											'<span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>' +
											'<div class="clearfix"></div>' +
									'</div>' +
							'</a>' +
					'</div>' +
			'</div>' +
	'</div>';
