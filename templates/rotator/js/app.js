// Configure Switchboard
(function () {

	var playlist = [];

	function init() {
		playlist = SB.Data.like('playlist.csv').single();
		
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
