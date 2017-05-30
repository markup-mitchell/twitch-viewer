let data = {
  userNameList: ['medrybw', 'lootbndt', 'femfreq', 'freecodecamp','spitchell', ], // -> controller.getUserData
  accounts: {}, // <- controller.getUserData
  currentFilter: 'all',

}

let controller = { // add 'loading' while initial data collection occurs?
  init() {
    this.getUserData(data.userNameList, 'users'); // 2nd arg = users/streams/channels
    this.getUserData(data.userNameList, 'streams');
    view.init();
    // view.render(data.accounts); // need to make this wait until previous call completes
},
  getUserData(array, query) { // only runs on load and page refresh - use local storage?
    array.forEach(function(user) {
      controller.submitQuery('https://cors-anywhere.herokuapp.com/wind-bow.gomix.me/twitch-api/' + query + "/" + user).then(function(response) {
        let obj = JSON.parse(response);
        if (query === 'streams') { // this feels hacky. should be currying, probably
          console.log(obj);
          data.accounts[user].stream = obj; // appends stream obj to user obj
        }
        else {
        data.accounts[user] = obj; // creates or overwrites user obj.
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

  filterUsers() { 
    let all = Object.keys(data.accounts);
    let results = [];

    if (data.currentFilter === 'all') {
      all.forEach(function(userName) {
        results.push(data.accounts[userName])
      })
      console.log(results);
    }
    else if (data.currentFilter === 'online'){
      all.forEach(function(userName) {
        debugger;
        if (data.accounts[userName].stream.stream) {
          results.push(data.accounts[userName])
        }
      })
      console.log(results);
    }
    else {
      all.forEach(function(userName) {
        if (!data.accounts[userName].stream.stream) {
          results.push(data.accounts[userName])
        }
      })
      console.log(results);
    }
    return results;
  },

  applyFilter(element) {
    let filter = element.id;
    data.currentFilter = filter;
    view.render(this.filterUsers());
  }
}

let view = {
  init() {
    this.display = document.getElementById('container');
    // this.render(data.accounts);
  },
  // render function can be called with different arrays for filtering
  render(userArray) { // array of OBJECTS
    let userHTML = _.template( // Concatenated for legibility
      '<div class="userBox">' 
        +'<img class="avatar" src="<%=  logo%>" />'
        +'<div class="userText">'
        +'<div class="userName"><%=display_name%></div>'
        +'<div class="playing"><%=data[name]%></div>'
        +'</div><img class="statusIcon" src="<%=data[name]%>.png" />'
      +'</div>');
    let toAppendString = '';
    view.clear();
    for (i=0; i < userArray.length ; i++) {
      toAppendString += userHTML(userArray[i]);
    }
    this.display.insertAdjacentHTML('beforeend', toAppendString);
  },

  clear() {
    while (this.display.firstChild){
      this.display.removeChild(this.display.firstChild);
    }

  }

}

controller.init();

