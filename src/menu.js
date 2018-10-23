module.exports = function(nga, admin) {
		return nga.menu()
				.addChild(nga.menu()
						.icon('<span class="fa fa-bar-chart fa-fw"></span>')
						.title('Summary')
						.link('/summary')
				)
				.addChild(nga.menu(admin.getEntity('questions'))
						.active(function(path){return path.indexOf('/questions') === 0})
						.icon('<span class="fa fa-question-circle fa-fw"></span>')
						.title('Questions')
				)
				.addChild(nga.menu(admin.getEntity('answers'))
						.icon('<span class="fa fa-comment fa-fw"></span>')
						.title('Answers')
				)
		;
};
