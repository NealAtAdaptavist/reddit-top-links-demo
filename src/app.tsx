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
    const queryString = `https://www.reddit.com/r/all/search.json?q=${query}&restrict_sr=off&sort=relevance&t=link&limit=5`;
    const fetcher = await fetch(queryString, {
      method: 'GET',
    });
    // console.log(fetcher.status);
    const jsonResponse = await fetcher.json();
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

  const renderButton = () => {
    return <button 
    type="submit"          
    >Add to Board</button>
  }

  return (
    <div>
      <h1>Search for Reddit Posts</h1>
      <form
        onSubmit={(e: any) => {
          e.preventDefault();
          search(e.target[0].value);
        }}
      >        
        <input type="text" />
        <button type="submit">Search</button>
      </form>
      <div>
        <form onSubmit={handleSubmit}>
          {
             cards.length > 0 ? renderButton() : null
          }
          {cards.map((card, i) => {
            console.log(card.data);
            return (
              <div key={card.data.name}>
                <div>{card.data?.title}</div>
                <div>
                  <input id={card.data.name} type="checkbox" onChange={handleOnChange} />
                </div>
              </div>
            );
          })}
        </form>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
