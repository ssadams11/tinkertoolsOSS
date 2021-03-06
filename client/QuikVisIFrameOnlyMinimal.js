// Generated by CoffeeScript 1.12.6
(function() {
  var modifyRenderingUsing, processResults, runScriptAndDrawResults;

  Template.QuikVisIFrameOnlyMinimal.rendered = function() {
    var scriptObject;
    Session.set('keyForNodeLabel', "null");
    if ((Session.get('scripts')).length = 1) {
      scriptObject = (Session.get('scripts'))[0];
      Session.set('scriptName', scriptObject.title);
      runScriptAndDrawResults(scriptObject.script);
    }
    return $("#scriptSelector").change(function() {
      var each, i, len, ref, scriptCode, scriptName;
      scriptName = $("#scriptSelector").val();
      ref = Session.get('scripts');
      for (i = 0, len = ref.length; i < len; i++) {
        each = ref[i];
        if (scriptName === each.title) {
          scriptCode = each.script;
          Session.set('scriptName', each.title);
        }
      }
      return runScriptAndDrawResults(scriptCode);
    });
  };

  runScriptAndDrawResults = function(scriptCode) {
    var graphName, request, scriptName, serverURL, startTime, userID;
    Session.set('graphFoundInResults', false);
    Session.set('graphRenderingStatus', '');
    Session.set('drawButtonPressed', false);
    Session.set('scriptCode', scriptCode);
    Session.set('userID', 'quikvis');
    Session.set('tinkerPopVersion', '3');
    Session.set('graphFoundInResults', false);
    serverURL = Session.get('serverURL');
    graphName = Session.get('graphName');
    scriptName = Session.get('scriptName');
    userID = Session.get('userID');
    Session.set('graphFoundInResults', false);
    Session.set('graphRenderingStatus', '');
    Session.set('elapsedRenderTime', '');
    Session.set('elapsedTime', 'Timing...');
    Session.set('drawButtonPressed', false);
    Session.set('startTime', moment().toDate());
    Session.set('elementsInResults', {
      vertices: [],
      edges: []
    });
    if (window.resultsEditor) {
      window.resultsEditor.set({});
    }
    if (serverURL && graphName && scriptName) {
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
        window.socketToJanus.send(JSON.stringify(request));
      } else {
        Meteor.call("runScript", userID, serverURL, Session.get('tinkerPopVersion'), Session.get("usingWebSockets"), scriptName, scriptCode, {}, function(error, result) {
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
          Session.set('drawButtonPressed', true);
          Session.set('graphRenderingStatus', 'Rendering...');
          Session.set('elapsedRenderTime', 'Timing...');
          randomizeLayout();
          return renderGraph();
        });
        return;
      }
    }
  };

  modifyRenderingUsing = function() {
    return setTimeout(function() {
      var directive, directives, edge, edges, functionString, gts, i, j, k, l, len, len1, len2, len3, len4, len5, len6, m, n, node, nodes, o, option, options, ref, ref1, rendering, renderingKey, renderingScript, results1, selectionScript;
      gts = Session.get('graphToShow');
      options = Session.get('renderingOptions');
      nodes = gts.nodes;
      edges = gts.edges;
      results1 = [];
      for (i = 0, len = options.length; i < len; i++) {
        option = options[i];
        if (option.type === 'edge') {
          ref = option.renderings;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            rendering = ref[j];
            selectionScript = rendering.selectUsing;
            directives = rendering.directives;
            for (k = 0, len2 = directives.length; k < len2; k++) {
              directive = directives[k];
              renderingKey = (Object.keys(directive))[0];
              renderingScript = directive[renderingKey];
              functionString = 'function selector(edge){return ' + selectionScript + '}';
              eval(functionString);
              functionString = 'function renderer(edge){return ' + renderingScript + '}';
              eval(functionString);
              for (l = 0, len3 = edges.length; l < len3; l++) {
                edge = edges[l];
                if (selector(edge.element)) {
                  edge[renderingKey] = renderer(edge.element);
                } else {

                }
              }
            }
          }
        }
        if (option.type === 'vertex') {
          ref1 = option.renderings;
          for (m = 0, len4 = ref1.length; m < len4; m++) {
            rendering = ref1[m];
            selectionScript = rendering.selectUsing;
            directives = rendering.directives;
            for (n = 0, len5 = directives.length; n < len5; n++) {
              directive = directives[n];
              renderingKey = (Object.keys(directive))[0];
              renderingScript = directive[renderingKey];
              functionString = 'function selector(vertex){return ' + selectionScript + '}';
              eval(functionString);
              functionString = 'function renderer(vertex){return ' + renderingScript + '}';
              eval(functionString);
              for (o = 0, len6 = nodes.length; o < len6; o++) {
                node = nodes[o];
                if (selector(node.element)) {
                  node[renderingKey] = renderer(node.element);
                } else {

                }
              }
            }
          }
        }
        window.visnetwork.nodesHandler.body.data.nodes.update(nodes);
        results1.push(window.visnetwork.edgesHandler.body.data.edges.update(edges));
      }
      return results1;
    }, 2000);
  };

  Template.QuikVisIFrameOnlyMinimal.helpers({
    isAdmin: function() {
      return (Session.get('userID')) === (Session.get('admin-userID'));
    },
    notAdmin: function() {
      return (Session.get('userID')) !== (Session.get('admin-userID'));
    },
    userLoggedIn: function() {
      return (Session.get('userID')) !== null;
    },
    scripts: function() {
      return Session.get('scripts');
    },
    multipleScripts: function() {
      return (Session.get('scripts')).length > 1;
    },
    script: function() {
      return this.title;
    },
    scriptResult: function() {
      return true;
    },
    graphSelected: function() {
      return true;
    },
    scriptSelected: function() {
      return (Session.get('scriptName')) !== null;
    },
    drawingGraph: function() {
      return true;
    },
    graphToShow: function() {
      return Session.get('graphFoundInResults');
    },
    renderingOptions: function() {
      return JSON.stringify(Session.get('renderingOptions'));
    }
  });

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

//# sourceMappingURL=QuikVisIFrameOnlyMinimal.js.map
