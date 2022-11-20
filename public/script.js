const body = document.querySelector("body")

const screen1 = document.getElementById("introduction")
const screen2 = document.getElementById("attempt-quiz")
const screen3 = document.getElementById("review-quiz")

const btnStart = document.getElementById("btn-start")
const btnSubmit = document.getElementById("btn-submit")
const btnTryAgain = document.getElementById("btn-try-again")

let attemptId;


// const labels = document.querySelectorAll("label")
// labels.forEach(label => {
//     label.addEventListener("click", e => {
//         // if there is any other selected option, unselect it
//         let optionSelected = document.querySelector(".option-selected")
//         if (optionSelected) {
//             optionSelected.classList.remove("option-selected")
//         }
//         // select the clickde option
//         e.currentTarget.classList.add("option-selected")
//     })
// })

// better alternative for above commented code
const answers = document.querySelectorAll("#attempt-quiz  .answer")
for (let answer of answers) {
    let options = document.querySelectorAll(`#${answer.id} .option`)

    for (let option of options) {
        option.addEventListener("click", (e) => {
            let selectedOption = document.querySelector(`#${answer.id}  .option-selected`)
            if (selectedOption) {
                selectedOption.classList.remove("option-selected")
            }
            console.log("Clicked");
            e.currentTarget.classList.add("option-selected")
        })
    }
}

btnStart.addEventListener("click", startQuiz);
btnSubmit.addEventListener("click", submitAnswer);
btnTryAgain.addEventListener("click", tryQuizAgain);

function startQuiz() {
    body.scrollIntoView({block: "start"})
    screen1.classList.add("hidden")
    screen2.classList.remove("hidden")
    fetch("http://localhost:3000/attempts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            attemptId = data._id;
            

            const questionArray = data.questions;
            questionArray.forEach((question, index) => {
                const questionDiv = document.createElement("div");

                const h2Question = document.createElement("h2");
                h2Question.classList.add("question-index");
                h2Question.textContent = `Question ${index+1} of 10`;

                const questionText = document.createElement("div");
                questionText.classList.add("question-text");
                questionText.textContent = question.text;

                const form = document.createElement("form");
                form.classList.add("answer");
                form.id = question._id;
                
                const answerArray = question.answers;
                answerArray.forEach((answer, index) => {
                    const label = document.createElement("label");
                    label.classList.add("option");

                    const input = document.createElement("input");
                    input.type = "radio";
                    input.name = form.id;
                    input.value = index;

                    const pAnswer = document.createElement("p");
                    pAnswer.classList.add("pAnswer");
                    pAnswer.textContent = answer;
                    label.appendChild(input);
                    label.appendChild(pAnswer);
                    label.addEventListener("click", e => {
                        const selectedLabel = form.querySelector(".option-selected");
                        if (selectedLabel) {
                            selectedLabel.classList.remove("option-selected");
                        }
                        e.currentTarget.classList.add("option-selected");
                    })

                    form.appendChild(label);
                })
                questionDiv.appendChild(h2Question);
                questionDiv.appendChild(questionText);
                questionDiv.appendChild(form);
                // questionDiv.appendChild(answerArray);
                document.querySelector("#question-ctn").appendChild(questionDiv);
            })
        }
    )
}
// $(":radio").click(function(){
//     var radioName = $(this).attr("name"); //Get radio name
//     $(":radio[name='"+radioName+"']").attr("disabled", true); //Disable all with the same name
//  });
// jQuery("input:radio").attr('disabled',true);


function submitAnswer() {

    if (confirm("Are you sure you want to submit answer?") == true) {
        body.scrollIntoView({block: "start"})
        screen2.classList.add("hidden")
        screen3.classList.remove("hidden")
        let url = `attempts/${attemptId}/submit`;
       
        const data = {
            userAnswers: {
                
            }
        }

        const formArray = document.querySelectorAll("#question-ctn form");
        formArray.forEach(form => {
            const selectedInput = form.querySelector(".option-selected input");
            if(selectedInput){
                data.userAnswers[form.id] = selectedInput.value;
            }
        })

        console.log(data);
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)

        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const reviewCtn = document.querySelector("#review-ctn");
            const questionArray = data.questions;
            const userAns = data.userAnswers || {}; 
            const correctAns = data.correctAnswers;
            questionArray.forEach((question, index) => {
                const divChild = document.createElement("div");

                const h2E = document.createElement("h2");
                h2E.classList.add("question-index");
                h2E.textContent = `Question ${index+1} of 10`;

                const questionText = document.createElement("div");
                questionText.classList.add("question-text");
                questionText.textContent = question.text;

                const formAnswer = document.createElement("form");
                formAnswer.id = question._id;


                const answerArray = question.answers;
                answerArray.forEach((answer, index) => {
                    const label = document.createElement("label");
                    label.classList.add("option");

                    const input = document.createElement("input");
                    input.type = "radio";
                    input.name = formAnswer.id;
                    input.value = index;
                    
                    if (correctAns[formAnswer.id] == index) {
                        label.classList.add("option-correct");
                    }

                    if (userAns[formAnswer.id] == index) {
                        input.checked = true;
                        if (userAns[formAnswer.id] == correctAns[formAnswer.id]){
                            label.classList.add("correct-answer");
                        }
                        else {
                            label.classList.add("wrong-answer");
                        }
                    }

                    const pAnswer = document.createElement("p");
                    pAnswer.classList.add("pAnswer");
                    pAnswer.textContent = answer;

                    label.appendChild(input);
                    label.appendChild(pAnswer);
                    formAnswer.appendChild(label);
                })

                divChild.appendChild(h2E);
                divChild.appendChild(questionText);
                divChild.appendChild(formAnswer);

                reviewCtn.appendChild(divChild);
            })
 
            const score = data.score;
            const scoreText = data.scoreText;
            document.querySelector("#score").textContent = `${score}/10`;
            document.querySelector("#box-result strong").textContent =`${(score/10)*100}%`;
            document.querySelector("#scoreText").textContent = scoreText;

        })


    }   

    
}

function tryQuizAgain() {
    body.scrollIntoView({block: "start"})
    unselecteAllTheCheckedRadio();
    screen3.classList.add("hidden")
    screen1.classList.remove("hidden")
    location.reload()
}

function unselecteAllTheCheckedRadio() {
    // uncheck all checked radio buttons
    let checkedRadios = document.querySelectorAll("input[type='radio']:checked")
    checkedRadios.forEach(radio => {
        radio.checked = false
    })

    // remove background of all checked radio buttons
    let selectedOptions = document.querySelectorAll(".option-selected")
    selectedOptions.forEach(option => {
        option.classList.remove("option-selected")
        option.disabled = true;
    })
}