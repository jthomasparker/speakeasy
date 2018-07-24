const AsyncClassifier = require('../async-classifier/async-classifier.js')
const classifier = new AsyncClassifier()
const randomClassifier = new AsyncClassifier()
const sentimentData = require('./sentiment-data.js')
const twitterData = require('./twitter-data.js')
const amazonImdbYelpData = require('./amazonImdbYelp-Data.js')
const moodData = require('./mood-data.js')
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
let moodClassifier = new AsyncClassifier()
let customSentimentClassifier = new AsyncClassifier()
const db = require('../models')
const afinnData = require('./afinn.js')


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
   // let max = getRandom(0, amazonImdbYelpData.length)
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
    thisClassifier.restore(filePath)
    let neg = 0
    let pos = 0
    for(let i = 0; i < 50; i++){
       // if(i % 2 === 0){
      //  let input = twitterData[i+1]
      //  let output = twitterData[i]
           let r = getRandom(0, amazonImdbYelpData.length)
           let input
           let output

        if(!trainedIds.includes(r)){
            input = amazonImdbYelpData[r].input
            output = amazonImdbYelpData[r].output
         //   console.log(`classifier${num} adding record ${r}`)
        /*
           if(r % 2 === 0){
               input = twitterData[r + 1]
               output = twitterData[r]
           } else {
               input = twitterData[r]
               output = twitterData[r-1]
           }*/
           thisClassifier.addDefinition(input, output)
           trainedIds.push(r)
           if(output === 0){
               neg++
           } else {
               pos++
           }
        } else {
            i -= 1
        }
        

          //  console.log(input, output)
            
       // }
    }
    console.log(`classifier${num} added ${pos + neg} definitions: ${pos} positive and ${neg} negative`)
    console.log(`twitterClassifier${num}: training...`)
    thisClassifier.train().then(res => {
        console.log(res)
        thisClassifier.save(filePath)
        console.log(`twitterClassifier${num}: saved`)
        console.log("I love you: ",thisClassifier.getTopResult("I love you"))
        console.log("I hate you: ",thisClassifier.getTopResult("I hate you"))
        console.log("I love that: ",thisClassifier.getTopResult("I love that"))
        console.log("I hate that: ",thisClassifier.getTopResult("I hate that"))
        console.log(`twitterClassifier${num}: \n`,JSON.stringify(getStatus(thisClassifier, thisErrArr), null, 2))
        if(trainedIds.length + 51 <= amazonImdbYelpData.length){
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
   /* thisClassifier.addDefinition("I love you", 1)
    thisClassifier.addDefinition("I hate you", 0)
    thisClassifier.addDefinition("I love that", 1)
    thisClassifier.addDefinition("I hate that", 0)*/
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

const trainMoods = () => {
    moodClassifier.restore('./moodClassifier.json')
    customSentimentClassifier.restore('./customSentiment.json')
    console.log("I love you",customSentimentClassifier.getTopResult("I love you"))
    console.log("I hate you",customSentimentClassifier.getTopResult("I hate you"))
    console.log("I love that",customSentimentClassifier.getTopResult("I love that"))
    console.log("I hate that",customSentimentClassifier.getTopResult("I hate that"))
    console.log("I love you",moodClassifier.getResult("I love you"))
    console.log("I hate you",moodClassifier.getResult("I hate you"))
    console.log("I love that",moodClassifier.getResult("I love that"))
    console.log("I hate that",moodClassifier.getResult("I hate that"))
        for(let i = 0; i < moodData.length; i++){
            if(!moodData[i].trained){
                let sentiment = moodData[i].sentiment / 100
                customSentimentClassifier.addDefinition(moodData[i].input, sentiment)
                console.log("custom:\nInput: " + moodData[i].input + " , output: " + sentiment)
                for(let j = 0; j < moodData[i].moods.length; j++){
                    moodClassifier.addDefinition(moodData[i].input, moodData[i].moods[j].value)
                    console.log("mood:\nInput: " + moodData[i].input + " , output: " + moodData[i].moods[j].value)
                }

            }
        }
        console.log("Custom Classifier training...")
        customSentimentClassifier.train().then(res => {
            console.log("Custom Classifier Result: ", res)
            console.log("I love you",customSentimentClassifier.getTopResult("I love you"))
            console.log("I hate you",customSentimentClassifier.getTopResult("I hate you"))
            console.log("I love that",customSentimentClassifier.getTopResult("I love that"))
            console.log("I hate that",customSentimentClassifier.getTopResult("I hate that"))
            customSentimentClassifier.save('./customSentiment.json')
            console.log("Custom Classifier done")
           // trainTwitter(classifierFour, 4, './amazonFour.json', four)
          //  trainTwitter(classifierFive, 5, './amazonFive.json', five)
        })
        console.log("Mood Classifier training...")
        moodClassifier.train().then(res => {
            console.log("Mood Classifier Result: ", res)
            console.log("I love you",moodClassifier.getResult("I love you"))
            console.log("I hate you",moodClassifier.getResult("I hate you"))
            console.log("I love that",moodClassifier.getResult("I love that"))
            console.log("I hate that",moodClassifier.getResult("I hate that"))
            moodClassifier.save('./moodClassifier.json')
            console.log("Mood Classifier done")
          //  trainTwitter(classifierOne, 1, './amazonOne.json', one)
    //trainTwitter(classifierTwo, 2, './amazonTwo.json', two)
   // trainTwitter(classifierThree, 3, './amazonThree.json', three)
        })
}


const trainAfinn = (thisClassifier, num, filePath, thisErrArr) => {

    for(let i = 0; i < 50; i++){
        let r = getRandom(0, afinnData.length)
        if(!trainedIds.includes(r)){
            trainedIds.push(r)
            let input = afinnData[r].input
            let output = (afinnData[r].output + 5) / 10
            thisClassifier.addDefinition(input, output)
        } else {
            i -= 1
        }
    }
        console.log(`Classifier${num}: training...`)
        thisClassifier.train().then(res => {
            console.log(res)
            thisClassifier.save(filePath)
            console.log(`Classifier${num}: saved`)
            console.log("I love you: ",thisClassifier.getTopResult("I love you"))
            console.log("I hate you: ",thisClassifier.getTopResult("I hate you"))
            console.log("I love that: ",thisClassifier.getTopResult("I love that"))
            console.log("I hate that: ",thisClassifier.getTopResult("I hate that"))
            console.log(`Classifier${num}: \n`,JSON.stringify(getStatus(thisClassifier, thisErrArr), null, 2))
            trainAfinn(thisClassifier, 1, './afinnClassifier.json', one)
    })

}

const start = () => {

    //trainAfinn(classifierOne, 1, './afinnClassifier.json', one)
    
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
   /* classifierOne.restore('./amazonOne.json')
    classifierTwo.restore('./amazonTwo.json')
    classifierThree.restore('./amazonThree.json')
    classifierFour.restore('./amazonFour.json')
    classifierFive.restore('./amazonFive.json')
    console.log(classifierOne.getTopResult("I love you"))
    console.log(classifierTwo.getTopResult("I love you"))
    console.log(classifierThree.getTopResult("I love you"))
    console.log(classifierFour.getTopResult("I love you"))
    console.log(classifierFive.getTopResult("I love you"))
    console.log(classifierOne.getTopResult("I love that"))
    console.log(classifierTwo.getTopResult("I love that"))
    console.log(classifierThree.getTopResult("I love that"))
    console.log(classifierFour.getTopResult("I love that"))
    console.log(classifierFive.getTopResult("I love that"))
    console.log(classifierOne.getTopResult("I hate you"))
    console.log(classifierTwo.getTopResult("I hate you"))
    console.log(classifierThree.getTopResult("I hate you"))
    console.log(classifierFour.getTopResult("I hate you"))
    console.log(classifierFive.getTopResult("I hate you"))
    console.log(classifierOne.getTopResult("I hate that"))
    console.log(classifierTwo.getTopResult("I hate that"))
    console.log(classifierThree.getTopResult("I hate that"))
    console.log(classifierFour.getTopResult("I hate that"))
    console.log(classifierFive.getTopResult("I hate that"))*/

   // db.Trainer.find().then(res => console.log(res))***/
    trainMoods()
  /*  classifierOne.addDefinition('this is a test', .5)
    classifierOne.train().then(res => {
        console.log(res)
        classifierOne.save('./amazonSix.json')
        trainTwitter(classifierOne, 1, './amazonSix.json', one)*/
       /* trainTwitter(classifierTwo, 2, './amazonSix.json', two)
        trainTwitter(classifierThree, 3, './amazonSix.json', three)
        trainTwitter(classifierFour, 4, './amazonSix.json', four)
        trainTwitter(classifierFive, 5, './amazonSix.json', five)*/
    //})

   /* classifierOne.restore('../net/trainedNets/twitterOne.json')
    classifierTwo.restore('../net/trainedNets/twitterTwo.json')
    classifierThree.restore('../net/trainedNets/twitterThree.json')
    classifierFour.restore('../net/trainedNets/twitterFour.json')
    classifierFive.restore('../net/trainedNets/ten.json')
    trainSpecific(classifierOne, "twitterOne", '../net/trainedNets/twitterOne.json')
    trainSpecific(classifierTwo, "twitterTwo", '../net/trainedNets/twitterTwo.json')
    trainSpecific(classifierThree, "twitterThree", '../net/trainedNets/twitterThree.json')
    trainSpecific(classifierFour, "twitterFour", '../net/trainedNets/twitterFour.json')
    trainSpecific(classifierFive, "ten", '../net/trainedNets/ten.json')*/
   // let thisClassifier = new AsyncClassifier({autoTrain: false, autoTrainThreshold: 2000})
  //  console.log(thisClassifier.config)
    


}

//train(500, 510)
start()
//trainTwitter(0, 50)