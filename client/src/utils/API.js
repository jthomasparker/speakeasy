import axios from "axios"
import cookie from 'react-cookies'

export default {

    //gets sentiment based on user input
    getSentiment: userInput => axios.post('/api/sentiment', userInput),

    // adds sentiment/moods to db
    trainSentiment: data => axios.post('/api/sentiment/trainer', data),

    signup: data => axios.post('/auth/signup', data),

    login: data => axios.post('/auth/login', data),

    test: data => axios.post('/auth/test', data),

    getUser: () => {
       return axios.get('/braintrain/', 
        {
            headers: {
                Authorization: "Bearer " + cookie.load('jwtAuthToken')
            }
        }
        )
    },

    createNet: data => axios.post('/create', data),

    trainNet: data => axios.post('/train', data),

    getResult: data => axios.post('/result', data)

}