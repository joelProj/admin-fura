module.exports = function (nga, admin) {

		var answers = admin.getEntity('answers');

		answers.identifier(nga.field('_id'));

		answers.listView()
		.title('Answers')
		.fields([
				nga.field('title').isDetailLink(true),
				nga.field('date', 'date').format('dd/MM/yyyy HH:mm'),
		])
		.sortField('date')
		.sortDir('DESC')
		.exportFields([])
		.listActions(['edit']);

		answers.editionView()
				.title('Post')
				.fields([
						nga.field('title').validation({required: true}),
						nga.field('thumbnail')
							.attributes({placeholder: "https://server/image.jpeg"})
							.validation({required: true, pattern: /^https:\/\/.+/}),

						nga.field('blocks', 'embedded_list')
							.label('Content blocks')
							.sortField('index')
							.sortDir('ASC')
							.targetFields([
								// 'title', 'paragraph', 'quote', 'image', 'images', 'divider'
								nga.field('type', 'choice').label('Tipo')
									.defaultValue('paragraph')
									.validation({required: true})
									.choices([
										{label: 'Title', value: 'title'},
										{label: 'Paragraph', value: 'paragraph'},
										{label: 'Quote', value: 'quote'},
										{label: 'Wide image', value: 'image'},
										{label: 'Two images', value: 'images'},
										{label: 'Divider', value: 'divider'}
									]),

								// TEXT
								nga.field('text', 'text')
									.cssClasses(function(entity){
										if(['title', 'paragraph', 'quote'].indexOf(entity.values.type) >= 0) return "ng-admin-type-text col-sm-10 col-md-8 col-lg-7";
										else return "hidden";
									}),

								// IMAGE
								nga.field('url1')
									.label('Image 1')
									.cssClasses(function(entity){
										if(['image', 'images'].indexOf(entity.values.type) >= 0) return "col-sm-10 col-md-8 col-lg-7";
										else return "hidden";
									}),
								nga.field('url2')
									.label('Image 2')
									.cssClasses(function(entity){
										if(['images'].indexOf(entity.values.type) >= 0) return "col-sm-10 col-md-8 col-lg-7";
										else return "hidden";
									})
							])

				]);

		answers.creationView()
				.title('New answer')
				.fields([
						nga.field('title').validation({required: true}),
						nga.field('thumbnail')
							.attributes({placeholder: "https://server/image.jpeg"})
							.validation({required: true, pattern: /^https:\/\/.+/}),

						nga.field('blocks', 'embedded_list')
							.label('Content blocks')
							.sortField('index')
							.sortDir('ASC')
							.targetFields([
								// 'title', 'paragraph', 'quote', 'image', 'images', 'divider'
								nga.field('type', 'choice').label('Tipo')
									.defaultValue('paragraph')
									.validation({required: true})
									.choices([
										{label: 'Title', value: 'title'},
										{label: 'Paragraph', value: 'paragraph'},
										{label: 'Quote', value: 'quote'},
										{label: 'Wide image', value: 'image'},
										{label: 'Two images', value: 'images'},
										{label: 'Divider', value: 'divider'}
									]),

								// TEXT
								nga.field('text', 'text')
									.cssClasses(function(entity){
										if(['title', 'paragraph', 'quote'].indexOf(entity.values.type) >= 0) return "ng-admin-type-text col-sm-10 col-md-8 col-lg-7";
										else return "hidden";
									}),

								// IMAGE
								nga.field('url1')
									.label('Image 1')
									.cssClasses(function(entity){
										if(['image', 'images'].indexOf(entity.values.type) >= 0) return "col-sm-10 col-md-8 col-lg-7";
										else return "hidden";
									}),
								nga.field('url2')
									.label('Image 2')
									.cssClasses(function(entity){
										if(['images'].indexOf(entity.values.type) >= 0) return "col-sm-10 col-md-8 col-lg-7";
										else return "hidden";
									})
							])

				]);

		return answers;
};
