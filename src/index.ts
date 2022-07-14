import { updateAllCards, cardFieldsToJson } from "./redditSync/connector";

/* 
  This loads on every end-user loading a board with your app on it (whether your app is clicked on or not)
*/
async function init() {

  // Listen for a click on your app icon and open /app when clicked
  miro.board.ui.on('icon:click', async () => {
    await miro.board.ui.openModal({
      url: 'app.html',
      width: 800,
      height: 600,
      fullscreen: false,
    });
  });
  // Listen for a click on *any* app card 
  miro.board.ui.on('app_card:open', async (event) => {
    // Get the app card that was clicked
    const {appCard} = event;
    // Get all fields on the App Card and turn into JSON object (see redditSync/ folder)
    const appCardJson = await cardFieldsToJson(appCard)
    // Load modal window (/modal) with "url search" param
    // This eludes the 'can't load reddit in a modal window' problem
    const url = `modal.html?url=https://www.reddit.com${appCardJson["URL"]}`;
    // Open /modal on click
    // You can specify more details like size etc. in the object passed to openModal
    miro.board.ui.openModal({
      url,
    });
  });

  // On every user loading the app, update all cards
  updateAllCards()
  // On every user loading the app, check every 35 seconds for updates to the cards
  // This will need to change when you have more users...
  setInterval(updateAllCards, 35000)

}

init();
