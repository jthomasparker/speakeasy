const AsyncClassifier = require('../async-classifier/async-classifier.js')
const classifier = new AsyncClassifier()
const randomClassifier = new AsyncClassifier()
const sentimentData = require('./sentiment-data.js')
const twitterData = require('./twitter-data.js')
let iteration = 0;
let classAvgErrArr =[];
let randAvgErrArr = [];
let trainingErr = 0;
let trainingIterations = 0;
let trainedIds = []
let classTrainedIds = []
let one = []
let two = []
let three = []
let four = []
let five = []
let classifierOne = new AsyncClassifier()
let classifierTwo = new AsyncClassifier()
let classifierThree = new AsyncClassifier()
let classifierFour = new AsyncClassifier()
let classifierFive = new AsyncClassifier()
let twitterClassifier = new AsyncClassifier()


const getRandom = (min, max) => Math.floor(Math.random() * (max - min) + min)


const train = (start, end) => {

    iteration++
    console.log("Classifier: adding defs")
    for(let i = start; i < end; i++){
        if(!classTrainedIds.includes(sentimentData[i].id)){
            classifier.addDefinition(sentimentData[i].input, sentimentData[i].rating)
            classTrainedIds.push(sentimentData[i].id)
        }
    }

    console.log("Classifier: training...")

    classifier.train()
        .then(res => {
            classifier.save('./sentiment-Net.json')
            console.log("Classifier: saved")
            console.log("Classifier: \n", JSON.stringify(getStatus(classifier, classAvgErrArr, start, end, res), null, 2))
            start = end;
          //  start = getRandom(0, sentimentData.length - 51)
            end += 50
          //  end = start + 50
            if(end > sentimentData.length){
                start -= 500
                end = start + 50
            }
              //  console.log("End of training data")
          //  } else {
                train(start, end)
            //}

        })
        .catch(err => {
            console.log("Training Error: ", err)
            train(start, end)
        })

}

const getAccuracy = (thisClassifier, avgErrArr) => {
   // let max = getRandom(2000, sentimentData.length)
   let max = 5000
    let min = max - 200
    let error = 0;
    let total = 0;
    let avgErr;

    
    for(let i = min; i < max; i++){
        total++
        let result = thisClassifier.getResult(sentimentData[i].input)
       // console.log(result)
        let guess = result[0].confidence
        let correctAns = sentimentData[i].rating
        error += Math.abs(guess - correctAns)
    }
    avgErr = (error / total).toFixed(2)
    avgErrArr.push(avgErr)
    accuracy = {
        testBatch: `Records ${min} - ${max} (${total} total)`,
        averageErr: avgErr,
        overallAvgErr: (avgErrArr.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur))) / avgErrArr.length,
        avgErrorHistory: avgErrArr
    }


    return accuracy;
    
}

const getStatus = (thisClassifier, avgErrArr, start, end, trainingRes) => {

    let data = {
        classifierStats: thisClassifier.getStats(),
        testResults: getAccuracy(thisClassifier, avgErrArr)
    }

return data
}

const trainRandom = (thisClassifier, num, filePath, thisErrArr) => {
    console.log(`randomClassifier${num}: adding defs`)
    for(let i = 0; i < 50; i++){
        let j = getRandom(0, sentimentData.length)
        if(!trainedIds.includes(sentimentData[j].id)){
          //  let label = sentimentData[j].rating.toFixed(1).toString()
           let rating = sentimentData[j].rating
           let label;
           if(rating <= .2) label = "Very Negative"
           if(rating > .2 &&  rating <= .4) label = "Negative"
           if(rating > .4 && rating <= .6) label = "Neutral"
           if(rating > .6 && rating <= .8) label = "Positive"
           if(rating > .8) label = "Very Positive"
           
        thisClassifier.addDefinition(sentimentData[j].input, label)//sentimentData[j].rating)
        trainedIds.push(sentimentData[j].id)
        } else {
            i -= 1
        }
        
    }
    console.log(`randomClassifier${num}: training...`)
    thisClassifier.train()
    .then(res => {
        thisClassifier.save(filePath)
        console.log(`randomClassifier${num}: saved`)
        console.log(`randomClassifier${num}: \n`, JSON.stringify(getStatus(thisClassifier, thisErrArr), null, 2))
        if(trainedIds.length + 500 > sentimentData.length){
            console.log(trainedIds)
            return console.log("Training complete")
        } else {
        trainRandom(thisClassifier, num, filePath, thisErrArr)
        }
    })
    .catch(err => {
        console.log(`randomClassifier${num}:`, err)
      //  trainRandom(thisClassifier, num, filePath, thisErrArr)
    })
}

