const Form = require('../models/form.js');

async function getFormList() {
	var forms = await Form.find().lean().exec();
	forms = forms.map((form)=>{return {value:form._id, label:form.name}});
	return forms;
}

module.exports = {getFormList};