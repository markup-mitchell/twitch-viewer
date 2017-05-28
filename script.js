let data = {
  userNameList: ['medrybw', 'lootbndt', 'femfreq', 'freecodecamp'],

  accounts: [
    {
      userName: 'Feminist Frequency', 
      avatar: ' http://www.iconninja.com/files/746/262/492/invader-space-invaders-space-invaders-game-icon.png',
      status: 'online',
      playing: 'game x'
    },
    {
      userName: 'Lootbndt', 
      avatar: 'http://www.iconninja.com/files/610/604/984/invader-space-invaders-space-invaders-game-icon.png',
      status: 'online',
      playing: 'game y'
    },
    {
      userName: ' z', 
      avatar : 'http://www.iconninja.com/files/427/364/992/game-invader-space-invaders-space-invaders-icon.png',
      status: 'offline',
      playing: 'game z'
    },
  ],

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
        console.log(obj);
        data.accounts.userName = obj.display_name;
        data.accounts.avatar = obj.logo;
        data.accounts.status = 'offline';
        data.accounts.playing = 'placeholder';
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
        +'<img class="" src="<%=avatar%>" />'
        +'<div class="userText">'
        +'<div class="userName"><%= userName %></div>'
        +'<div class="playing"><%= playing %></div>'
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

