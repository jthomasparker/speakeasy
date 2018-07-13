import axios from "axios"

export default {

    //gets sentiment based on user input
    getSentiment: userInput => axios.post('/api/sentiment', userInput),

    trainSentiment: data => axios.post('/api/sentiment/trainer', data)
}