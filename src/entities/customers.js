var removeDiacritics = require('../../lib/util.js').removeDiacritics;

module.exports = function (nga, admin) {

		var customers = admin.getEntity('customers');

		customers.identifier(nga.field('_id'));

		customers.listView()
		.title('Customers')
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
			'<customers-mark-retail selection="selection"></customers-mark-retail>',
			'<customers-mark-wholesale selection="selection"></customers-mark-wholesale>',
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

		customers.editionView()
				.title('Customer')
				.actions([
					'<customer-mark-retail customer="entry"></customer-mark-retail>',
					'<customer-mark-wholesale customer="entry"></customer-mark-wholesale>',
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
						// 		.targetReferenceField('customer')
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

				customers.creationView()
						.title('Customer')
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



		return customers;
};
