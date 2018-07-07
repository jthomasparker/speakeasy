const AsyncClassifier = require('../async-classifier/async-classifier.js')
const classifier = new AsyncClassifier()
const randomClassifier = new AsyncClassifier()
const sentimentData = require('./sentiment-data.js')
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
    let max = getRandom(2000, sentimentData.length)
  //  let min = getRandom(max - 500, max)
    let min = max - 200
    let error = 0;
    let total = 0;
    let avgErr;

    
    for(let i = min; i < max; i++){
        total++
        let result = thisClassifier.getResult(sentimentData[i].input)
        let guess = result[0][1]
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
        thisClassifier.addDefinition(sentimentData[j].input, sentimentData[j].rating)
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

const start = () => {
   // classifier.restore('./sentimentNet.json')
  //  console.log("Classifier Restored: \n",classifier.getStats())
  //  train(0, 50)
    trainRandom(classifierOne, 6, './six.json', one)
    trainRandom(classifierTwo, 7, './seven.json', two)
    trainRandom(classifierThree, 8, './eight.json', three)
    trainRandom(classifierFour, 9, './nine.json', four)
    trainRandom(classifierFive, 10, './ten.json', five)
}

//train(500, 510)
start()