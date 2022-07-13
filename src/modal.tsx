import * as React from 'react';
import {createRoot} from 'react-dom/client';


function App() {
  React.useEffect(() => {
    // Get the params from the search string
    const queryParams = new URLSearchParams(window.location.search)
    // The "url" param is passed to the button href to continue user on to their site
    const term = queryParams.get("url")
    if (term)  {
      // Set this in state and refersh component 
      setUrl(term)
    }
  }, []);

  const [url, setUrl] = React.useState("#");


  return (
    <div className="grid wrapper">
      <div>
          <a
          className="button button-primary"
          href={url}
          onClick={async () => { await miro.board.ui.closeModal(); }} // Close the modal when you're done clicking
          target="_new"
          >
          Click to view on reddit.com...
          </a>
      </div>  
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
