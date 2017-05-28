let data = {
  userNameList: ['medrybw', 'lootbndt', 'femfreq', 'freecodecamp'], // -> controller.getAllUserData
  accounts: [], // <- controller.getAllUserData
  currentFilter: 'online',
}

let controller = { // add 'loading' while initial data collection occurs?
  init() {
    this.getAllUserData(data.userNameList);
    view.render(); // need to make this wait until previous call completes
},
  getAllUserData(array) { // only runs on load and page refresh - use local storage?
    array.forEach(function(user) {
      controller.submitQuery('https://cors-anywhere.herokuapp.com/wind-bow.gomix.me/twitch-api/users/' + user).then(function(response) {
		    // localStorage.setItem(user, response)
        let obj = JSON.parse(response);
        data.accounts.push(obj);
      });
    }
  );
},
  appRefresh(){
    // checks data.viewFilters and updates data and view with changes
    // run with controller init and periodically (1 min?) to check for changes 
  },
  submitQuery(apiQuery) { 
    return new Promise(function(resolve,reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', apiQuery);
        xhr.send(null);
        xhr.onload = function() {
            if (xhr.status === 200) {
              // console.log(xhr.response);
                resolve(xhr.response);
            }
            else { // I need better error handling!
                reject(console.log(xhr.status));
            };
        }
      xhr.send
    })
  },
  
}

let view = {
  // render function can be called with different arrays for filtering
  render() {
    let userHTML = _.template(
      // Concatenated for legibility
      '<div class="userBox">' 
        +'<img class="" src="<%=logo%>" />'
        +'<div class="userText">'
        +'<div class="userName"><%=display_name%></div>'
        +'<div class="playing"><%=bio%></div>'
        +'</div><img class="statusIcon" />'
      +'</div>');

  let toAppendString = '';

  // change from the whole object to a subset provided by a map/filter function from controller

  for (i=0; i < data.accounts.length ; i++) {
  toAppendString += userHTML(data.accounts[i]);
}
  document.getElementById('container').insertAdjacentHTML('beforeend', toAppendString);
  }
}

controller.init();

