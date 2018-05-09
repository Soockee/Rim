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
  //varName: name given to the MakeRequests instance
  var buttonName = opt.buttonClassName,
    putMeHere = opt.putMeHereClassName,
    varName = opt.varName,
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
  
  //Retrieve forms data as dictionary
  var getDataObj = function () {
    
    var dataArray = $('form.form-inline').serializeArray(),
      dataObj = {};

    $(dataArray).each(function (i, field) {
      dataObj[field.name] = field.value;
    });
    
    return dataObj;
    
  };
  
  //CSS style for the library elements
  var setCSS = function () {
    
    var node = document.createElement('style');
    node.innerHTML = ".putMeHere {background:#ffcccc} .distr-button { background:#ff8080; border-color:#ff6666; } .distr-button:focus, .distr-button:hover { background:#ff6666; border-color:#ff6666; outline: none !important; box-shadow: none;} .fire-btn{background:#cc0000; border-color:#b30000;} .fire-btn:focus, .fire-btn:hover {background:#b30000; border-color:#b30000; outline: none !important; box-shadow: none;} .no-bottom-margin {margin-bottom: 0px;}}";
    document.body.appendChild(node);
    
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
    
    this.distributionButtonsHTML();
    
  };
  
  
  this.distributionButtonsHTML = function () {
    
    var builtHTML = '',
      init = "<button type='button' class='btn btn-primary ml-2 mb-2 distr-button ",
      end = "</button>";
    
    if (normal) { builtHTML += init + "normal-btn' onclick='" + varName + ".showNormal()'>Normal" + end; }
    if (beta) { builtHTML += init + "beta-btn' onclick='makeRequests.showBeta()'>Beta" + end; }
    if (chisquare) { builtHTML += init + "chisquare-btn' onclick='" + varName + ".showChiSquare()'>Chi Square" + end; }
    if (exponential) { builtHTML += init + "exp-btn' onclick='" + varName + ".showExp()'>Exponential" + end; }
    if (uniform) { builtHTML += init + "uni-btn' onclick='" + varName + ".showUni()'>Uniform" + end; }
    if (studentt) { builtHTML += init + "studentt-btn' onclick='" + varName + ".showStudentT()'>T-Student" + end; }
    if (linear) { builtHTML += init + "linear-btn' onclick='" + varName + ".showLinear()'>Linear" + end; }
    if (stepFunction) { builtHTML += init + "step-btn' onclick='" + varName + ".showStep()'>Step function" + end; }
    
    rowDistributions.innerHTML = builtHTML;
    
  };
  
  this.showNormal = function () {
    
    var form = "<form class='form-inline col-md-12 col-sm-6 mt-2'><h5 class='col-md-3 col-sm-6 no-bottom-margin'>Normal distribution</h5><div class='form-group'><label for='meanText'>Mean:&nbsp</label><input type='text' class='form-control mr-sm-2' id='meanText' name='mean'/></div><div class='form-group'><label for='stdevText'>Standard Deviation:&nbsp</label><input type='text' class='form-control mr-sm-2' id='stdevText' name='stdev'/></div></form>";
    
    rowDistributions.innerHTML = form;
    
    firebtn.onclick = function() {fireFunction('normal', buttons)};
    
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
    rowDistributions.innerHTML += "<button type='button' class='btn btn-secondary choose-btn ml-2 mb-2' onClick='" + varName + ".distributionButtonsHTML()'>Back</button>";
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
  
  var defaultFireFunction = function () {
      
      console.log("Fire");
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
      
  };
  
  var fireFunction = function (distribution, buttons) {
        
    var dataObj = getDataObj(),
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
   
}