var languages = require('../../lib/language');
languages = languages.map((lang)=>{return {label: lang.name, value: lang.code}});

module.exports = function (nga, admin) {

		var questions = admin.getEntity('questions');
		var forms = admin.getEntity('forms');

		questions.identifier(nga.field('_id'));
		forms.identifier(nga.field('_id'));

		questions.listView()
		.title('Questions')
		.fields([
			//nga.field('form').label('Form').isDetailLink(true),
			nga.field('form', 'reference')
				.targetEntity(forms)
				.targetField(nga.field('name')), 
			nga.field('id_fura').label("ID").isDetailLink(true),
			nga.field('timer', 'number').label("Timer (seconds)").format('0,0.00'),
			nga.field('default', 'choice').label('Default Language').choices(languages),
			nga.field('text').label('Question'),
			nga.field('date', 'date').label('Created').format('dd/MM/yyyy')
		])
		.sortField('id_fura')
		.sortDir('ASC')
		.listActions(['show'])
		.filters([
			nga.field('form')
		]);

		questions.showView()
		.title('Question')
		.fields([
			nga.field('form', 'reference')
				.targetEntity(forms)
				.targetField(nga.field('name')), 
			nga.field('id_fura').label("ID"),
			nga.field('timer', 'number').label("Timer (seconds)").format('0,0.00'),
			nga.field('default', 'choice').label('Default Language').choices(languages),
			nga.field('text', 'embedded_list').label('Question')
			.targetFields([
				nga.field('lang', 'choice').label('Language').choices(languages),
				nga.field('text').label('Text')
			]),
			nga.field('answers', 'embedded_list').label('Answers')
			.targetFields([
				nga.field('lang', 'choice').label('Language').choices(languages),
				nga.field('values', 'embedded_list').label('Values')
				.targetFields([
					nga.field('value').label('Value')
				])
			]),
			nga.field('date', 'date').label('Created').format('dd/MM/yyyy')
		])
		.actions(['show', 'edit']);

		questions.editionView()
		.title('Question')
		.fields([
			nga.field('form', 'reference')
				.targetEntity(forms)
				.targetField(nga.field('name')),
			nga.field('id_fura').label("ID"),
			nga.field('timer', 'number').label("Timer (seconds)").format('0,0.00'),
			nga.field('default', 'choice').label('Default Language').choices(languages),
			nga.field('text', 'embedded_list').label('Question')
			.targetFields([
				nga.field('lang', 'choice').label('Language').choices(languages),
				nga.field('text').label('Text')
			]),
			nga.field('answers', 'embedded_list').label('Answers')
			.targetFields([
				nga.field('lang', 'choice').label('Language').choices(languages),
				nga.field('values', 'embedded_list').label('Values')
				.targetFields([
					nga.field('value').label('Value')
				])
			])
		]);

		questions.creationView()
		.title('Question')
		.fields([
			nga.field('form', 'reference')
				.targetEntity(forms)
				.targetField(nga.field('name')),
			nga.field('id_fura').label("ID"),
			nga.field('timer', 'number').label("Timer (seconds)").format('0,0.00'),
			nga.field('default', 'choice').label('Default Language').choices(languages),
			nga.field('text', 'embedded_list').label('Question')
			.targetFields([
				nga.field('lang', 'choice').label('Language').choices(languages),
				nga.field('text').label('Text')
			]),
			nga.field('answers', 'embedded_list').label('Answers')
			.targetFields([
				nga.field('lang', 'choice').label('Language').choices(languages),
				nga.field('values', 'embedded_list').label('Values')
				.targetFields([
					nga.field('value').label('Value')
				])
			])
		]);

		return questions;
};
