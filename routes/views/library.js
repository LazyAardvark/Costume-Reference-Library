var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'library';
	locals.filters = {
		detachment: req.params.detachment,
	};
	locals.data = {
		costumes: [],
		detachments: [],
	};

	// Load all detachments
	view.on('init', function (next) {

		keystone.list('Detachment').model.find().sort('name').exec(function (err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.data.detachments = results;

			// Load the counts for each detachment
			async.each(locals.data.detachments, function (detachment, next) {

				keystone.list('Costume').model.count().where('detachments').in([detachment.id]).exec(function (err, count) {
					detachment.costumeCount = count;
					next(err);
				});

			}, function (err) {
				next(err);
			});
		});
	});

	// Load the current detachment filter
	view.on('init', function (next) {

		if (req.params.detachment) {
			keystone.list('Detachment').model.findOne({ key: locals.filters.detachment }).exec(function (err, result) {
				locals.data.detachment = result;
				next(err);
			});
		} else {
			next();
		}
	});

	// Load the costumes
	view.on('init', function (next) {

		var q = keystone.list('Costume').paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10,
		})
			.populate(' detachments');

		if (locals.data.detachment) {
			q.where('detachments').in([locals.data.detachment]);
		}

		q.exec(function (err, results) {
			locals.data.costumes = results;
			next(err);
		});
	});

	// Render the view
	view.render('library');
};
