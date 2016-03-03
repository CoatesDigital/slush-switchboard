// Configure Switchboard
(function () {

	function init() {
		// Start your application logic here
	}

	SB.setup({
		url: 'http://xxxx.coatesdigital.com.au/',
		sources: [
			{ name: 'sample', filename:'sample.csv' }
		],
		success: init
	});

})();
