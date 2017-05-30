let data = {
  userNameList: ['medrybw', 'lootbndt', 'femfreq', 'freecodecamp','spitchell', ], // -> controller.getUserData
  accounts: [], // <- controller.getUserData
  currentFilter: 'offline',
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
          data[user].stream = obj;
        }
        else {
        data[user] = obj;
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

  filterUsers() { // this is truly horrible
    if (data.currentFilter === 'offline') {
      return data.accounts.filter(function(user) {
        return data[user.name] === data.currentFilter;
      });
    }
    else if (data.currentFilter === 'online') {
      return data.accounts.filter(function(user) {
        return data[user.name] !== 'offline';
      })
    }
    else {
      return data.accounts;
    }
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
    this.render(data.accounts);
  },
  // render function can be called with different arrays for filtering
  render(userArray) {
    let userHTML = _.template(
      // Concatenated for legibility
      '<div class="userBox">' 
        +'<img class="avatar" src="<%=logo%>" />'
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

