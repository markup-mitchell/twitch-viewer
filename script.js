let data = {
  userNameList: ['medrybw', 'lootbndt', 'femfreq', 'freecodecamp'],

  accounts: [],

  currentFilter: 'online',
  
  // accounts - array?
  // view filter status
}

let controller = {

  init() {
    this.getAllUserData(data.userNameList);
    view.render();
    this.submitQuery('https://cors-anywhere.herokuapp.com/wind-bow.gomix.me/twitch-api/streams/medrybw').then(function(response) {
      console.log(JSON.parse(response));
  });
},
  getAllUserData(array) {
    array.forEach(function(user) {
      controller.submitQuery('https://cors-anywhere.herokuapp.com/wind-bow.gomix.me/twitch-api/users/' + user).then(function(response) {
		    // localStorage.setItem(user, response)
        let obj = JSON.parse(response);
        data.accounts.push(obj);
      });
    }
  )
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
            else {
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

