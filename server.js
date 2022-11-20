
const express = require('express');
const mongodb = require('mongodb')


//declare variables
let db = null;

let completed = false;
const myDate = new Date();


// const id = mongodb.ObjectId();
const app = express();
const option = {};
let updateDocs = {}
const correctAnswer = {};
const submit = {}


const correctAnswerArray = []


let question = {}
//use public folder to link html and css 
app.use(express.static('public'));

app.use(express.urlencoded({ "extended": true }));
app.use(express.json());

//using port 3000




// get question
app.post('/attempts', async function (req, res) {
    // await client.connect();
    const result = await db.collection("questions").find(); // OK (by default) 

    docs = await result.toArray();
   

    // create a document to insert

  

    const answers2 = []
   

    //---------------------------------------------------------------------------------------
   
    
    let arr = [];

    do {
      let num = Math.floor(Math.random() * 15);
      arr.push(num);
      arr = arr.filter((item, index) => {
        return arr.indexOf(item) === index
      });
    } while (arr.length < 10);
    console.log(arr);


 
    for (let i = 0; i < 10; i++) {
        question = docs[arr[i]]

        correctAnswerArray.unshift(question.correctAnswer)

        answers2.unshift(question)

      
    }
    


    //delete correct answers
    answers2.forEach(element => {
        delete element.correctAnswer
    });

    
    
    //add key and value into option
    option.questions = answers2

    for (let i = 0; i < option.questions.length; i++) {
        let quesID = option.questions[i]._id
        correctAnswer[quesID] = correctAnswerArray[i];
        // correctAnswer[quesID] = option.quesID.correctAnswer

        // for (item of docs) {
        //     correctAnswer[quesID] = docs.option[]

        // }
    }

    option.completed = completed;
    option.score = 0;
    
    // get id
    // option._id = id;
    //time starts
    option.startedAt = myDate;
    
    updateDocs = JSON.parse(JSON.stringify(option));
    updateDocs.correctAnswers = correctAnswer
    
    
    //send data
    
    db.collection("Attempts").insertOne(option, function (err, res) {
        if (err) throw err;
        console.log(`A document was inserted with the _id: ${res.insertedId}`);
        option._id = res.insertedId;
        updateDocs._id = option._id
        result.close();
    });  
     
    
    
    
    res.status(201).json(option) 
})


//submit the quiz
app.post(`/attempts/:id/submit`, async function (req, res) {
    let attemptID = req.params.id
    // const attemptIDOb = {
    //     _id: `${attemptID = option._id}`
    // }
    // console.log(attemptID);
    // const attemptIDObject = { 
    //     "_id": attemptID 
    // }
    const dba =  db.collection("questions").find(element => element._id == attemptID);
    
    if(dba) {
        const userAnswers = req.body.userAnswers;

        let score = 0; 
        //calculate score
        let scoreText = '';
        for (const questionID in userAnswers) {

            for (const questionID2 in correctAnswer) {
                if (questionID == questionID2 && userAnswers[questionID] == correctAnswer[questionID]) {
                    score++;
                }
            }


        } 


        //print score text
        if (score < 5) {
            scoreText = 'Practice more to improve it :D'
        } else if (5 <= score < 7) {
            scoreText = 'Good, keep up!'
        } else if (7 <= score < 9) {
            scoreText = 'Well done!'
        } else if (9 <= score <= 10) {
            scoreText = 'Perfect!!'
        }

        // post db 
        

        let completed = true
        updateDocs.score = score
        updateDocs.completed = completed
        updateDocs.userAnswers = userAnswers
        updateDocs.scoreText = scoreText
        

        //update db
        let Attempt = db.collection("Attempts")
          
        await Attempt.updateOne(
            {_id: updateDocs._id},    
            { $set: { 
                completed: true,
                score : score,
                correctAnswers: correctAnswer,
                userAnswers : userAnswers, 
                scoreText : scoreText

            }} 
             
            
            
        )  


         
        

        res.status(200).json(updateDocs)
        console.log(updateDocs);


    } else{ 
        res.status(404).send("cant connect")
    } 

}) 


//connect db 
async function startServer() {
    const client = await mongodb.MongoClient.connect("mongodb://localhost:27017/wpr-quiz"); // connection string ( cổng lắng nghe và trả về dữ liệu)
    db = client.db();
    console.log("connect to db");

    app.listen(3000, function () {
        console.log('Listening on port 3000!');
    });


}
startServer()
  



