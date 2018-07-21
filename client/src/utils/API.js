import axios from "axios"
import cookie from 'react-cookies'

export default {

    //gets sentiment based on user input
    getSentiment: userInput => axios.post('/api/sentiment', userInput),

    // adds sentiment/moods to db
    trainSentiment: data => axios.post('/api/sentiment/trainer', data),
    // creates user
    signup: data => axios.post('/auth/signup', data),
    // logs in user
    login: data => axios.post('/auth/login', data),
    // just a test call
    test: data => axios.post('/auth/test', data),
    // checks a user's authentication cookie
    getUser: () => {
       return axios.get('/braintrain/', 
        {
            headers: {
                Authorization: "Bearer " + cookie.load('jwtAuthToken')
            }
        }
        )
    },
    // creates a user's brain
    createNet: data => axios.post('/create', data),
    // trains a user's brain
    trainNet: data => axios.post('/train', data),
    // gets a result from a user's brain
    getResult: data => axios.post('/result', data),
    // loads all the user's brains
    loadNets: () => axios.get('/load')

}