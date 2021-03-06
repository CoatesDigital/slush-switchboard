(function (Rotator) {
  Rotator.data = null;
  Rotator.parent = null;

  Rotator.build = function (parent, data) {
		this.parent = parent;

  	// filter rotator data
		this.data = { items: filter(data) };

    // add html
    addTemplate(parent);
		rivets.bind(parent, this.data);

    // set initial state
    window.requestAnimationFrame(function () {
      var frames = parent.find('.frame');
      frames.map(function (i, f) {
        Rotator.transition[f.dataset.transition + 'Initial'](f);
        deactivateFrame($(f).find('iframe')[0]);
      });
    });
  };

  Rotator.run = function () {
    var cycle = 0;

		var frames = Rotator.parent.find('.frame');
		var timeline = new SB.Timeline();

    if (!frames || frames.length <= 0)
      return;

		frames[0].className += " base";

		var current = 0;
		frames.map(function (i, f) {

			timeline.addEvent(function (frame) {
				return function () {
					frames.map(function (i, f) {
            if (f != frame) {
              Rotator.transition[f.dataset.transition + 'Out'](f, f.dataset.transitionDuration * 1000, f.dataset.transitionDelay * 1000);
              deactivateFrame($(f).find('iframe')[0]);
            }
					});

          Rotator.transition[frame.dataset.transition + 'In'](frame, frame.dataset.transitionDuration * 1000, frame.dataset.transitionDelay * 1000);
          activateFrame($(frame).find('iframe')[0]);

				};
			}(f), current);

			current += f.dataset.duration * 1000;
		});

    timeline.cycleTime = current;
    timeline.triggerLatest();
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
    <div class='rotator'>\
      <div class='frame' rv-each-item='items' rv-data-duration='item.Duration'\
                         rv-data-transition='item.Transition'\
                         rv-data-transition-duration='item.TransitionDuration'\
                         rv-data-transition-delay='item.TransitionDelay'>\
        <iframe rv-src='item.Content' />\
      </div>\
    </div>\
    ");
  };

  /**
   * Perform transitions
   */
  Rotator.transition = {
    'noneIn': function (elem, duration, delay) {
      $(elem).delay(delay).show(0);
    },
    'noneOut': function (elem, duration, delay) {
      $(elem).delay(delay).hide(0);
    },
    'noneInitial': function (elem) {
      Rotator.transition.noneOut(elem, 0, 0);
    },
    'fadeIn': function (elem, duration, delay) {
      $(elem).show(0).delay(delay).transition({ opacity: 1 }, duration);
    },
    'fadeOut': function (elem, duration, delay) {
      $(elem).delay(delay).transition({ opacity: 0 }, duration).delay(duration).hide(0);
    },
    'fadeInitial': function (elem) {
      Rotator.transition.fadeOut(elem, 0, 0);
    },
    'slidedownIn': function (elem, duration, delay) {
      $(elem).show(0).delay(delay).transition({ y: 0 }, duration);
    },
    'slidedownOut': function (elem, duration, delay) {
      $(elem).delay(delay).transition({ y: -$(elem).height() }, duration).delay(duration).hide(0);
    },
    'slidedownInitial': function (elem) {
      Rotator.transition.slidedownOut(elem, 0, 0);
    }
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
        m.TransitionDuration = m['Transition Duration'];
        m.TransitionDelay    = m['Transition Delay'];
        active.push(m);
      }
    });

    return active;
  };

  window.Rotator = Rotator;
})(window.Rotator || {});
