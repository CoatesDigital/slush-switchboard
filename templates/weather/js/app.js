// Configure Switchboard
(function () {

	var content = [], config = [];
	var location = 0, units = 0;

	function init() {
		content = SB.Data.like('content.csv').single();
		config = SB.Data.like('config.csv').single()[0];

		location = config.Location;
		units = config.Units;

		// Do rotator stuff
		Weather.build($('.content'), playlist);
		Weather.run(location, units, function (weather) { console.log(weather); });
	}

	SB.setup({
		url: 'http://xxxx.coatesdigital.com.au/',
		sources: [
			'sample-config.csv',
			'sample-content.csv'
		],
		success: init
	});

})();
