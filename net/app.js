const AsyncClassifier = require('../async-classifier/async-classifier.js')
const Sentiment = require('sentiment')
sentiment = new Sentiment();
const rtNetFiles = [
    './net/trainedNets/one.json', './net/trainedNets/two.json', './net/trainedNets/three.json', 
    './net/trainedNets/four.json', './net/trainedNets/five.json', './net/trainedNets/six.json', 
    './net/trainedNets/seven.json', './net/trainedNets/eight.json', './net/trainedNets/nine.json', 
    './net/trainedNets/ten.json'
]

const twitterNetFiles = [
    './net/trainedNets/twitterOne.json', './net/trainedNets/twitterTwo.json', './net/trainedNets/twitterThree.json', 
    './net/trainedNets/twitterFour.json', './net/trainedNets/twitterFive.json'
]

const amazonNetFiles = [
    './net/trainedNets/amazonOne.json', './net/trainedNets/amazonTwo.json', './net/trainedNets/amazonThree.json', 
    './net/trainedNets/amazonFour.json', './net/trainedNets/amazonFive.json'
] 

const moodClassifer = new AsyncClassifier()
const customClassifier = new AsyncClassifier()

let allNets = {
    rtNets: [],
    twitterNets: [],
    amazonNets: []
}




module.exports = {
    loadNets: () => {
        allNets.rtNets = rtNetFiles.map(filePath => {
            let classifier = new AsyncClassifier()
            classifier.restore(filePath)
            return classifier
        })

        allNets.twitterNets = twitterNetFiles.map(filePath => {
            let classifier = new AsyncClassifier()
            classifier.restore(filePath)
            return classifier
        })

        allNets.amazonNets = amazonNetFiles.map(filePath => {
            let classifier = new AsyncClassifier()
            classifier.restore(filePath)
            return classifier
        })

        moodClassifer.restore('./net/trainedNets/moodClassifier.json')
        customClassifier.restore('./net/trainedNets/customSentiment.json')

    },
    getSentiment: (req, res) => {
        console.log(req.body)
        let userInput = req.body.userInput
        let allResults = {
            allNets: {
                description: "All of the trained nets combined"
            },
            rotTom: {
                description: "Nets trained on Rotten Tomatoes movie reviews",
                dataSetCredit: `'Recursive Deep Models for Semantic Compositionality Over a Sentiment Treebank', Richard Socher, Alex Perelygin, Jean Wu, Jason Chuang, Christopher Manning, Andrew Ng and Christopher Potts`
            },
            twitter: {
                description: "Nets trained on Twitter data",
                dataSetCredit: ""
            },
            reviews: {
                description: "Nets trained on Amazon/IMDB/Yelp reviews",
                dataSetCredit: `'From Group to Individual Labels using Deep Features', Kotzias et. al,. KDD 2015`
            },
            jaz: {
                description: "A single net trained on input data speakeasy's creators",
                dataSetCredit: "Josh Parker, Alexandra Peralta, Zarah Parker"
            },
            sentimentNpm: {
                description: "Sentiment analysis from the Sentiment node package",
                dataSetCredit: "https://github.com/thisandagain/sentiment"
            } 
        }
        let rtSum = 0
        let twitterSum = 0
        let amazonSum = 0
        let totalSum = 0

        let allPositive = []
        let allNegative = []


        allResults.rotTom.data = allNets.rtNets.map(classifier => {
            let result = classifier.getTopResult(userInput)
            if(result.confidence < .5){
                allNegative.push(result.confidence)
            } else {
                allPositive.push(result.confidence)
            }
            rtSum += result.confidence
            return result.confidence
        })

        allResults.twitter.data = allNets.twitterNets.map(classifier => {
            let result = classifier.getTopResult(userInput)
            if(result.confidence < .5){
                allNegative.push(result.confidence)
            } else {
                allPositive.push(result.confidence)
            }
            twitterSum += result.confidence
            return result.confidence
        })

        allResults.reviews.data = allNets.amazonNets.map(classifier => {
            let result = classifier.getTopResult(userInput)
            if(result.confidence < .5){
                allNegative.push(result.confidence)
            } else {
                allPositive.push(result.confidence)
            }
            amazonSum += result.confidence
            return result.confidence
        })

        
        let custom = customClassifier.getTopResult(userInput)
        if(custom.confidence < .5){
            allNegative.push(custom.confidence)
        } else {
            allPositive.push(custom.confidence)
        }
        allResults.jaz.data = custom.confidence
        allResults.jaz.moods = moodClassifer.getResult(userInput)

        let sentimentResult = sentiment.analyze(userInput)
        allResults.sentimentNpm.data = (sentimentResult.comparative + 5) / 10
        //console.log(rtSum, twitterSum, amazonSum, custom.confidence)
        totalSum = rtSum + twitterSum + amazonSum + custom.confidence
        allResults.allNets.avg = totalSum / (1 + allResults.rotTom.data.length + allResults.twitter.data.length + allResults.reviews.data.length)
        allResults.allNets.allPositive = allPositive
        allResults.allNets.allNegative = allNegative
        allResults.allNets.posAvg = (allPositive.reduce((prev, cur) => prev + cur)) / allPositive.length
        allResults.allNets.negAvg = (allNegative.reduce((prev, cur) => prev + cur)) / allNegative.length
        allResults.rotTom.avg = rtSum / allResults.rotTom.data.length
        allResults.twitter.avg = twitterSum / allResults.twitter.data.length
        allResults.reviews.avg = amazonSum / allResults.reviews.data.length

        res.json(allResults)

    }

}


