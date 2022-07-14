// Convert fields array on the card object to a set of key/value pairs in JSON
  // This uses the convention of ": " as a string split, left side of the split is the key, right is value
  // There's no way currently to create a 'proper' key value store against it
  export const cardFieldsToJson = async (card: any) => {
    var cardArray = [];
    card.fields.forEach((entry: Object) => {
      let fieldValue = entry.value;
      const entryArray = fieldValue.split(': ');
      cardArray.push(entryArray);
    });
    const entryMap = new Map(cardArray);
    return Object.fromEntries(entryMap);
  };
  // Update all cards with current data from reddit
 export const updateAllCards = async () => {
    // Get all app_cards on the board
    // This should be improved to only get App Cards we created
    const all_cards = await miro.board.get({
      type: ['app_card'],
    });
    // Pull top links in JSON format from r/all
    const fetcher = await fetch('https://www.reddit.com/r/all.json');
    const reddit_json = await fetcher.json();
    // Iterate through all App Cards
    all_cards.forEach(async (card) => {
      // Convert the fields of the App Card to JSON
      const fields = await cardFieldsToJson(card);
      // Retrieve the index field
      const idx = parseInt(fields['ID']);
      // Retrieve the reddit result for the index of the app card
      // Permalink => /r/all/somethingsomething
      let permalink = reddit_json.data.children[idx].data.permalink;
      // Current upvotes for the reddit post
      let upVotes = reddit_json.data.children[idx].data.ups;
      // Set the card title to the post title
      card.title = reddit_json.data.children[idx].data.title;
      // Reset the card fields
      card.fields = [];
      // Add back the ID, URL and Upvotes
      card.fields.push({ value: 'URL: ' + permalink });
      card.fields.push({ value: 'ID: ' + idx });
      card.fields.push({ value: 'Upvotes: ' + upVotes });
      // Default state of an app card is disconnected, set to connected instead
      card.status = 'connected';
      // Sync the changes
      card.sync();
    });
  };
 export const createRedditCard = async (redditObject: any) => {
    // The app card is loaded with some default text and size, this can be improved
    // Things to add: specific color? size?
    await miro.board.createAppCard({
      title: '',
      x: 0,
      y: 0,
      width: 320,
      rotation: 0.0,
      status: 'connected', // Default status of new app cards: 'disconnected',
      fields: [
        //   {
        //     value: "URL: " + redditObject.permalink,
        //     fillColor: '#FBE983',
        //     textColor: '#F83A22'
        //   },
        {
          value: 'ID: ' + redditObject,
          fillColor: '#F8D878',
          textColor: '#503000',
        },
        //   {
        //     value: "Upvotes: " + redditObject.ups,
        //     iconShape: 'square',
        //     fillColor: '#E5E5E5',
        //     textColor: '#000000'
        //   },
      ],
    });
  };