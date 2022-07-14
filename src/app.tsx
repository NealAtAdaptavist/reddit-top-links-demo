import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { updateAllCards,createRedditCard } from './redditSync/connector';


// Listen for button click, then count the number of app cards on the board
// Create the next higher index and add a card with that index value
// In practice, this should search for only the cards _you've_ created...
async function addNewRedditCard() {
  const all_cards = await miro.board.get({
    type: ['app_card'],
  });
  const length_of_cards = all_cards.length;
  createRedditCard(length_of_cards.toString());
}

function App() {
  const [cards, setCards] = React.useState([]);
  const [selectedResults, setSelectedResults] = React.useState([]);

  const search = async (query: any) => {
    // console.log(query);
    const queryString = `https://www.reddit.com/r/all/search.json?q=${query}&restrict_sr=off&sort=relevance&t=all`;
    const fetcher = await fetch(queryString, {
      method: 'GET',
    });
    // console.log(fetcher.status);
    const jsonResponse = await fetcher.json();
    // console.log(jsonResponse);
    setCards(jsonResponse.data.children);
  };


  const handleSubmit = (e: any) => {
    e.preventDefault();
    selectedResults.forEach((result) => {
      createRedditCard(result);
    });
  };

  const handleOnChange = (e: any) => {
    if (e.target.checked && !selectedResults.find((id) => id === e.target.id)) {
      setSelectedResults([...selectedResults, e.target.id]);
    }

    if (!e.target.checked && selectedResults.includes(e.target.id)) {
      setSelectedResults(selectedResults.filter((id) => id !== e.target.id));
    }
  };

  return (
    <div>
      <form
        onSubmit={(e: any) => {
          e.preventDefault();
          search(e.target.value);
        }}
      >
        <label>Search</label>
        <input type="text" />
        <button type="submit">Search</button>
      </form>
      <div>
        <form onSubmit={handleSubmit}>
          <button type="submit">Add</button>
          {cards.map((card, i) => {
            console.log(card.data);
            return (
              <div key={card.data.id}>
                <div>{card.data?.title}</div>
                <div>
                  <input id={card.data.id} type="checkbox" onChange={handleOnChange} />
                </div>
              </div>
            );
          })}
        </form>
      </div>
      <div>
        <button className="button button-primary" onClick={addNewRedditCard}>
          Add another Card
        </button>
      </div>
      <br />
      <div>
        <button
          className="button button-primary"
          onClick={updateAllCards} //Manually update cards on board
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
