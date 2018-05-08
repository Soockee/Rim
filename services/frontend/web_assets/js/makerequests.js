// makerequests.js
// LIBRARY CLASS 

// REQUIREMENTS
// - jquery.js
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
    beta = true, //false,
    chisquare = true, //false,
    exponential = true, //false,
    normal = true, //false,
    studentt = true, //false,
    uniform = true, //false,
    linear = true, //false,
    stepFunction = true; //false;
  
  //Global variables
  var buttons,
    el,
    row,
    rowDistributions,
    firebtn;
  
  //UTILITIES functions
  var getDataObj = function () {
    
    var dataArray = $('form.form-inline').serializeArray(),
      dataObj = {};

    $(dataArray).each(function (i, field) {
      dataObj[field.name] = field.value;
    });
    
    return dataObj;
    
  };
  
  //INITIALIZATION function
  this.build = function () {
    
    this.setCSS();

    buttons = document.getElementsByClassName(buttonName);
    el = document.getElementsByClassName(putMeHere)[0];
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
    
    firebtn.onclick = function () {
      
      var dataObj = getDataObj();

      if (dataObj.buttonNum === buttons.length) {
        for (i = 0; i < dataObj.numClick; i = i + 1) {
          buttons[Math.floor((Math.random() * 3))].click();
        }
      } else {
        for (i = 0; i < dataObj.numClick; i = i + 1) {
          buttons[dataObj.buttonNum].click();
        }
      }
      
    };
    
    rowDistributions = document.createElement('div');
    rowDistributions.className = 'row';
    el.appendChild(rowDistributions);
    
    this.distributionButtonsHTML();
    
  };
  
  this.distributionButtonsHTML = function () {
    
    var builtHTML = '',
      init = "<button type='button' class='btn btn-primary ml-2 mb-2 distr-button ",
      end = "</button>";
    
    if (normal) { builtHTML += init + "normal-btn' onClick='makeRequests.showNormal()'>Normal" + end; }
    if (beta) { builtHTML += init + "beta-btn' onClick='makeRequests.showBeta()'>Beta" + end; }
    if (chisquare) { builtHTML += init + "chisquare-btn' onClick='makeRequests.showChiSquare()'>Chi Square" + end; }
    if (exponential) { builtHTML += init + "exp-btn' onClick='makeRequests.showExp()'>Exponential" + end; }
    if (uniform) { builtHTML += init + "uni-btn' onClick='makeRequests.showUni()'>Uniform" + end; }
    if (studentt) { builtHTML += init + "studentt-btn' onClick='makeRequests.showStudentT()'>T-Student" + end; }
    if (linear) { builtHTML += init + "linear-btn' onClick='makeRequests.showLinear()'>Linear" + end; }
    if (stepFunction) { builtHTML += init + "step-btn' onClick='makeRequests.showStep()'>Step function" + end; }
    
    rowDistributions.innerHTML = builtHTML;
    
  };
  
  this.showNormal = function () {
    
    var form = "<form class='form-inline col-md-12 col-sm-6 mt-2'><h5 class='col-md-3 col-sm-6 no-bottom-margin'>Normal distribution</h5><div class='form-group'><label for='meanText'>Mean:&nbsp</label><input type='text' class='form-control mr-sm-2' id='meanText' name='mean'/></div><div class='form-group'><label for='stdevText'>Standard Deviation:&nbsp</label><input type='text' class='form-control mr-sm-2' id='stdevText' name='stdev'/></div></form>";
    
    rowDistributions.innerHTML = form;
    
    firebtn.onclick = fireFunction('normal', buttonName);
    
    this.showChoose();
    
  };
  this.showBeta = function () {
    rowDistributions.innerHTML = '';
    this.showChoose(); };
  this.showChiSquare = function () { 
    rowDistributions.innerHTML = '';
    this.showChoose(); };
  this.showExp = function () { 
    rowDistributions.innerHTML = '';
    this.showChoose(); };
  this.showUni = function () { 
    rowDistributions.innerHTML = '';
    this.showChoose(); };
  this.showStudentT = function () { 
    rowDistributions.innerHTML = '';
    this.showChoose(); };
  this.showLinear = function () { 
    rowDistributions.innerHTML = '';
    this.showChoose(); };
  this.showStep = function () { 
    rowDistributions.innerHTML = '';
    this.showChoose(); };
  
  this.showChoose = function () { 
    rowDistributions.innerHTML += "<button type='button' class='btn btn-secondary choose-btn ml-2 mb-2' onClick='makeRequests.distributionButtonsHTML()'>Back</button>";
  };
  
  var generateSamples = function (distribution, dataObj) {
    
    var samples = [],
      i = 0;
      
    switch(distribution) {
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
    
  };
  
  var fireFunction = function (distribution, buttonName) {
        
    var buttons = document.getElementsByClassName(buttonName),
        dataObj = getDataObj(),
        samples = generateSamples(distribution, dataObj),
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
    
  };
      
  this.setCSS = function () {
    
    var node = document.createElement('style');
    node.innerHTML = ".putMeHere {background:#ffcccc} .distr-button { background:#ff8080; border-color:#ff6666; } .distr-button:focus, .distr-button:hover { background:#ff6666; border-color:#ff6666; outline: none !important; box-shadow: none;} .fire-btn{background:#cc0000; border-color:#b30000;} .fire-btn:focus, .fire-btn:hover {background:#b30000; border-color:#b30000; outline: none !important; box-shadow: none;} .no-bottom-margin {margin-bottom: 0px;}}";
    document.body.appendChild(node);
    
  };
  
   
}