var removeDiacritics = require('../../lib/util.js').removeDiacritics;

module.exports = function (nga, admin) {

		var questions = admin.getEntity('questions');

		questions.identifier(nga.field('_id'));

		questions.listView()
		.title('Questions')
		.fields([
				nga.field('name')
					.map(function(v){ return v || '(No name)'})
					.isDetailLink(true),
				nga.field('lastName')
					.label('Last Name')
					.isDetailLink(true),
				nga.field('type', 'choice')
						.choices([
								{label: 'Retail', value: 'Retail'},
								{label: 'Wholesale', value: 'Wholesale'}
						])
						.cssClasses(function(entry) { // add custom CSS classes to inputs and columns
								if(!entry || !entry.values) return '';
								else if(!entry.values.type) return 'bg-danger';
								else if (entry.values.type == 'Retail') return 'bg-success';
								else return 'bg-info';
						}),
				nga.field('registered', 'date').label('Registered').format('dd/MM/yyyy')
		])
		.sortField('lastName')
		.sortDir('ASC')
		.listActions(['edit'])
		.batchActions([
			'<questions-mark-retail selection="selection"></questions-mark-retail>',
			'<questions-mark-wholesale selection="selection"></questions-mark-wholesale>',
			'delete'
		])
		.filters([
			nga.field('type', 'choice')
					.choices([
							{label: 'Retail', value: 'Retail'},
							{label: 'Wholesale', value: 'Wholesale'}
					])
		])
		.exportOptions({
			quotes: true,
			delimiter: ';'
		})
		.exportFields([
			nga.field('name').map(removeDiacritics),
			nga.field('lastName').label('Last Name').map(removeDiacritics),
			nga.field('type', 'choice').map(function(value){
				switch(value){
					case 'Retail': return 'Retail';
					case 'Wholesale': return 'Wholesale';
				}
				return value;
			}),
			nga.field('email'),
			nga.field('phone'),
			nga.field('delivery.address').map(removeDiacritics),
			nga.field('delivery.city').map(removeDiacritics),
			nga.field('delivery.zip'),
			// nga.field('delivery.region', 'reference')
			// 	.targetEntity(admin.getEntity('regions'))
			// 	.targetField(nga.field('name').map(removeDiacritics)),
			// nga.field('delivery.country', 'reference')
			// 	.targetEntity(admin.getEntity('countries'))
			// 	.targetField(nga.field('name').map(removeDiacritics)),
			nga.field('billing.nif'),
			nga.field('billing.name').map(removeDiacritics),
			nga.field('billing.address').map(removeDiacritics),
			nga.field('billing.city').map(removeDiacritics),
			nga.field('billing.zip'),
			// nga.field('billing.country', 'reference')
			// 	.label('Pais (facturacion)')
			// 	.targetEntity(admin.getEntity('countries'))
			// 	.targetField(nga.field('name').map(removeDiacritics)),
			nga.field('registered', 'date').format('dd/MM/yyyy')
		]);

		questions.editionView()
				.title('Question')
				.actions([
					'<question-mark-retail question="entry"></question-mark-retail>',
					'<question-mark-wholesale question="entry"></question-mark-wholesale>',
					'list'
				])
				.fields([
						nga.field('name'),
						nga.field('lastName').label('Last Name'),
						nga.field('type', 'choice')
							.choices([
								{label: 'Retail', value: 'Retail'},
								{label: 'Wholesale', value: 'Wholesale'}
							]),
						nga.field('email'),
						nga.field('phone'),
						nga.field('delivery.address'),
						nga.field('delivery.city'),
						nga.field('delivery.zip'),
						nga.field('billing.nif'),
						nga.field('billing.name'),
						nga.field('billing.address'),
						nga.field('billing.city'),
						nga.field('billing.zip'),
						nga.field('registered', 'date')
							.format('dd/MM/yyyy')
							.editable(false),

						// nga.field('purchases', 'referenced_list')
						// 		.label('Ventas')
						// 		.targetEntity(admin.getEntity('purchases'))
						// 		.targetReferenceField('question')
						// 		.targetFields([
						// 			nga.field('reference').label('Localizador').isDetailLink(true),
						// 			nga.field('date', 'date').label('Fecha').isDetailLink(true).format('dd/MM/yyyy'),
						// 			nga.field('status', 'choice').label('Estado')
						// 				.choices([
						// 					{label: 'Pago pendiente', value: 'Pending'},
						// 					{label: 'Pagada', value: 'Paid'},
						// 					{label: 'Remesa', value: 'Remitted'}
						// 				])
						// 				.cssClasses(function(entry) {
						// 						if(!entry) return '';
						// 						else if (entry.values.status == 'Pending') return 'bg-warning';
						// 						else if (entry.values.status == 'Remitted') return 'bg-info';
						// 						else if (entry.values.status == 'Paid') return 'bg-success';
						// 						else return 'bg-danger';
						// 				})
						// 		])
						// 		.perPage(10)
						// 		.sortField('date')
						// 		.sortDir('DESC')
				]);

				questions.creationView()
						.title('Question')
						.fields([
								nga.field('name'),
								nga.field('lastName').label('Last Name'),
								nga.field('type', 'choice')
									.choices([
										{label: 'Retail', value: 'Retail'},
										{label: 'Wholesale', value: 'Wholesale'}
									]),
								nga.field('email'),
								nga.field('phone'),
								nga.field('delivery.address'),
								nga.field('delivery.city'),
								nga.field('delivery.zip'),
								nga.field('billing.nif'),
								nga.field('billing.name'),
								nga.field('billing.address'),
								nga.field('billing.city'),
								nga.field('billing.zip')
						]);



		return questions;
};
