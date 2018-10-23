module.exports = function (nga, admin) {
  return nga.dashboard()
		.template(
			'<div class="container-fluid">' +
				'<div class="row">' +
					'<div class="col-md-12 text-center">' +
						'<h2>Tvrbo Admin</h2>' +
						'<p class="text-muted">Welcome to the Tvrbo Admin starter app. <br/>Refer to the sections on the left to manage your data.</p>' +
					'</div>' +
				'</div>' +
			'</div>'
		);
};
