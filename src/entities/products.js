var removeDiacritics = require('../../lib/util.js').removeDiacritics;

module.exports = function (nga, admin) {

		var products = admin.getEntity('products');

		products.identifier(nga.field('_id'));

		products.listView()
		.title('Products')
		.fields([
				nga.field('name').isDetailLink(true)
					.cssClasses(function(entry) { // add custom CSS classes to inputs and columns
						if(!entry) return '';
						else if (!entry.values.active) return 'bg-danger';
						else return '';
					}),
				nga.field('type', 'choice')
					.choices([
						{label: 'Coffee', value: 'Coffee'},
						{label: 'Course', value: 'Course'},
						// {label: 'Pack', value: 'Pack'},
						{label: 'Merchandising', value: 'Merchandising'},
						{label: 'Equipment', value: 'Equipment'}
					])
					.cssClasses(function(entry) { // add custom CSS classes to inputs and columns
							if(!entry) return '';
							else if (!entry.values.active) return 'bg-danger';
							else return '';
					}),
				// nga.field('price', 'float').format('0.00').isDetailLink(true),
				nga.field('price')
					.template('{{value | number:2}}')
					.cssClasses(function(entry) { // add custom CSS classes to inputs and columns
							if(!entry) return '';
							else if (!entry.values.active) return 'bg-danger';
							else return '';
					})
					.isDetailLink(true)
		])
		.sortField('name')
		.sortDir('ASC')
		.exportOptions({
			quotes: true,
			delimiter: ';'
		})
		.exportFields([
			nga.field('name')
				.map(removeDiacritics),
			nga.field('type'),
			nga.field('price')
				.map(function(value){ return (value||0).toFixed(2); })
		])
		.listActions(['edit'])
		.filters([
				nga.field('type', 'choice').label('Tipo de producto').pinned(true)
					.choices([
						{label: 'Coffee', value: 'Coffee'},
						{label: 'Course', value: 'Course'},
						// {label: 'Pack', value: 'Pack'},
						{label: 'Merchandising', value: 'Merchandising'},
						{label: 'Equipment', value: 'Equipment'}
					])
		]);

		// EDIT

		products.editionView()
				.title('Product')
				.actions(['<product-duplicate post="entry"></product-duplicate>', 'list', 'delete'])
				.onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function(progression, notification, $state, entry, entity) {
						// stop the progress bar
						progression.done();
						// add a notification
						// notification.log(`Element #${entry._identifierValue} successfully edited.`, { addnCls: 'humane-flatty-success' });
						// redirect to the list view
						// $state.go($state.get('list'), { entity: entity.name() });
						// cancel the default action (redirect to the edition view)
						location.reload();
						return false;
				}])
				.fields([
					nga.field('active', 'choice')
						.choices([
							{label: 'Inactive', value: false},
							{label: 'Active', value: true}
						]),
					nga.field('type', 'choice')
						.validation({required: true})
						.choices([
							{label: 'Coffee', value: 'Coffee'},
							{label: 'Course', value: 'Course'},
							// {label: 'Pack', value: 'Pack'},
							{label: 'Merchandising', value: 'Merchandising'},
							{label: 'Equipment', value: 'Equipment'}
						]),
					nga.field('name').validation({required: true}),
					nga.field('description'),

					nga.field('images', 'embedded_list')
						.targetFields([
								nga.field('url').label('URL').validation({required: true}),
								nga.field('description')
						]),
					// nga.field('upload', 'file')
					//   .uploadInformation({ 'url': '/api/products/' + location.hash.substr(16) + '/image', 'apifilename': 'file' }),

					nga.field('price', 'float'),
					nga.field('vat', 'number').label('VAT (%)'),
					nga.field('weight', 'float').attributes({placeholder: '(grams)'})
				]);




		products.creationView()
				.title('New product')
				.fields([
					nga.field('active', 'choice')
						.choices([
							{label: 'Inactive', value: false},
							{label: 'Active', value: true}
						])
						.defaultValue(true),
					nga.field('type', 'choice')
						.validation({required: true})
						.choices([
							{label: 'Coffee', value: 'Coffee'},
							{label: 'Course', value: 'Course'},
							// {label: 'Pack', value: 'Pack'},
							{label: 'Merchandising', value: 'Merchandising'},
							{label: 'Equipment', value: 'Equipment'}
						]),
					nga.field('name').validation({required: true}),
					nga.field('description'),

					nga.field('images', 'embedded_list')
						.targetFields([
								nga.field('url').label('URL').validation({required: true}),
								nga.field('description')
						]),
					// nga.field('upload', 'file')
					//   .uploadInformation({ 'url': '/api/products/' + location.hash.substr(16) + '/image', 'apifilename': 'file' }),

					nga.field('price', 'float'),
					nga.field('vat', 'number').label('VAT (%)'),
					nga.field('weight', 'float').attributes({placeholder: '(grams)'})
				]);

		return products;
};
