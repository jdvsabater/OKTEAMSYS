(function(){
    const messageOne = 'Incorrect Passcode or Account Number';
    const messageTwo = 'No Registered Account';
    var errVue = new Vue({
        el: '#mainLogin',
        data: {
          accNumber : null,
          passcode : null,
          errMsg: []
         },
         errors: {
            
         }
    });
    console.log(errVue);
  })();