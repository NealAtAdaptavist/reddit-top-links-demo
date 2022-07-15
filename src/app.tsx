import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { updateAllCards,createRedditCard } from './redditSync/connector';
import './assets/index.css'


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
    const queryString = `https://www.reddit.com/r/all/search.json?q=${query}&restrict_sr=off&sort=relevance&t=link&limit=10`;
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
    updateAllCards()
    miro.board.ui.closeModal()
  };

  // const handleOnChange = (e: any) => {
  //   if (e.target.checked && !selectedResults.includes(e.target.id)) {
  //     setSelectedResults([...selectedResults, e.target.id]);
  //   }

  //   if (!e.target.checked && selectedResults.includes(e.target.id)) {
  //     setSelectedResults(selectedResults.filter((id) => id !== e.target.id));
  //   }
  // };

  const handleOnClick = (e: any) => {
    if (!selectedResults.includes(e.currentTarget.id)) setSelectedResults([...selectedResults, e.currentTarget.id])
    else setSelectedResults(selectedResults.filter((id) => id !== e.currentTarget.id))
  }


  const renderButton = () => {
    return <button className='bg-blue-600 text-white px-3 py-2 rounded-md font-bold text-sm' 
    type="submit"          
    >Add to Board</button>
  }

  return (
    <div className='overflow-scroll h-[700px] px-2'>
      <h1 className='text-3xl mb-4 font-bold'>Search for Reddit Posts</h1>
      <form
        onSubmit={(e: any) => {
          e.preventDefault();
          search(e.target[0].value);
        }}
      >        
        <input type="text" className='outline outline-1 rounded-md mr-2 px-2 py-1 w-1/2 mb-6'/>
        <button type="submit" className='bg-blue-600 text-white px-3 py-2 rounded-md font-bold text-sm'>Search</button>
      </form>
      <div>
        <form onSubmit={handleSubmit} >
        {
             cards.length > 0 ? renderButton() : null
        }  
          {cards.map((card, i) => {
            console.log(card.data.name);
            
            return (
              <div key={card.data.name + 'key'} id={card.data.name} style={ selectedResults.includes(card.data.name) ? {backgroundColor: '#2563eb', color: 'white'} : {backgroundColor: '#eff6ff'} } onClick={handleOnClick} className="flex justify-between w-full hover:shadow-lg hover:scale-105 transition-all duration-150 ease-in-out rounded-md bg-indigo-50 mb-4 p-4 cursor-pointer mr-2 ">
                {/* <img src={card.data.thumbnail} width='50px' className='rounded-md mr-3'/> */}
                <div>{card.data?.title}</div>
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
