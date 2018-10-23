module.exports = function (nga, admin) {

		var shops = admin.getEntity('shops');

		shops.identifier(nga.field('_id'));

		shops.listView()
		.title('Tiendas')
		.fields([
				nga.field('name')
					.isDetailLink(true),
				nga.field('city')
					.isDetailLink(true)
		])
		.sortField('name')
		.sortDir('ASC')
		.exportFields([])
		.listActions(['edit']);

		shops.editionView()
				.title('Tienda')
				.fields([
					nga.field('name')
						.validation({required: true})
						.isDetailLink(true),
					nga.field('address')
						.validation({required: true})
						.isDetailLink(true),
					nga.field('zip')
						.validation({required: true})
						.isDetailLink(true),
					nga.field('city')
						.validation({required: true})
						.isDetailLink(true),
					nga.field('image')
						.validation({required: true})
						.isDetailLink(true)
				]);

		shops.creationView()
				.title('Nueva Tienda')
				.fields([
					nga.field('name')
						.validation({required: true})
						.isDetailLink(true),
					nga.field('address')
						.validation({required: true})
						.isDetailLink(true),
					nga.field('zip')
						.validation({required: true})
						.isDetailLink(true),
					nga.field('city')
						.validation({required: true})
						.isDetailLink(true),
					nga.field('image')
						.validation({required: true})
						.isDetailLink(true)
				]);

		return shops;
};
