let data = {
  accounts: [
    {
      userName: 'player x', 
      avatar: './avatarx.jpg',
      status: 'online',
      playing: 'game x'
    },
    {
      userName: 'player y', 
      avatar: './avatary.jpg',
      status: 'online',
      playing: 'game y'
    },
    {
      userName: 'player z', 
      avatar: './avatarz.jpg',
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
    view.render();
  },
  appRefresh(){
    // checks data.viewFilters and updates data and view with changes
    // run with controller init and periodically (1 min?) to check for changes 
  },
  submitQuery(apiQuery) {
    // queries the API 
  },
  
}

let view = {
  // render function can be called with different arrays for filtering
  render() {
    let userHTML = _.template(
      '<div class="userBox">' 
        +'<img class="avatar" />'
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

