let data = {
  userNameList: ['medrybw', 'lootbndt', 'femfreq', 'freecodecamp','spitchell', 'madeUp' ], // -> controller.getUserData
  accounts: [
    
  ], // <- controller.getUserData
  currentFilter: 'offline',
}

let controller = { // add 'loading' while initial data collection occurs?
  init() {
    this.createUserObj();
    // this.getUserData(data.userNameList, 'streams');
    // this.getUserData(data.userNameList, 'users'); // 2nd arg = users/streams/channels
    // view.init();
    // view.render(data.accounts); // need to make this wait until previous call completes
},
  createUserObj() { 
      const proxy = 'https://cors-anywhere.herokuapp.com';
      const base = '/wind-bow.gomix.me/twitch-api/';
      data.userNameList.forEach(function(user) {
        let userData = {
          name: user,
          display_name: null,
          logo: 'no-photo.png',
          streaming: false,
          game: null,
          streamImage: null, 
        };

        // need to handle null responses from users query
        controller.submitQuery(proxy + base + 'users/' + user).then(function(response) {
          let apiData = JSON.parse(response);
          userData.display_name = apiData.display_name;
          userData.logo = apiData.logo;
        });

        // I should abstract this into a separate refresh function so it can be called independently
        controller.submitQuery(proxy + base + 'streams/' + user).then(function(response) {
          let streamData = JSON.parse(response);
          console.log(streamData.stream);
          if (!streamData.stream) {
            userData.streaming = false;
            userData.game = 'Not currently streaming';
            userData.streamImage = 'offline.png';
          }
          else {
            userData.streaming = true;
            userData.game = streamData.stream.game;
            userData.streamImage = streamData.stream.preview.medium;
          }
          data.accounts.push(userData);
        })
    })
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
        +'<img class="avatar" src="<%= logo %>" />'
        +'<div class="userText">'
        +'<div class="userName"><%= display_name %></div>'
        +'<div class="playing"><%= game %></div>'
        +'</div><img class="statusIcon" src="<%= streamImage %>" />'
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

