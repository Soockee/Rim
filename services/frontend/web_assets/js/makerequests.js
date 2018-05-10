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
      
  //Global variables
    buttons,
    el,
    row,
    rowDistributions,
    firebtn,
  
  //UTILITIES functions
  
  //Retrieve forms data as dictionary
    getDataObj = function () {

      var dataArray = $('form.form-inline').serializeArray(),
        dataObj = {};

      $(dataArray).each(function (i, field) {
        dataObj[field.name] = field.value;
      });

      return dataObj;

    },
  
  //CSS style for the library elements
    setCSS = function () {
    
      var node = document.createElement('style');
      node.innerHTML = ".putMeHere {background:#ffcccc} .distr-button { background:#ff8080; border-color:#ff6666; } .distr-button:focus, .distr-button:hover { background:#ff6666; border-color:#ff6666; outline: none !important; box-shadow: none;} .fire-btn{background:#cc0000; border-color:#b30000;} .fire-btn:focus, .fire-btn:hover {background:#b30000; border-color:#b30000; outline: none !important; box-shadow: none;} .no-bottom-margin {margin-bottom: 0px;}}";
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
      case 'normal':
        for (i = 0; i < dataObj.numClick; i = i + 1) {
          samples.push(jStat.normal.sample(dataObj.mean, dataObj.stdev));
        }
        return samples;
      case 'beta':
        for (i = 0; i < dataObj.numClick; i = i + 1) {
          samples.push(jStat.beta.sample(dataObj.alpha, dataObj.beta));
        }
        return samples;
      case 'chisquare':
        for (i = 0; i < dataObj.numClick; i = i + 1) {
          samples.push(jStat.chisquare.sample(dataObj.dof));
        }
        return samples;
      case 'exp':
        for (i = 0; i < dataObj.numClick; i = i + 1) {
          samples.push(jStat.exponential.sample(dataObj.rate));
        }
        return samples;
      case 'uni':
        for (i = 0; i < dataObj.numClick; i = i + 1) {
          samples.push(jStat.uniform.sample(dataObj.a, dataObj.b));
        }
        return samples;
      case 'studentT':
        for (i = 0; i < dataObj.numClick; i = i + 1) {
          samples.push(jStat.studentt.sample(dataObj.dof));
        }
        return samples;
      case 'linear':
          //TODO
      case 'step':
          //TODO
      default:
        return [];
      }
    
    },
      
    distributionButtonsHTML = function () {
    
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
        i = 0;

      samples.sort((a, b) => a - b);
      //TODO
      //PLOT samples

      init = samples[0];
      samples[0] = 0;
      for (i = 1; i < samples.length; i++) {
        samples[i] = samples[i] - init;
      }

      console.log(samples);

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
    
      var form = "<form class='form-inline col-md-12 col-sm-6 mt-2'><h5 class='col-md-3 col-sm-6 no-bottom-margin'>Normal distribution</h5><div class='form-group'><label for='meanText'>Mean:&nbsp</label><input type='text' class='form-control mr-sm-2' id='meanText' name='mean'/></div><div class='form-group'><label for='stdevText'>Standard Deviation:&nbsp</label><input type='text' class='form-control mr-sm-2' id='stdevText' name='stdev'/></div></form>";

      rowDistributions.innerHTML = form;

      firebtn.onclick = function () { fireFunction('normal'); };

      showChoose();
    },
      
    showBeta = function () {
    
      var form = "<form class='form-inline col-md-12 col-sm-6 mt-2'><h5 class='col-md-3 col-sm-6 no-bottom-margin'>Beta distribution</h5><div class='form-group'><label for='alphaText'>Parameter alpha:&nbsp</label><input type='text' class='form-control mr-sm-2' id='alphaText' name='alpha'/></div><div class='form-group'><label for='betaText'>Parameter beta:&nbsp</label><input type='text' class='form-control mr-sm-2' id='betaText' name='beta'/></div></form>";

      rowDistributions.innerHTML = form;

      firebtn.onclick = function () { fireFunction('beta'); };

      showChoose();
    },
      
    showChiSquare = function () {
    
      var form = "<form class='form-inline col-md-12 col-sm-6 mt-2'><h5 class='col-md-3 col-sm-6 no-bottom-margin'>Chi Square distribution</h5><div class='form-group'><label for='dofText'>Degrees of Freedom:&nbsp</label><input type='text' class='form-control mr-sm-2' id='dofText' name='dof'/></div></form>";

      rowDistributions.innerHTML = form;

      firebtn.onclick = function () { fireFunction('chisquare'); };

      showChoose();
    },
      
    showExp = function () {
    
      var form = "<form class='form-inline col-md-12 col-sm-6 mt-2'><h5 class='col-md-3 col-sm-6 no-bottom-margin'>Exponential distribution</h5><div class='form-group'><label for='rateText'>Rate:&nbsp</label><input type='text' class='form-control mr-sm-2' id='rateText' name='rate'/></div></form>";

      rowDistributions.innerHTML = form;

      firebtn.onclick = function () { fireFunction('exp'); };

      showChoose();
    },
      
    showUni = function () {
    
      var form = "<form class='form-inline col-md-12 col-sm-6 mt-2'><h5 class='col-md-3 col-sm-6 no-bottom-margin'>Uniform distribution</h5><div class='form-group'><label for='aText'>Parameter a:&nbsp</label><input type='text' class='form-control mr-sm-2' id='aText' name='a'/></div><div class='form-group'><label for='bText'>Parameter b:&nbsp</label><input type='text' class='form-control mr-sm-2' id='bText' name='b'/></div></form>";

      rowDistributions.innerHTML = form;

      firebtn.onclick = function () { fireFunction('uni'); };

      showChoose();
    },
      
    showStudentT = function () {
    
      var form = "<form class='form-inline col-md-12 col-sm-6 mt-2'><h5 class='col-md-3 col-sm-6 no-bottom-margin'>T-Student distribution</h5><div class='form-group'><label for='dofText'>Degrees of Freedom:&nbsp</label><input type='text' class='form-control mr-sm-2' id='dofText' name='dof'/></div></form>";

      rowDistributions.innerHTML = form;

      firebtn.onclick = function () { fireFunction('studentT'); };

      showChoose();
    },
      
    showLinear = function () { 
    rowDistributions.innerHTML = '';
    showChoose(); },
      
    showStep = function () { 
    rowDistributions.innerHTML = '';
    showChoose(); },
  
    showChoose = function () { 
      
      var btn;
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-secondary choose-btn ml-2';
      btn.textContent = 'Back';
      btn.onclick = function () { distributionButtonsHTML(); };
      
      rowDistributions.firstChild.appendChild(btn);
      
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
    
    formHTML = "<div class='form-group'><label for='numClickText'>Number of requests:&nbsp</label><input type='text' class='form-control mr-sm-2' id='numClickText' name='numClick'/></div><div class='form-group'><label for='buttonsSelect'>Button(s):&nbsp</label><div class='input-group mr-sm-2'><select class='custom-select mr-sm-2' id='buttonsSelect' name='buttonNum'>";
    
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