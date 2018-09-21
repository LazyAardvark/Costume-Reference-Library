var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Costume Model
 * ==========
 */

var Costume = new keystone.List('Costume', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Costume.add({
	title: { type: String, required: true },
	costume: {
		image: { type: Types.CloudinaryImage },
		model: {type: String, required: false},
		photographer: {type: String, required: false},
	},
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
		prefix: {type: String, required: false},
		context: {type: String, required: false},
	},
	detachments: { type: Types.Relationship, ref: 'Detachment', many: false },
});

Costume.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Costume.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Costume.register();
