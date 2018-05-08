// Generated by CoffeeScript 1.12.6
(function() {
  var durationToString;

  Template.DrawGraphButton.rendered = function() {
    $("#redrawButton").hide();
    return $(".results-graph-draw").click(function() {
      Session.set('drawButtonPressed', true);
      Session.set('graphRenderingStatus', 'Rendering...');
      Session.set('elapsedRenderTime', 'Timing...');
      Session.set("firstRender", 0);
      return renderGraph();
    });
  };

  Template.DrawGraphButton.helpers({
    drawButtonPressed: function() {
      return Session.get('drawButtonPressed');
    },
    scriptSelected: function() {
      return (Session.get('scriptName')) !== null;
    },
    scriptResult: function() {
      return (Session.get('scriptResult')) !== null;
    },
    renderingStatus: function() {
      var status;
      if ((Session.get('scriptResult')) !== null) {
        status = Session.get('graphRenderingStatus');
        if (status === true) {
          return 'Succeeded';
        } else {
          return status;
        }
      } else {
        return "Run script first";
      }
    },
    elapsedRenderTime: function() {
      var t;
      if ((Session.get('scriptResult')) !== null) {
        t = Session.get('elapsedRenderTime');
        if (t === 'N/A') {
          return t;
        } else {
          return t;
        }
      } else {
        return "";
      }
    }
  });

  durationToString = function(d) {
    var qt;
    qt = '';
    if (d.hours()) {
      qt = qt + d.hours() + 'h,';
    }
    if (d.minutes()) {
      qt = qt + d.minutes() + 'm,';
    }
    if (d.seconds()) {
      qt = qt + d.seconds() + 's,';
    }
    if (d.milliseconds()) {
      qt = qt + (Math.round(d.milliseconds())) + 'ms';
    }
    return qt;
  };

}).call(this);

//# sourceMappingURL=DrawGraphButton.js.map
