// makerequests.js
// LIBRARY CLASS 

function MakeRequests(opt) {
  
  //Config
  var buttonName = opt.buttonClassName,
    putMeHere = opt.putMeHereClassName,
    //Functions config
    gaussian = false,
    linear = false,
    stepFunction = false,
    chi = false;
  
  this.build = function () {

    var buttons = document.getElementsByClassName(buttonName),
      el = document.getElementsByClassName(putMeHere)[0],
      row = document.createElement('div');
    
    el.innerHTML = '';
    row.className = 'row';
    row.innerHTML = "<div class='col-md-6 col-sm-12'> <form class='form-inline'><label>Number of requests:&nbsp</label><input type='text' name='numClick'/></div><div class='col-md-3 col-sm-6'><center><span class='btn btn-info btn-block fire-btn'>Fire!</span></center></form></div>";
    el.appendChild(row);

    var firebtn = document.getElementsByClassName('fire-btn')[0];
    firebtn.onclick = function () {
      
      var dataArray = $('form.form-inline').serializeArray(),
        dataObj = {};
      
      $(dataArray).each(function (i, field) {
        dataObj[field.name] = field.value;
      });
      
      var i;
      for (i = 0; i < dataObj.numClick; i++) {
        buttons[Math.floor((Math.random() * 3))].click();
      }
      
    };
    
    //var i;
    //for (i = 0; i < buttons.length; i++) {
    //}

    //alert(jStat.normal.sample(22,40,20));
  
  };
   
}