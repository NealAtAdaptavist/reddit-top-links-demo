import * as React from 'react';
import {createRoot} from 'react-dom/client';


function App() {
  React.useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const term = queryParams.get("url")
    if (term)  {
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
          onClick={async () => { await miro.board.ui.closeModal(); }}
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
