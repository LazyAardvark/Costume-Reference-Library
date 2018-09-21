var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Detachment Model
 * ==================
 */

var Detachment = new keystone.List('Detachment', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Detachment.add({
	name: { type: String, required: true },
	image: { type: Types.CloudinaryImage },
	desc: { type: String, required: false },
	link: { type: Types.Url, required: false},
});

Detachment.relationship({ ref: 'Costume', path: 'costumes', refPath: 'detachments' });

Detachment.register();
