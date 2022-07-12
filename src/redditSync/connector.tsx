export const cardFieldsToJson = async (card: any) => {
    var cardArray = []
    card.fields.forEach((entry: Object) => {
        let fieldValue = entry.value
        const entryArray = fieldValue.split(": ")   
        cardArray.push(entryArray)
    })
    const entryMap = new Map(cardArray)
    return Object.fromEntries(entryMap) 
}

export const updateAllCards = async () => {
    const all_cards = await miro.board.get({
        type: ['app_card'],
      });
    
      const fetcher = await fetch('https://www.reddit.com/r/all.json')
      const reddit_json=await fetcher.json()
    
      console.log(reddit_json.data.children)
    
      all_cards.forEach(async (card) => {
        const fields = await cardFieldsToJson(card)
        console.dir(fields)
        const idx = parseInt(fields["ID"])
        console.log(idx)
        let permalink = reddit_json.data.children[idx].data.permalink
        let upVotes = reddit_json.data.children[idx].data.ups
        card.title = reddit_json.data.children[idx].data.title
        card.fields = []
        card.fields.push({value: "URL: " + permalink})
        card.fields.push({value: "ID: " + idx})
        card.fields.push({value: "Upvotes: " + upVotes})
        card.status = 'connected'
        card.sync()
      })
}
