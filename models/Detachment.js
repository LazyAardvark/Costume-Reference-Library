var keystone = require('keystone');

/**
 * Detachment Model
 * ==================
 */

var Detachment = new keystone.List('Detachment', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Detachment.add({
	name: { type: String, required: true },
});

Detachment.relationship({ ref: 'Post', path: 'posts', refPath: 'detachments' });

Detachment.register();
