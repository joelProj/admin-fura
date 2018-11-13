module.exports = function (nga, admin) {

		var questions = admin.getEntity('questions');

		questions.identifier(nga.field('_id'));

		questions.listView()
		.title('Questions')
		.fields([
			nga.field('form').label('Form').isDetailLink(true),
			nga.field('id_fura').label("ID").isDetailLink(true),
			nga.field('group').label('Group').isDetailLink(true),
			nga.field('text').label('Question'),
			nga.field('date', 'date').label('Created').format('dd/MM/yyyy')
		])
		.sortField('id_fura')
		.sortDir('ASC')
		.listActions(['show'])
		.filters([
			nga.field('form'),
			nga.field('group')
		]);

		questions.showView()
		.title('Question')
		.fields([
			nga.field('form').label('Form'),
			nga.field('id_fura').label("ID"),
			nga.field('group').label('Group'),
			nga.field('text').label('Question'),
			nga.field('opcions', 'embedded_list').label('Options')
			.targetFields([
				nga.field('opt').label('Option')
			]),
			nga.field('date', 'date').label('Created').format('dd/MM/yyyy')
		])
		.actions(['edit']);

		questions.editionView()
		.title('Question')
		.fields([
			nga.field('form').label('Form'),
			nga.field('id_fura').label("ID"),
			nga.field('group').label('Group'),
			nga.field('text').label('Question'),
			nga.field('opcions', 'embedded_list').label('Options')
			.targetFields([
				nga.field('opt').label('Option')
			])
		]);

		questions.creationView()
		.title('Question')
		.fields([
			nga.field('form').label('Form'),
			nga.field('id_fura').label("ID"),
			nga.field('group').label('Group'),
			nga.field('text').label('Question'),
			nga.field('opcions', 'embedded_list').label('Options')
			.targetFields([
				nga.field('opt').label('Option')
			])
		]);

		return questions;
};
