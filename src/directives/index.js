module.exports = function(app){

	app.directive('customersMarkWholesale', require('./customers-mark-wholesale'));
	app.directive('customersMarkRetail', require('./customers-mark-retail'));

	app.directive('customerMarkWholesale', require('./customer-mark-wholesale'));
	app.directive('customerMarkRetail', require('./customer-mark-retail'));

};
