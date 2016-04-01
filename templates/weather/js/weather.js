(function (Weather) {
  Weather.data = null;
  Weather.parent = null;

  Weather.build = function (parent, data) {
		this.parent = parent;

  	// filter Weather data
		this.data = { items: filter(data) };

    // add html
    addTemplate(parent);
		rivets.bind(parent, this.data);

    // set initial state
    window.requestAnimationFrame(function () {
      var frames = parent.find('.frame');
      frames.map(function (i, f) {
        Weather.transitionOut(f);
        deactivateFrame($(f).find('iframe')[0]);
      });
    });
  };

  Weather.run = function (location, units, callback) {
    Weather.get(location, units, callback);
  };

  Weather.get = function (location, units, callback) {
    $.simpleWeather({
      location: location,
      unit: units,
      success: function (weather) {
        callback(weather);
        Weather.update(weather);
      }
    });

    setTimeout(function () {
      Weather.get(location, units, callback);
    }, 60000);
  };

  Weather.update = function (weather) {
    var temp = parseInt(weather.temp);

		var frames = Array.from(document.querySelectorAll('.frame'));
		var set = false;
		frames.map(function (m) {
			if (m.dataset.temp <= temp && !set) {
				set = true;
				return Weather.activate(m);
			}
		});
  };

  Weather.activate = function (elem) {
    var frames = Array.from(document.querySelectorAll('.frame'));
    frames.map(function (m) {
      if (m != elem)
        Weather.transitionOut(m);
    });

    Weather.transitionIn(elem);
  };

  // activate the frame being called
  var activateFrame = function (frame) {
    if (frame.contentWindow.activate)
      frame.contentWindow.activate();
  };

  // deactivate the frame being called
  var deactivateFrame = function (frame) {
    if (frame.contentWindow.deactivate)
      frame.contentWindow.deactivate();
  };

  // add rivets template to html
  var addTemplate = function (parent) {
    parent.html("\
    <div class='Weather'>\
      <div class='frame' rv-each-item='items' rv-data-duration='item.Duration'\
                                              rv-data-temp='item.Temp'>\
        <iframe rv-src='item.Content' />\
      </div>\
    </div>\
    ");
  };

  /**
   * Perform transitions
   */
  Weather.transitionIn = function (elem) {
    $(elem).show(0).transition({ opacity: 1 }, 1000);
  };

  Weather.transitionOut = function (elem) {
    $(elem).transition({ opacity: 0 }, 1000).delay(1000).hide(0);
  };

  /**
   * Filters only active
   */
  var filter = function (data) {
    var active = [];

    data.map(function (m) {
      if (m.Active) {
        m.Active = false;
        m.Content = '/content/' + m.Content + '/';
        m.Temp = m['Minimum Temperature'] || -Number.MAX_SAFE_INTEGER;
        active.push(m);
      }
    });

		active.sort(function (a, b) {
			return a.Temp < b.Temp;
		});

    return active;
  };

  window.Weather = Weather;
})(window.Weather || {});
