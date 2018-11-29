var languages = require('../../lib/language');
languages = languages.map((lang)=>{return {label: lang.name, value: lang.code}});

module.exports = function (nga, admin) {

		var forms = admin.getEntity('forms');
		var questions = admin.getEntity('questions');

		forms.identifier(nga.field('_id'));

		forms.listView()
		.title('Forms')
		.fields([
			nga.field('name').label('Form').isDetailLink(true),
			nga.field('date', 'date').label('Created').format('dd/MM/yyyy')
		])
		.sortField('name')
		.sortDir('ASC')
		.listActions(['show']);

		forms.showView()
		.title('Form')
		.fields([
			nga.field('name').label('Form').isDetailLink(true),
			nga.field('date', 'date').label('Created').format('dd/MM/yyyy'),
			nga.field('questions', 'referenced_list') // Define a 1-N relationship with the comment entity
				.targetEntity(questions) // Target the comment Entity
				.targetReferenceField('form') // Each comment with post_id = post.id (the identifier) will be displayed
				.targetFields([ // which comment fields to display in the datagrid
					nga.field('id_fura').label("ID").isDetailLink(true),
					nga.field('timer', 'number').label("Timer (seconds)").format('0,0.00'),
					nga.field('default', 'choice').label('Default Language').choices(languages),
					nga.field('text').label('Question'),
					nga.field('date', 'date').label('Created').format('dd/MM/yyyy')
				])
		])
		.actions(['edit']);

		forms.editionView()
		.title('Form')
		.fields([
                        nga.field('name').label('Form').isDetailLink(true)
		]);

		forms.creationView()
		.title('Form')
		.fields([
                        nga.field('name').label('Form').isDetailLink(true)
		]);

		return forms;
};
