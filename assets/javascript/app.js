$(document).ready(function() {

	var trivia = {
		currentQuestion: 0,
		currentAnswer: "",
		numCorrectAnswers: 0,
		numIncorrectAnswers: 0,
		numUnanswered: 0,
		time: 0,
		intervalId: "",
		roundEnd: false,
		gameEnded: false,

		quiz: [
		{
			question: "Which is red?",
			answers: ["A: Apple", "B: Banana", "C: Orange", "D: Pickle"],
			correctAnswer: "A: Apple"
		},
		{
			question: "Which is yellow?",
			answers: ["A: Grass", "B: Sunflower", "C: Sky", "D: Dirt"],
			correctAnswer: "B: Sunflower"
		}

		],

		startTime: function() {
			if(trivia.roundEnd === false){
				trivia.time = 20;
				$("#timer").html("Time Remaining: " + trivia.time + " Seconds");
			}
			else if(trivia.roundEnd === true) {
				trivia.time = 2;
			}
			trivia.intervalId = setInterval(trivia.timeCountDown, 1000)
		},

		timeCountDown: function() {
			if(trivia.roundEnd === false) {
				trivia.time--;
				$("#timer").html("Time Remaining: " + trivia.time + " Seconds");
				if(trivia.time === 0) {
					trivia.numUnanswered++;
					trivia.stopTime();
					trivia.roundEndScreen();
				}
			}
			else if(trivia.roundEnd === true) {
				trivia.time--;
				if(trivia.time === 0) {
					clearInterval(trivia.intervalId);
					if(trivia.gameEnded === false) {
						trivia.getQuestion();
					}
					else if(trivia.gameEnded === true) {
						trivia.endGameScreen();
						$("#restartButton").show();
					};
				};
			};
		},

		stopTime: function() {
			clearInterval(trivia.intervalId);
			trivia.roundEnd = true;
			trivia.startTime();
		},

		getQuestion: function() {
			$("#question").empty();
			$("#answers").empty();
			$("#endRoundText").empty();
			var qNum = trivia.currentQuestion;
			trivia.currentAnswer = trivia.quiz[qNum].correctAnswer;
			trivia.roundEnd = false;
			$("#question").html(trivia.quiz[qNum].question);
			for(var i = 0; i < trivia.quiz[qNum].answers.length; i++){
				var answerDiv = $("<div>");
				answerDiv.addClass("answerChoice answerBox");
				if(trivia.quiz[qNum].answers[i] === trivia.currentAnswer){
					answerDiv.attr("data-correctAnswer", trivia.quiz[qNum].answers[i]);
				}
				$(answerDiv).append(trivia.quiz[qNum].answers[i] + "<br>");
				$("#answers").append(answerDiv);
			}
			trivia.currentQuestion ++;
			if(trivia.currentQuestion === trivia.quiz.length) {
				trivia.gameEnded = true;
			};
			trivia.startTime();
		},

		clickAnswer: function(answerClicked) {
			var yourGuess = $(answerClicked).attr("data-correctAnswer");
			if(yourGuess === trivia.currentAnswer) {
				trivia.numCorrectAnswers++;
				trivia.roundEndScreen("correct");
			}
			else{
				trivia.numIncorrectAnswers++;
				trivia.roundEndScreen("incorrect");
			}
			trivia.stopTime();
		},

		roundEndScreen: function(yourGuess) {
			$("#question").empty();
			$("#answers").empty();
			if(yourGuess === "correct"){
				$("#endRoundText").html("Correct");
			}
			else if(yourGuess === "incorrect"){
				$("#endRoundText").html("Nope<br>The correct answer is " + trivia.currentAnswer);
			}
			else{
				$("#endRoundText").html("Ran out of time!<br>The correct answer is " + trivia.currentAnswer);
			};
		},

		endGameScreen: function(){
			$("#timer").empty();
			$("#question").empty();
			$("#answers").empty();
			$("#endRoundText").empty();
			$("#endRoundText").html("All done, heres how you did!<br>" + "Correct Answers: " + trivia.numCorrectAnswers
				+ "<br>Incorrect Answers: " + trivia.numIncorrectAnswers + "<br>Unanswered: " + trivia.numUnanswered);
		},

		resetGame: function() {
			$("#startButton").hide();
			$("#restartButton").hide();
			trivia.currentQuestion = 0;
			trivia.numCorrectAnswers = 0;
			trivia.numIncorrectAnswers = 0;
			trivia.numUnanswered = 0;
			trivia.gameEnded = false;
			trivia.getQuestion();
		}

	}

	$(document).on("click", "#startButton", function() {
		trivia.resetGame();
	});
	
	$(document).on("click", ".answerChoice", function() {
		trivia.clickAnswer(this);
	});

	$(document).on("click", "#restartButton", function() {
		trivia.resetGame();
	});


});