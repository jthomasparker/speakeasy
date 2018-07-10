const AsyncClassifier = require('../async-classifier/async-classifier.js')
const Sentiment = require('sentiment')
sentiment = new Sentiment();
const netFiles = [
    './trainedNets/one.json', './trainedNets/two.json', './trainedNets/three.json', './trainedNets/four.json', './trainedNets/five.json',
    './trainedNets/six.json', './trainedNets/seven.json', './trainedNets/eight.json', './trainedNets/nine.json', './trainedNets/ten.json',
    './trainedNets/twitterOne.json', './trainedNets/twitterTwo.json', './trainedNets/twitterThree.json',
    './trainedNets/twitterFour.json', './trainedNets/twitterFive.json',
]

module.exports = {
    getSentiment: (req, res) => {
        let netSentiment;
        let sentimentNpm;
        let sum = 0
        let resultsArr = 
        netFiles.map(filePath => {
            let classifier = new AsyncClassifier()
            classifier.restore(filePath)
            let result = classifier.getTopResult(req.body)
            sum += result.confidence
            return result
        })
        console.log(resultsArr)
        // sort the resultsArr to get min/max
        let sortedResults = resultsArr.sort((a, b) => {
            return b.confidence - a.confidence
        })
        // subtract min/max from sum
        sum -= sortedResults[0].confidence
        sum -= sortedResults[14].confidence
        // get average
        netSentiment = sum / 13
        console.log(netSentiment)
        // get sentiment from sentiment npm for comparison
        sentimentResult = sentiment.analyze(req.body)
        console.log(sentimentResult)
        sentimentNpm = (sentimentResult.comparative + 5) / 10
        let sentimentData = {
            neuralNetRating: netSentiment,
            sentimentRating: sentimentNpm
        }
        res.json(sentimentData)
    }

}


