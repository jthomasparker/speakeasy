import axios from "axios"

export default {

    //gets sentiment based on user input
    getSentiment: (userInput) => axios.post('/api/sentiment', userInput)
}