const trainTwitter = (thisClassifier, num, filePath, thisErrArr) => {

    for(let i = 0; i < 50; i++){
       // if(i % 2 === 0){
      //  let input = twitterData[i+1]
      //  let output = twitterData[i]
           let r = getRandom(0, twitterData.length)
           let input
           let output
        if(!trainedIds.includes(r)){
        
           if(r % 2 === 0){
               input = twitterData[r + 1]
               output = twitterData[r]
           } else {
               input = twitterData[r]
               output = twitterData[r-1]
           }
           thisClassifier.addDefinition(input, output)
           trainedIds.push(r)
        } else {
            i -= 1
        }
        

          //  console.log(input, output)
            
       // }
    }
    console.log(`twitterClassifier${num}: training...`)
    thisClassifier.train().then(res => {
        console.log(res)
        thisClassifier.save(filePath)
        console.log(`twitterClassifier${num}: saved`)
        console.log(`twitterClassifier${num}: \n`,JSON.stringify(getStatus(thisClassifier, thisErrArr), null, 2))
        if(trainedIds.length + 50 <= twitterData.length){
        trainTwitter(thisClassifier, num, filePath, thisErrArr)
        } else {
            console.log(`twitterClassifier${num}: done`)
        }
    })
    .catch(err => {
        console.log(`twitterClassifier${num}:`, err)
      //  trainRandom(thisClassifier, num, filePath, thisErrArr)
    })
}

const trainSpecific = (thisClassifier, classifierName, filepath) => {
    console.log(classifierName + " adding defs")
    console.log("I love you",thisClassifier.getTopResult("I love you"))
    console.log("I hate you",thisClassifier.getTopResult("I hate you"))
    console.log("I love that",thisClassifier.getTopResult("I love that"))
    console.log("I hate that",thisClassifier.getTopResult("I hate that"))
    thisClassifier.addDefinition("I love you", 1)
    thisClassifier.addDefinition("I hate you", 0)
    thisClassifier.addDefinition("I love that", 1)
    thisClassifier.addDefinition("I hate that", 0)
    console.log(classifierName + " training")
    thisClassifier.train()
        .then(res => {
            console.log(classifierName + " trained")
            console.log(res)
            console.log("I love you",thisClassifier.getTopResult("I love you"))
            console.log("I hate you",thisClassifier.getTopResult("I hate you"))
            console.log("I love that",thisClassifier.getTopResult("I love that"))
            console.log("I hate that",thisClassifier.getTopResult("I hate that"))
            thisClassifier.save(filepath)
            
        })
}

const start = () => {
   // classifier.restore('./sentimentNet.json')
  //  console.log("Classifier Restored: \n",classifier.getStats())
  //  train(0, 50)

   // trainRandom(classifierOne, 6, './six.json', one)
 //   trainRandom(classifierTwo, 7, './seven.json', two)
 //   trainRandom(classifierThree, 3, './three.json', three)
  //  trainRandom(classifierFour, 9, './nine.json', four)
  //  trainRandom(classifierFive, 10, './classOne.json', five)
 // classifier.restore('./sentimentNet.json')
 // console.log(JSON.stringify(getStatus(classifier, one), null, 2))
 /*   trainTwitter(classifierOne, 1, './twitterOne.json', one)
    trainTwitter(classifierTwo, 2, './twitterTwo.json', two)
    trainTwitter(classifierThree, 3, './twitterThree.json', three)
    trainTwitter(classifierFour, 4, './twitterFour.json', four)
    trainTwitter(classifierFive, 5, './twitterFive.json', five)*/
    classifierOne.restore('../net/trainedNets/twitterOne.json')
    classifierTwo.restore('../net/trainedNets/twitterTwo.json')
    classifierThree.restore('../net/trainedNets/twitterThree.json')
    classifierFour.restore('../net/trainedNets/twitterFour.json')
    classifierFive.restore('../net/trainedNets/ten.json')
    trainSpecific(classifierOne, "twitterOne", '../net/trainedNets/twitterOne.json')
    trainSpecific(classifierTwo, "twitterTwo", '../net/trainedNets/twitterTwo.json')
    trainSpecific(classifierThree, "twitterThree", '../net/trainedNets/twitterThree.json')
    trainSpecific(classifierFour, "twitterFour", '../net/trainedNets/twitterFour.json')
    trainSpecific(classifierFive, "ten", '../net/trainedNets/ten.json')
    


}

//train(500, 510)
start()
//trainTwitter(0, 50)