import * as React from 'react';
import {createRoot} from 'react-dom/client';
import { updateAllCards } from "./redditSync/connector";

/*
  Create an AppCard by searching reddit (https://www.reddit.com/r/all.json)
*/
const createRedditCard = async (idx: string) => {
  // The app card is loaded with some default text and size, this can be improved
  // Things to add: specific color? size? 
  const appCard = await miro.board.createAppCard({
    title: "Loading",
    x: 2000,
    y: 2000,
    width: 320,
    rotation: 0.0,
    status: 'connected', // Default status of new app cards: 'disconnected'
  });
  // With the appCard created, update the id field
  // The ID field is used to reference which 'top' entry from reddit to show
  // i.e. id=0 is the current top reddit post, id=1 is second most popular etc. 
  if (appCard.fields !== undefined) {
    appCard.fields.push({value: "ID: " + idx});
    // Sync the field changes to the card
    appCard.sync()
  }
  // Run update on all cards
  // For the card you just created, this will look at the index of the card and update with current details
  updateAllCards()

}

// Listen for button click, then count the number of app cards on the board
// Create the next higher index and add a card with that index value
// In practice, this should search for only the cards _you've_ created...
async function addNewRedditCard() {
  const all_cards = await miro.board.get({
    type: ['app_card'],
  });
  const length_of_cards = all_cards.length
  createRedditCard(length_of_cards.toString())
  
}

function App() {

  return (
    <div >
      <div>
          <button
          className="button button-primary"
          onClick={addNewRedditCard}
          >
          Add another Card
          </button>
      </div>  
      <br />
      <div>
          <button
          className="button button-primary"
          onClick={updateAllCards}  //Manually update cards on board
          >
          Update Card Details
          </button>
      </div> 
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
