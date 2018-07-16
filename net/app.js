const AsyncClassifier = require('../async-classifier/async-classifier.js')
const Sentiment = require('sentiment')
sentiment = new Sentiment();
const netFiles = [
    './net/trainedNets/one.json', './net/trainedNets/two.json', './net/trainedNets/three.json', './net/trainedNets/four.json',
    './net/trainedNets/five.json', './net/trainedNets/six.json', './net/trainedNets/seven.json', './net/trainedNets/eight.json',
    './net/trainedNets/nine.json', './net/trainedNets/ten.json', './net/trainedNets/twitterOne.json',
    './net/trainedNets/twitterTwo.json', './net/trainedNets/twitterThree.json', './net/trainedNets/twitterFour.json', './net/trainedNets/twitterFive.json'
]
const moodClassifer = new AsyncClassifier()
const customClassifier = new AsyncClassifier()



module.exports = {
    getSentiment: (req, res) => {
        console.log(req.body)
        moodClassifer.restore('./net/trainedNets/moodClassifier.json')
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
            customSentiment: customSentiment,
            moods: moods
        }
        res.json(sentimentData)
    }

}


