// Configure Switchboard
(function () {

	var playlist = [];

	function init() {
		// get '*-Playlist.csv'
		var allData = SB.Data.get();
		for (var ds in allData) {
			if (ds.toLowerCase().indexOf('playlist.csv') > 0)
				playlist = allData[ds];
		}

		// Do rotator stuff
		Rotator.build($('.content'), playlist);
		Rotator.run();
	}

	SB.setup({
		url: 'http://xxxx.coatesdigital.com.au/',
		sources: [
			'sample-playlist.csv'
		],
		success: init
	});

})();
