// makerequests.js
// LIBRARY CLASS 

// REQUIREMENTS
// - bootstrap.js 4.0
// - jquery.js 3.1.1
// - jstat.js
// - plotly.js

function MakeRequests(opt) {
  
  "use strict";
  
  //CONFIG
  //buttonName: name of the class of buttons to click
  //putMeHere: class of the div where to append library-generated HTML
  var buttonName = opt.buttonClassName,
    putMeHere = opt.putMeHereClassName,
    //Functions config
    beta = true,
    chisquare = true,
    exponential = true,
    normal = true,
    studentt = true,
    uniform = true,
    linear = true,
    stepFunction = true,
      
  //VARIABLES
    buttons,
    el,
    row,
    rowDistributions,
    firebtn,
    timeInputHTML = "<div class='form-group'><label for='timeText'>Time interval:&nbsp</label><input type='number' placeholder='in seconds' class='form-control mr-sm-2' id='timeText' name='time'/></div>",
  
  //UTILITIES functions
      
  //Retrieve forms data as dictionary
    getDataObj = function () {

      var dataArray = $('form.form-inline').serializeArray(),
        dataObj = {};

      $(dataArray).each(function (i, field) {
        if (field.value == ''){
          //Checks of inputs to be improved
          dataObj[field.name] = '0';
        } else {
          dataObj[field.name] = field.value;
        }
      });

      return dataObj;

    },
  
  //CSS style for the library elements
    setCSS = function () {
    
      var node = document.createElement('style');
      node.innerHTML = ".putMeHere {background:#ffcccc} .distr-button { background:#ff8080; border-color:#ff6666; } .distr-button:focus, .distr-button:hover { background:#ff6666; border-color:#ff6666; outline: none !important; box-shadow: none;} .fire-btn{background:#cc0000; border-color:#b30000;} .fire-btn:focus, .fire-btn:hover {background:#b30000; border-color:#b30000; outline: none !important; box-shadow: none;} .align-left {text-align: left;} .info-distr{ color:red; margin-left: 15px;} .choose-btn{ margin-left: 15px !important}";
      document.body.appendChild(node);
    
    },
      
    buildDistrButton = function (text) {
    
      var btn;
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-primary ml-2 mb-2 distr-button';
      btn.textContent = text;

      return btn;
    
    },
  
    generateSamples = function (distribution) {
    
      var dataObj = getDataObj(),
        samples = [],
        i = 0;

      switch (distribution) {
        case 'normal': {
          for (i = 0; i < dataObj.numClick; i += 1) {
            samples.push(jStat.normal.sample(dataObj.mean, dataObj.stdev));
          }
          return samples;
        }
        case 'beta': {
          for (i = 0; i < dataObj.numClick; i += 1) {
            samples.push(jStat.beta.sample(dataObj.alpha, dataObj.beta));
          }
          return samples;
        }
        case 'chisquare': {
          for (i = 0; i < dataObj.numClick; i += 1) {
            samples.push(jStat.chisquare.sample(dataObj.dof));
          }
          return samples;
        }
        case 'exp': {
          for (i = 0; i < dataObj.numClick; i += 1) {
            samples.push(jStat.exponential.sample(dataObj.rate));
          }
          return samples;
        }
        case 'uni': {
          for (i = 0; i < dataObj.numClick; i += 1) {
            samples.push(jStat.uniform.sample(dataObj.a, dataObj.b));
          }
          return samples;
        }
        case 'studentT': {
          for (i = 0; i < dataObj.numClick; i += 1) {
            samples.push(jStat.studentt.sample(dataObj.dof));
          }
          return samples;
        }
        case 'linear':{
          var count = 0,
            timeStep = (dataObj.time*1.0/dataObj.step),
            j = 0;
          for (i = 0; i <= dataObj.time; i += timeStep) {
            for (j = 0; j < count; j += 1){
              samples.push(i);
            } 
            count += parseInt(dataObj.slope);
          }
          return samples;    
        }
        case 'step':{
          var timeStep = Math.round(100.0/dataObj.step),
            stepPoint = parseFloat(dataObj.ratio) * 100.0,
            r = 0.0,
            i = 0,
            j = 0;
          
          console.log(timeStep);
          console.log(stepPoint);
          
          for (r = 0; r < dataObj.rep; r = r + 1) {
            for (i = 0; i < stepPoint; i = i + timeStep) {
            console.log(i + " " + (stepPoint));
              for (j = 0; j < dataObj.highValue; j += 1){
                samples.push(i + r*100.0);
              } 
            }
     
            for (i = stepPoint; i < 100.0; i = i + timeStep) {
            console.log(i + " " + 100.0);
              for (j = 0; j < dataObj.lowValue; j += 1){
                samples.push(i + r*100.0);
              } 
            }
          }
          return samples;
        }     
        default: {
          samples = []
          return samples;
        }
      }
    
    },
      
    distributionButtonsHTML = function () {
      
      //Add buttons of distributions set as true in config
      var btn;
      rowDistributions.innerHTML = '';

      if (normal) { 
        btn = buildDistrButton('Normal');
        btn.onclick = function() { showNormal(); };
        rowDistributions.appendChild(btn) };
      if (beta) { 
        btn = buildDistrButton('Beta');
        btn.onclick = function() { showBeta(); };
        rowDistributions.appendChild(btn) };
      if (chisquare) { 
        btn = buildDistrButton('Chi Square');
        btn.onclick = function() { showChiSquare(); };
        rowDistributions.appendChild(btn) };
      if (exponential) { 
        btn = buildDistrButton('Exponential');
        btn.onclick = function() { showExp(); };
        rowDistributions.appendChild(btn) };
      if (uniform) { 
        btn = buildDistrButton('Uniform');
        btn.onclick = function() { showUni(); };
        rowDistributions.appendChild(btn) };
      if (studentt) { 
        btn = buildDistrButton('T-Student');
        btn.onclick = function() { showStudentT(); };
        rowDistributions.appendChild(btn) };
      if (linear) { 
        btn = buildDistrButton('Linear');
        btn.onclick = function() { showLinear(); };
        rowDistributions.appendChild(btn) };
      if (stepFunction) { 
        btn = buildDistrButton('Step Function');
        btn.onclick = function() { showStep(); };
        rowDistributions.appendChild(btn) };

    },
   
    //If no distribution is selected all requests are fired together
    defaultFireFunction = function () {
      
      
      var dataObj = getDataObj(),
        i = 0;

      console.log(dataObj);
      if (dataObj.buttonNum == buttons.length) {
        for (i = 0; i < dataObj.numClick; i = i + 1) {
          buttons[Math.floor((Math.random() * 3))].click();
        }
      } else {
        for (i = 0; i < dataObj.numClick; i = i + 1) {
          buttons[dataObj.buttonNum].click();
        }
      }

    },

    fireFunction = function (distribution) {

      var dataObj = getDataObj(),
        samples = generateSamples(distribution),
        init = 0,
        scale = 0,
        i = 0;

      samples.sort((a, b) => a - b);
      
      //Create array of timeouts to fire w.r.t. samples
      init = samples[0];
      samples[0] = 0;
      for (i = 1; i < samples.length; i++) {
        samples[i] = samples[i] - init;
      }

      console.log(samples);
      
      //Scale timeouts on time interval
      scale = (dataObj.time*1000 / samples[samples.length - 1]);
      for (i = 1; i < samples.length; i++) {
        samples[i] *= scale;
      }
      
      //PLOT samples
      var counts = {};
      samples.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
      var x = [],
        y = [];
      for (var k in counts) {
          if (! counts.hasOwnProperty(k)) {
            continue;
          }
          x.push(k/1000);
          y.push(counts[k]);
      }
      var trace = {
        x: x,
        y: y,
        mode: 'markers'
      };
      var data = [trace];
      var layout = {};
      Plotly.newPlot('graph', data, layout);
      
      if (dataObj.buttonNum == buttons.length){
          for (i = 0; i < samples.length; i++) {
            setTimeout(function(){buttons[Math.floor((Math.random() * 3))].click();}, samples[i]);
          }
        } else {
          for (i = 0; i < samples.length; i++) {
            setTimeout(function(){buttons[dataObj.buttonNum].click();}, samples[i]);

          }
      }

    },
      
    showNormal = function () {
    
      var form = "<h5 class='col-md-3 col-sm-6 align-left'>Normal distribution</h5><form class='form-inline col-md-12 col-sm-6 mt-2'><div class='form-group'><label for='meanText'>Mean:&nbsp</label><input type='number' class='form-control mr-sm-2' id='meanText' name='mean'/></div><div class='form-group'><label for='stdevText'>Standard Deviation:&nbsp</label><input type='number' class='form-control mr-sm-2' id='stdevText' name='stdev'/></div>" + timeInputHTML + "</form>";

      rowDistributions.innerHTML = form;

      firebtn.onclick = function () { fireFunction('normal'); };

      showChoose();
    },
      
    showBeta = function () {
    
      var form = "<h5 class='col-md-3 col-sm-6 align-left'>Beta distribution</h5><form class='form-inline col-md-12 col-sm-6 mt-2'><div class='form-group'><label for='alphaText'>Parameter alpha:&nbsp</label><input type='number' class='form-control mr-sm-2' id='alphaText' name='alpha'/></div><div class='form-group'><label for='betaText'>Parameter beta:&nbsp</label><input type='number' class='form-control mr-sm-2' id='betaText' name='beta'/></div>" + timeInputHTML + "</form>";

      rowDistributions.innerHTML = form;

      firebtn.onclick = function () { fireFunction('beta'); };

      showChoose();
    },
      
    showChiSquare = function () {
    
      var form = "<h5 class='col-md-3 col-sm-6 align-left'>Chi Square distribution</h5><form class='form-inline col-md-12 col-sm-6 mt-2'><div class='form-group'><label for='dofText'>Degrees of Freedom:&nbsp</label><input type='number' class='form-control mr-sm-2' id='dofText' name='dof'/></div>" + timeInputHTML + "</form>";

      rowDistributions.innerHTML = form;

      firebtn.onclick = function () { fireFunction('chisquare'); };

      showChoose();
    },
      
    showExp = function () {
    
      var form = "<h5 class='col-md-3 col-sm-6 align-left'>Exponential distribution</h5><form class='form-inline col-md-12 col-sm-6 mt-2'><div class='form-group'><label for='rateText'>Rate:&nbsp</label><input type='number' class='form-control mr-sm-2' id='rateText' name='rate'/></div>" + timeInputHTML + "</form>";

      rowDistributions.innerHTML = form;

      firebtn.onclick = function () { fireFunction('exp'); };

      showChoose();
    },
      
    showUni = function () {
    
      var form = "<h5 class='col-md-3 col-sm-6 align-left'>Uniform distribution</h5><form class='form-inline col-md-12 col-sm-6 mt-2'><div class='form-group'><label for='aText'>Parameter a:&nbsp</label><input type='number' class='form-control mr-sm-2' id='aText' name='a'/></div><div class='form-group'><label for='bText'>Parameter b:&nbsp</label><input type='number' class='form-control mr-sm-2' id='bText' name='b'/></div>" + timeInputHTML + "</form><p class='info-distr'>Parameters 'a' and 'b' are the initial and final point of the uniform sampling interval</p>";

      rowDistributions.innerHTML = form;

      firebtn.onclick = function () { fireFunction('uni'); };

      showChoose();
    },
      
    showStudentT = function () {
    
      var form = "<h5 class='col-md-3 col-sm-6 align-left'>T-Student distribution</h5><form class='form-inline col-md-12 col-sm-6 mt-2'><div class='form-group'><label for='dofText'>Degrees of Freedom:&nbsp</label><input type='number' class='form-control mr-sm-2' id='dofText' name='dof'/></div>" + timeInputHTML + "</form>";

      rowDistributions.innerHTML = form;

      firebtn.onclick = function () { fireFunction('studentT'); };

      showChoose();
    },
      
    showLinear = function () { 
      
      var form = "<h5 class='col-md-3 col-sm-6 align-left'>Linear growth</h5><p class='info-distr'>'Number of requests' parameter determined automatically for 'Linear growth'</p><form class='form-inline col-md-12 col-sm-6 mt-2'><div class='form-group'><label for='slopeText'>Slope:&nbsp</label><input type='number' class='form-control mr-sm-2' id='slopeText' name='slope'/></div><div class='form-group'><label for='stepText'>Number of steps:&nbsp</label><input type='number' class='form-control mr-sm-2' id='stepText' name='step'/></div>" + timeInputHTML + "</form>";

      rowDistributions.innerHTML = form;

      firebtn.onclick = function () { fireFunction('linear'); };

      showChoose();
    },
      
    showStep = function () { 
      
      var form = "<h5 class='col-md-3 col-sm-6 align-left'>Step function</h5><p class='info-distr'>'Number of requests' parameter determined automatically. 'Time interval' defines the entire duration.</p><form class='form-inline col-md-12 col-sm-6 mt-2'><div class='form-group'><label for='lowText'>Low value:&nbsp</label><input type='number' class='form-control mr-sm-2' placeholder='0' id='lowText' name='lowValue'/></div><div class='form-group'><label for='highText'>High value:&nbsp</label><input type='number' class='form-control mr-sm-2' id='highText' name='highValue'/></div>" + timeInputHTML + "<div class='form-group mt-2'><label for='ratioText'>Ratio:&nbsp</label><input type='number' class='form-control mr-sm-2' placeholder='0 to 1 value' id='ratioText' placeholder='timeHigh/timeLow' name='ratio'/></div><div class='form-group mt-2'><label for='stepText'>Number of steps:&nbsp</label><input type='number' class='form-control mr-sm-2' id='stepText' name='step'/></div><div class='form-group mt-2'><label for='repetitionsText'>Repetitions:&nbsp</label><input type='number' class='form-control mr-sm-2' id='repetitionsText' name='rep'/></div></form>";

      rowDistributions.innerHTML = form;

      firebtn.onclick = function () { fireFunction('step'); };

      showChoose();
    },
  
    showChoose = function () { 
      
      var btn;
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-secondary choose-btn ml-2 mb-2';
      btn.textContent = 'Back';
      btn.onclick = function () { distributionButtonsHTML(); };
    
      rowDistributions.appendChild(btn);
      
      var graph;
      graph = document.createElement('div');
      graph.className = 'row';
      graph.id = 'graph';
      
      el.appendChild(graph);
      
    };
  
  //INITIALIZATION function
  this.build = function () {
    
    //Add CSS style
    setCSS();
    
    //Retrieve array of elements to be clicked
    buttons = document.getElementsByClassName(buttonName);
    //Retrieve container where to append library-generated HTML
    el = document.getElementsByClassName(putMeHere)[0];
    
    //Generate HTML
    //FORM
    //- Number of Requests: number of requests to generate
    //- Selection button: button to click / click randomly through buttons
    row = document.createElement('div');

    el.innerHTML = '';
    row.className = 'row';
    
    var form = document.createElement('form'),
      formHTML,
      i;
    
    form.className = 'form-inline col-md-12 col-sm-6 mt-2';
    
    formHTML = "<div class='form-group'><label for='numClickText'>Number of requests:&nbsp</label><input type='number' class='form-control mr-sm-2' id='numClickText' name='numClick'/></div><div class='form-group'><label for='buttonsSelect'>Button(s):&nbsp</label><div class='input-group mr-sm-2'><select class='custom-select mr-sm-2' id='buttonsSelect' name='buttonNum'>";
    
    for (i = 0; i < buttons.length; i = i + 1) {
      formHTML += "<option value='" + i + "'>" + buttons[i].firstChild.nodeValue + "</option>";
    }
    
    formHTML += "<option selected value='" + buttons.length + "'>Random</option>";
    form.innerHTML = formHTML + "</select></div></div>";
    
    firebtn = document.createElement('button');
    firebtn.className = 'btn btn-info fire-btn';
    firebtn.type = 'button';
    firebtn.textContent = "Fire!";
    
    form.appendChild(firebtn);
    row.appendChild(form);
    el.appendChild(row);
    
    //As DEFAULT (no distribution selected) the Fire button fires all requests together
    firebtn.onclick = defaultFireFunction;
    
    //HTML distributions buttons
    rowDistributions = document.createElement('div');
    rowDistributions.className = 'row';
    el.appendChild(rowDistributions);
    
    distributionButtonsHTML();
    
  };
  
}