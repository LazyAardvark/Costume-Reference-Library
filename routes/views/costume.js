var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'library';
	locals.filters = {
		costume: req.params.costume,
	};
	locals.data = {
		costumes: [],
	};

	// Load the current costume
	view.on('init', function (next) {

		var q = keystone.list('Costume').model.findOne({
			slug: locals.filters.costume,
		}).populate('detachments');

		q.exec(function (err, result) {
			locals.data.costume = result;
			next(err);
		});

	});

	// Load other costumes
	view.on('init', function (next) {

		var q = keystone.list('Costume').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');

		q.exec(function (err, results) {
			locals.data.costumes = results;
			next(err);
		});

	});

	// Render the view
	view.render('costume');
};
