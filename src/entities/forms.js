var languages = require('../../lib/language');
languages = languages.map((lang)=>{return {label: lang.name, value: lang.code}});

module.exports = function (nga, admin) {

		var forms = admin.getEntity('forms');

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
			nga.field('date', 'date').label('Created').format('dd/MM/yyyy')
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
