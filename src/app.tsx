import * as React from 'react';
import {createRoot} from 'react-dom/client';
import { updateAllCards } from "./redditSync/connector";


const createRedditCard = async (idx: string, path: String, title: string) => {

  const appCard = await miro.board.createAppCard({
    title: title,
    x: 2000,
    y: 2000,
    width: 320,
    rotation: 0.0,
    status: 'connected', // Default status of new app cards: 'disconnected'
  });
  if (appCard.fields !== undefined) {
    appCard.fields.push({value: "ID: " + idx});
    appCard.sync()
  }
  updateAllCards()
  await miro.board.viewport.zoomTo(appCard);

}

async function addSticky() {
  const all_cards = await miro.board.get({
    type: ['app_card'],
  });
  const length_of_cards = all_cards.length
  createRedditCard(length_of_cards.toString(), "Loading", "...")
  
}

function App() {

  return (
    <div >
      <div>
          <button
          className="button button-primary"
          onClick={addSticky}
          >
          Add another Card
          </button>
      </div>  
      <br />
      <div>
          <button
          className="button button-primary"
          onClick={updateAllCards}
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
