import { updateAllCards, cardFieldsToJson } from "./redditSync/connector";

async function init() {
  miro.board.ui.on('icon:click', async () => {
    await miro.board.ui.openPanel({url: 'app.html'});
  });

  miro.board.ui.on('app_card:open', async (event) => {
    console.log('Subscribed to app card open event', event);
    const {appCard} = event;
    const appCardJson = await cardFieldsToJson(appCard)
    console.log(appCardJson)
    // Fetch a specific app card by specifying its ID
    const url = `modal.html?url=https://www.reddit.com${appCardJson["URL"]}`;
  
    // Open the modal to display the content of the fetcd app card
    miro.board.ui.openModal({
      url,
    });
  });

  updateAllCards()
  setInterval(updateAllCards, 350000)

}

init();
