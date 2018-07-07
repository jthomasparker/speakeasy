const brain = require('brain.js');
const natural = require('natural')
var jf = require('jsonfile')
const moment = require('moment')


const AsyncClassifier = function(autoTrain, autoTrainThreshold, brainOptions, trainingOptions, tokenizer, stemmer){
    this.autoTrain = autoTrain || true,
    this.autoTrainThreshold = autoTrainThreshold || 1000,
    this.brainOptions = brainOptions,
    this.trainingOptions = trainingOptions,
    this.tokenizer = tokenizer || new natural.TreebankWordTokenizer(),
    this.stemmer = stemmer || natural.PorterStemmer,
    this.features = {},
    this.totalDefs = [],
    this.newDefs = [],
    this.trainingData = [],
    this.trainedNet,
    this.lastTrainedTime,
    this.trainingSessions = 0,
    this.totalTrainingIterations = 0,
    this.avgTrainingError = 0,
    this.lastTrainingResult = 0,

    this.tokenize = (string) => this.tokenizer.tokenize(string),
    this.stemToken = (token) => this.stemmer.stem(token),
    this.addDefinition = (input, category) => {
        let text = input;
        if(typeof(text) === 'string'){
            //tokenize and stem
            text = [...(new Set(this.tokenize(input).map(this.stemToken)))]
        }
        this.newDefs.push({
            label: category,
            text: text
        })
        // add each tokenized/stemmed word from text to features
        text.map((token) => {
            this.features[token] = (this.features[token] || 0) + 1
        })
        if((this.newDefs >= this.autoTrainThreshold) && (this.autoTrain)){
            this.train();
        }
    },
    this.encodeText = (text) => {
        let input = []
        Object.entries(this.features).forEach((feature) => {
            if(text.includes(feature[0])){
                input.push(1)
            } else {
                input.push(0)
            }
        })
        return input
    },
    this.formatTrainingData = () => {
        this.newDefs.map((def) => {
            this.totalDefs.push(def)
            let label = def.label
            let input = this.encodeText(def.text)
            let output;
            if(typeof(label) === 'string'){
                output = {
                    [label]: 1
                }
            } else {
               // if(label > 1) return "Output must be less than 1"
                output = {
                    result: label
                }
            }
    
            this.trainingData.push({
                    input,
                    output: output
                })
        })
        this.newDefs = []
    },
    this.train = (options) => {
            this.formatTrainingData()
            let net = new brain.NeuralNetwork(this.brainOptions);
            
            return net.trainAsync(this.trainingData, options || this.trainingOptions)
            .then(res => {
                this.trainedNet = net
                this.lastTrainedTime = moment().format('MMMM Do YYYY, h:mm:ss a');
                this.trainingSessions += 1
                this.totalTrainingIterations += res.iterations
                this.avgTrainingError = (this.avgTrainingError += res.error) / this.trainingSessions
                this.lastTrainingResult = res
                return res
            })
            .catch(err => {
                 return err
            })
       
    },
    this.getResult = (input) => {
        if(typeof this.trainedNet === 'undefined'){
            return "Brain not trained!"
        }
        let results = this.trainedNet.run(this.encodeText(input))
        let sortedResults = Object.entries(results).sort((a, b) => {
            return b[1] - a[1]
        })
        return sortedResults
    },
    this.getTopResult = (input) => {
        let top = this.getResult(input)[0]
        let topResult = {
            label: top[0],
            confidence: top[1]
        }
        return topResult
    },
 
    this.save = (filePath) => {
        this.trainedNet.toJSON();
        let savedBrain = this;
        if(filePath){
            jf.writeFileSync(filePath, savedBrain, {spaces: 2}, (err) => {
                if(err) throw err
            })
        } else {
            savedBrain = JSON.stringify(savedBrain)
        }
        return savedBrain;
    },
    this.restore = (filePath) => {
        let savedBrain = this.isJson(filePath)
                        ? JSON.parse(filePath)
                        : jf.readFileSync(filePath, (err) => {
                                if(err) throw err
                            })
        let net = new brain.NeuralNetwork();
        this.trainedNet = net.fromJSON(savedBrain.trainedNet)
        this.trainingData = savedBrain.trainingData
        this.totalDefs = savedBrain.totalDefs
        this.newDefs = savedBrain.newDefs
        this.features = savedBrain.features
        this.lastTrainedTime = savedBrain.lastTrainedTime
        this.trainingSessions = savedBrain.trainingSessions || 0
        this.totalTrainingIterations = savedBrain.totalTrainingIterations || 0
        this.avgTrainingError = savedBrain.avgTrainingError || 0
        this.lastTrainingResult = savedBrain.lastTrainingResult
        return this
    },
    this.isJson = (item) => {
        item = typeof item !== 'string'
                ? JSON.stringify(item)
                : item;
        try {
            item = JSON.parse(item);
        } catch (e) {
            return false;
        }

        if(typeof item === 'object' && item !== null){
            return true;
        }
        return false;
    },
    this.getStatus = () => {
        if(typeof this.trainedNet !== 'undefined'){
            let test = this.getResult("test")
            if(test.length > 0 && typeof test !== 'undefined'){
                return true;
            }
        }
        return false;
    },
    this.getStats = () => {
        let netStatus = this.getStatus()
            ? "Ready"
            : "Not Ready"
        let status = {
            netStatus: netStatus,
            netStats: {
                totalDefinitions: this.totalDefs.length,
                totalFeatures: Object.values(this.features).reduce((acc, curr) => acc + curr),
                distinctFeatures: Object.keys(this.features).length
            },
            trainingStats: {
                sessions: this.trainingSessions,
                totalIterations: this.totalTrainingIterations,
                avgIterations: this.totalTrainingIterations / this.trainingSessions,
                avgError: this.avgTrainingError,
                lastTrained: this.lastTrainedTime,
                lastSession: this.lastTrainingResult
            }
        }
        return status;
    },
    this.getAccuracy = (testData) => {
        // 3 formats: [{input, output}], [input0,output0,input1,output1...], [[input0, output0], [input1,output1]]
        let formattedData = []
        if(typeof testData === 'object'){
            formattedData.push(testData)
        } else if(typeof testData === 'array'){
            if(typeof testData[0] === 'object') formattedData = [...testData]
            if(typeof testData[0] === 'array') {
                testData.map((testArr) => {
                    formattedData.push({
                        input: testArr[0],
                        output: testArr[1]
                    })
                })
            }
            if(typeof testData[0] === 'string'){
                for(let i = 0; i < testData.length; i++){
                    formattedData.push({
                        input: testData[i],
                        output: testData[i + 1]
                    })
                    i += 1
                }
            }
        } else {
            return "Error: Invalid Data"
        }

        //TODO: actual accuracy check

    }
    
    
}

module.exports = AsyncClassifier;