let data = {
  userNameList: ['medrybw', 'lootbndt', 'femfreq', 'freecodecamp'], // -> controller.getUserData
  accounts: [], // <- controller.getUserData
  currentFilter: 'online',
}

let controller = { // add 'loading' while initial data collection occurs?
  init() {
    this.getUserData(data.userNameList, 'users'); // 2nd arg = users/streams/channels
    this.getUserData(data.userNameList, 'streams');
    // this.getUserStreams(data.userNameList, 'streams');
    view.render(); // need to make this wait until previous call completes
},
  getUserData(array, query) { // only runs on load and page refresh - use local storage?
    array.forEach(function(user) {
      controller.submitQuery('https://cors-anywhere.herokuapp.com/wind-bow.gomix.me/twitch-api/' + query + "/" + user).then(function(response) {
        let obj = JSON.parse(response);
        if (query === 'streams') {
          console.log(obj);
          data[user] = obj.stream ? obj.stream.game : 'offline';
        }
        else {
        data.accounts.push(obj);
        };
      });
    }
  );
},

  submitQuery(apiQuery) { // for all api calls. adapt apiQuery with an intermediary function 
    return new Promise(function(resolve,reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', apiQuery);
        xhr.send(null);
        xhr.onload = function() {
            if (xhr.status === 200) {
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

