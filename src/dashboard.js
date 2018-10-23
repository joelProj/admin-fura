module.exports = function (nga, admin) {
  return nga.dashboard()
		.template(
			'<div class="container-fluid">' +
				'<div class="row">' +
					'<div class="col-md-12 text-center">' +
						'<h2>Admin Fura</h2>' +
						'<p class="text-muted">Questionnaire database admin<br/>La Fura dels Baus</p>' +
					'</div>' +
				'</div>' +
			'</div>'
		);
};
