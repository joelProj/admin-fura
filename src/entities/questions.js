module.exports = function (nga, admin) {

		var questions = admin.getEntity('questions');

		questions.identifier(nga.field('_id'));

		questions.listView()
		.title('Questions')
		.fields([
			nga.field('questionnaire').label('Questionnaire').isDetailLink(true),
			nga.field('id_fura').label("ID").isDetailLink(true),
			nga.field('group').label('Group').isDetailLink(true),
			nga.field('text').label('Question'),
			nga.field('date', 'date').label('Created').format('dd/MM/yyyy')
		])
		.sortField('id_fura')
		.sortDir('ASC')
		.listActions(['show'])
		.filters([
			nga.field('questionnaire'),
			nga.field('group')
		]);

		questions.showView()
		.title('Question')
		.fields([
			nga.field('questionnaire').label('Questionnaire'),
			nga.field('id_fura').label("ID"),
			nga.field('group').label('Group'),
			nga.field('text').label('Question'),
			nga.field('options', 'embedded_list').label('Options'),
			nga.field('date', 'date').label('Created').format('dd/MM/yyyy')
		])
		.actions(['edit']);

		questions.editionView()
		.title('Question')
		.fields([
			nga.field('questionnaire').label('Questionnaire'),
			nga.field('id_fura').label("ID"),
			nga.field('group').label('Group'),
			nga.field('text').label('Question'),
			nga.field('options', 'template')
			.template([
			  '<div style="margin-bottom: 15px;" ng-repeat="item in value track by $index">',
			  '<input type="text" ng-model="value[$index]" class="form-control"></input>',
			  '</div>',
			  '<a ng-click="value.push(\'\')"><i class="fa fa-plus"></i> Add one more</a>'
			].join('')).label('Options')
		]);

		questions.creationView()
		.title('Question')
		.fields([
			nga.field('questionnaire').label('Questionnaire'),
			nga.field('id_fura').label("ID"),
			nga.field('group').label('Group'),
			nga.field('text').label('Question'),
			nga.field('options', 'template')
			.template([
			  '<div style="margin-bottom: 15px;" ng-repeat="item in value track by $index">',
			  '<input type="text" ng-model="value[$index]" class="form-control"></input>',
			  '</div>',
			  '<a ng-click="value.push(\'\')"><i class="fa fa-plus"></i> Add one more</a>'
			].join('')).label('Options')
		]);

		// questions.editionView()
		// 		.title('Question')
		// 		.actions([
		// 			'<question-mark-retail question="entry"></question-mark-retail>',
		// 			'<question-mark-wholesale question="entry"></question-mark-wholesale>',
		// 			'list'
		// 		])
		// 		.fields([
		// 				nga.field('name'),
		// 				nga.field('lastName').label('Last Name'),
		// 				nga.field('type', 'choice')
		// 					.choices([
		// 						{label: 'Retail', value: 'Retail'},
		// 						{label: 'Wholesale', value: 'Wholesale'}
		// 					]),
		// 				nga.field('email'),
		// 				nga.field('phone'),
		// 				nga.field('delivery.address'),
		// 				nga.field('delivery.city'),
		// 				nga.field('delivery.zip'),
		// 				nga.field('billing.nif'),
		// 				nga.field('billing.name'),
		// 				nga.field('billing.address'),
		// 				nga.field('billing.city'),
		// 				nga.field('billing.zip'),
		// 				nga.field('registered', 'date')
		// 					.format('dd/MM/yyyy')
		// 					.editable(false),

		// 				// nga.field('purchases', 'referenced_list')
		// 				// 		.label('Ventas')
		// 				// 		.targetEntity(admin.getEntity('purchases'))
		// 				// 		.targetReferenceField('question')
		// 				// 		.targetFields([
		// 				// 			nga.field('reference').label('Localizador').isDetailLink(true),
		// 				// 			nga.field('date', 'date').label('Fecha').isDetailLink(true).format('dd/MM/yyyy'),
		// 				// 			nga.field('status', 'choice').label('Estado')
		// 				// 				.choices([
		// 				// 					{label: 'Pago pendiente', value: 'Pending'},
		// 				// 					{label: 'Pagada', value: 'Paid'},
		// 				// 					{label: 'Remesa', value: 'Remitted'}
		// 				// 				])
		// 				// 				.cssClasses(function(entry) {
		// 				// 						if(!entry) return '';
		// 				// 						else if (entry.values.status == 'Pending') return 'bg-warning';
		// 				// 						else if (entry.values.status == 'Remitted') return 'bg-info';
		// 				// 						else if (entry.values.status == 'Paid') return 'bg-success';
		// 				// 						else return 'bg-danger';
		// 				// 				})
		// 				// 		])
		// 				// 		.perPage(10)
		// 				// 		.sortField('date')
		// 				// 		.sortDir('DESC')
		// 		]);

		// 		questions.creationView()
		// 				.title('Question')
		// 				.fields([
		// 						nga.field('name'),
		// 						nga.field('lastName').label('Last Name'),
		// 						nga.field('type', 'choice')
		// 							.choices([
		// 								{label: 'Retail', value: 'Retail'},
		// 								{label: 'Wholesale', value: 'Wholesale'}
		// 							]),
		// 						nga.field('email'),
		// 						nga.field('phone'),
		// 						nga.field('delivery.address'),
		// 						nga.field('delivery.city'),
		// 						nga.field('delivery.zip'),
		// 						nga.field('billing.nif'),
		// 						nga.field('billing.name'),
		// 						nga.field('billing.address'),
		// 						nga.field('billing.city'),
		// 						nga.field('billing.zip')
		// 				]);



		return questions;
};
