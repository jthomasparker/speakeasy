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
        allResults.rotTom.data = allNets.rtNets.map(classifier => {
            let result = classifier.getTopResult(userInput)
            rtSum += result.confidence
            return result.confidence
        })

        allResults.twitter.data = allNets.twitterNets.map(classifier => {
            let result = classifier.getTopResult(userInput)
            twitterSum += result.confidence
            return result.confidence
        })

        allResults.reviews.data = allNets.amazonNets.map(classifier => {
            let result = classifier.getTopResult(userInput)
            amazonSum += result.confidence
            return result.confidence
        })

        
        let custom = customClassifier.getTopResult(userInput)
        allResults.jaz.data = custom.confidence
        allResults.jaz.moods = moodClassifer.getResult(userInput)

        let sentimentResult = sentiment.analyze(userInput)
        allResults.sentimentNpm.data = (sentimentResult.comparative + 5) / 10
        //console.log(rtSum, twitterSum, amazonSum, custom.confidence)
        totalSum = rtSum + twitterSum + amazonSum + custom.confidence
        allResults.allNets.avg = totalSum / (1 + allResults.rotTom.data.length + allResults.twitter.data.length + allResults.reviews.data.length)
        allResults.rotTom.avg = rtSum / allResults.rotTom.data.length
        allResults.twitter.avg = twitterSum / allResults.twitter.data.length
        allResults.reviews.avg = amazonSum / allResults.reviews.data.length

        res.json(allResults)

        
      /*  moodClassifer.restore('./net/trainedNets/moodClassifier.json')
        customClassifier.restore('./net/trainedNets/customSentiment.json')
        let userInput = req.body.userInput
        let netSentiment;
        let adjustedNetSentiment;
        let sentimentNpm;
        let sum = 0
        let resultsArr = 
        netFiles.map(filePath => {
            let classifier = new AsyncClassifier()
            classifier.restore(filePath)
            let result = classifier.getTopResult(userInput)
            sum += result.confidence
            return result
        })
        console.log(resultsArr)
        let amazonResult = 
            amazonNetFiles.map(filePath => {
                let classifier = new AsyncClassifier()
                classifier.restore(filePath)
                let result = classifier.getTopResult(userInput)
                return result
            })
            console.log("amazonResult\n", amazonResult)
        // sort the resultsArr to get min/max
        let sortedResults = resultsArr.sort((a, b) => {
            return b.confidence - a.confidence
        })
        // average of total
        netSentiment = sum / netFiles.length

        // subtract min/max from sum
        sum -= sortedResults[0].confidence
        sum -= sortedResults[14].confidence

        // average of total minus lowest and highest values
        adjustedNetSentiment = sum / (netFiles.length - 2)
        console.log(netSentiment, adjustedNetSentiment)

        // get sentiment from sentiment npm for comparison
        sentimentResult = sentiment.analyze(userInput)
        console.log(sentimentResult)
        sentimentNpm = (sentimentResult.comparative + 5) / 10

        // get the mood
        let moods = moodClassifer.getResult(userInput)
        // get the custom sentiment
        let customSentiment = customClassifier.getTopResult(userInput)
        let sentimentData = {
            neuralNetRating: netSentiment,
            adjustedNetRating: adjustedNetSentiment,
            sentimentNpmRating: sentimentNpm,
            customSentiment: customSentiment.confidence,
            moods: moods,
            allResults: resultsArr,
            amazonResults: amazonResult
        }
        console.log(sentimentData)
        res.json(sentimentData) */
    }

}


