module.exports = function (nga, admin) {

		var answers = admin.getEntity('answers');
		var questions = admin.getEntity('questions');

		answers.identifier(nga.field('_id'));

		answers.listView()
		.title('Answers')
		.fields([
			nga.field('quest', 'reference').label('Question')
			.targetEntity(questions)
			.targetField(nga.field('id_fura'))
			.isDetailLink(true),
			nga.field('userCode').label("User Code").isDetailLink(true),
			nga.field('group').isDetailLink(true),
			nga.field('value').isDetailLink(true),
			nga.field('date', 'date').format('dd/MM/yyyy HH:mm'),
		])
		.sortField('date')
		.sortDir('DESC')
		.exportFields([])
		.listActions(['show'])
		.filters([
			nga.field('id_fura').label('Question'),
			nga.field('userCode').label('User'),
			nga.field('group').label('Group'),
		]);

		answers.showView()
		.title('Answers')
		.fields([
			nga.field('quest', 'reference').label('Question')
			.targetEntity(questions)
			.targetField(nga.field('id_fura'))
			.isDetailLink(true),
			nga.field('userCode').label("User Code"),
			nga.field('group'),
			nga.field('value'),
			nga.field('date', 'date').format('dd/MM/yyyy HH:mm'),
		]);

		return answers;
};
