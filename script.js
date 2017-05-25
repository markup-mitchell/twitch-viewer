
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
}

// controller.init();