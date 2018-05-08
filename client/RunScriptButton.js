// Generated by CoffeeScript 1.12.6
(function() {
  var processResults;

  Template.RunScriptButton.rendered = function() {
    $(".script-run").click(function() {
      var request, scriptCode, scriptName, serverURL, startTime, userID;
      Session.set('graphFoundInResults', false);
      serverURL = Session.get('serverURL');
      scriptName = Session.get('scriptName');
      userID = Session.get('userID');
      Session.set('runStatus', 'Running...');
      Session.set('queryTime', 'Timing...');
      Session.set("firstRender", 0);
      Session.set('graphFoundInResults', false);
      Session.set('graphRenderingStatus', '');
      Session.set('elapsedRenderTime', '');
      Session.set('elapsedTime', 'Timing...');
      Session.set('drawButtonPressed', false);
      Session.set('startTime', moment().toDate());
      Session.set('scriptResult', null);
      Session.set('elementsInResults', {
        vertices: [],
        edges: []
      });
      if (window.resultsEditor) {
        window.resultsEditor.set({});
      }
      if (serverURL && scriptName) {
        if (window.ScriptEditor !== void 0) {
          scriptCode = window.ScriptEditor.getValue();
        } else {
          scriptCode = Session.get('scriptCode');
        }
        if (Session.get("usingWebSockets")) {
          window.socketToJanus.onmessage = function(msg) {
            var data, endTime, json, results;
            endTime = Date.now();
            data = msg.data;
            json = JSON.parse(data);
            if (json.status.code >= 500) {
              Session.set('runStatus', json.status.message);
              return alert("Error in processing Gremlin script: " + json.status.message);
            } else {
              if (json.status.code === 204) {
                results = [];
              } else {
                results = json.result.data;
              }
              return processResults(results, true, startTime - endTime);
            }
          };
          request = {
            requestId: uuid["new"](),
            op: "eval",
            processor: "",
            args: {
              gremlin: scriptCode,
              bindings: {},
              language: "gremlin-groovy"
            }
          };
          startTime = Date.now();
          return window.socketToJanus.send(JSON.stringify(request));
        } else {
          Meteor.call("runScript", userID, serverURL, Session.get('tinkerPopVersion'), Session.get('usingWebSockets'), scriptName, scriptCode, {}, function(error, result) {
            var d, results;
            if (error) {
              console.log(error);
              alert(JSON.stringify(error));
              return;
            }
            if ((result === void 0) || (result.results === void 0) || (result.results === null) || (result.results.length === 0)) {
              results = [null];
            } else {
              results = result.results;
            }
            if (window.resultsEditor) {
              window.resultsEditor.set(results);
            }
            Session.set('scriptResult', results);
            Session.set('runStatus', result.success);
            d = moment.duration(Math.round(result.queryTime * 1000) / 1000);
            Session.set('queryTime', window.durationToString(d));
            d = moment.duration(Math.round((moment() - moment(Session.get('startTime'))) * 1000) / 1000);
            Session.set('elapsedTime', window.durationToString(d));
            determineGraphToShow();
            if (((Session.get('graphToShow')).nodes.length === 0) && ((Session.get('graphToShow')).edges.length === 0)) {
              Session.set('graphRenderingStatus', 'No graph in result');
            } else {
              Session.set('graphRenderingStatus', 'Ready');
              if (Session.get('drawGraphResult') === true) {
                Session.set('drawButtonPressed', true);
                Session.set('graphRenderingStatus', 'Rendering...');
                Session.set('elapsedRenderTime', 'Timing...');
                randomizeLayout();
                renderGraph();
              }
            }
          });
        }
      }
    });
    $(".showJSONResult").prop('checked', false);
    Session.set('showJSONResult', false);
    $(".showJSONResult").change(function() {
      return Session.set('showJSONResult', $(".showJSONResult").prop('checked'));
    });
    $(".drawGraphResult").prop('checked', false);
    Session.set('drawGraphResult', false);
    return $(".drawGraphResult").change(function() {
      var state;
      state = $(".drawGraphResult").prop('checked');
      Session.set('drawGraphResult', state);
      Session.set('firstRender', 0);
      if (state === true) {
        $("#redrawButton").show();
        Session.set('drawButtonPressed', true);
        Session.set('graphRenderingStatus', 'Rendering...');
        Session.set('elapsedRenderTime', 'Timing...');
        randomizeLayout();
        return renderGraph();
      } else {
        $("#redrawButton").hide();
        Session.set('graphRenderingStatus', 'Ready');
        return Session.set('elapsedRenderTime', '');
      }
    });
  };

  Template.RunScriptButton.helpers({
    scriptSelected: function() {
      return (Session.get('scriptName')) !== null;
    },
    scriptResult: function() {
      return (Session.get('scriptResult')) !== null;
    },
    runStatus: function() {
      var status;
      status = Session.get('runStatus');
      if (status === true) {
        return 'Succeeded';
      }
      if (status === false) {
        return 'Failed';
      }
      return status;
    },
    queryTime: function() {
      var t;
      t = Session.get('queryTime');
      if (t === 'N/A') {
        return t;
      } else {
        return t;
      }
    },
    elapsedTime: function() {
      var t;
      t = Session.get('elapsedTime');
      if (t === 'N/A') {
        return t;
      } else {
        return t;
      }
    }
  });

  window.durationToString = function(d) {
    var qt;
    qt = '';
    if (d.hours()) {
      qt = qt + d.hours() + 'h';
    }
    if (d.minutes()) {
      qt = qt + d.minutes() + 'm';
    }
    if (d.seconds()) {
      qt = qt + d.seconds() + 's';
    }
    if (d.milliseconds()) {
      qt = qt + (Math.round(d.milliseconds())) + 'ms';
    }
    return qt;
  };

  processResults = function(results, success, queryTime) {
    var d;
    if (window.resultsEditor) {
      window.resultsEditor.set(results);
    }
    Session.set('scriptResult', results);
    Session.set('runStatus', success);
    d = moment.duration(Math.round(queryTime * 1000) / 1000);
    Session.set('queryTime', window.durationToString(d));
    d = moment.duration(Math.round((moment() - moment(Session.get('startTime'))) * 1000) / 1000);
    Session.set('elapsedTime', window.durationToString(d));
    determineGraphToShow();
    if (((Session.get('graphToShow')).nodes.length === 0) && ((Session.get('graphToShow')).edges.length === 0)) {
      Session.set('graphRenderingStatus', 'No graph in result');
    } else {
      Session.set('graphRenderingStatus', 'Ready');
      if (Session.get('drawGraphResult') === true) {
        Session.set('drawButtonPressed', true);
        Session.set('graphRenderingStatus', 'Rendering...');
        Session.set('elapsedRenderTime', 'Timing...');
        randomizeLayout();
        renderGraph();
      }
    }
  };

}).call(this);

//# sourceMappingURL=RunScriptButton.js.map
