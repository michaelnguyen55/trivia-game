$(document).ready(function() {

	//Object conatining the game
	var trivia = {
		currentQuestion: 0,
		currentAnswer: "",
		currentFunFact: "",
		currentImage: "",
		numCorrectAnswers: 0,
		numIncorrectAnswers: 0,
		numUnanswered: 0,
		time: 0,
		intervalId: "",
		roundEnd: false,
		gameEnded: false,
		sounds: ["assets/images/correct.mp3","assets/images/loser.mp3", "assets/images/yousuck.mp3",
		"assets/images/jazzhip.mp3"],
		mute: false,
		startMusic: false,
		randomSound: 1,

		//Array of the quiz questions, answers, facts and images
		quiz: [
		{
			question: "1. Where do coffee beans grow from?",
			answers: ["A: A low, spreading vine", "B: A bush", 
			"C: A tree", "D: The roots of a coffee plant"],
			correctAnswer: "B: A bush",
			funFact: "Coffee beans are actually the seeds of a cherry-like berry grown on bushes. They are called beans because of their resemblance to beans",
			image: "assets/images/coffeebush.jpg"
		},
		{
			question: "2. Coffee was the first food to be what?",
			answers: ["A: Shipped from Europe to the New World", "B: Freeze-dried", 
			"C: Used in Aztec religious ceremonies", "D: Roasted and ground for drinking"],
			correctAnswer: "B: Freeze-dried",
			funFact: "Freeze-drying was commercially developed when it was used to preserve blood plasma and penicillin during World War II. Nestl&egrave; then invented freeze-dried coffee.",
			image: "assets/images/freezedried.jpg"
		},
		{
			question: "3. Espresso literally means what in Italian?",
			answers: ["A: Speed it up", "B: To go", "C: Pressed out", "D: Black and intense"],
			correctAnswer: "C: Pressed out",
			funFact: "This refers to the way espresso is made, forcing boiling water through pressed coffee grounds.",
			image: "assets/images/espresso.jpg"
		},
		{
			question: "4. Where does the name cappuchino come from?",
			answers: ["A: The drink's resemblance to the brown cowls worn by Capuchin monks", 
			"B: The similarity in color to the fur of Capuchin monkeys", 
			"C: The Italian puccino, meaning 'light brown one'", 
			"D: The size of the cup in which it's commonly served"],
			correctAnswer: "A: The drink's resemblance to the brown cowls worn by Capuchin monks",
			funFact: "The Italian word for this distinctive hood is cappuccio. A friar is a Capuchin.",
			image: "assets/images/monk.jpg"
		},
		{
			question: "5.  Kopi Luwak, the world's most expensive coffee (up to $600 per pound) is:",
			answers: ["A: Processed during a full moon", 
			"B: Brewed only with solid gold pots", 
			"C: Made from coffee beans eaten and then excreted by a Sumatran wild cat", 
			"D: Grown at a higher altitude than any other bean"],
			correctAnswer: "C: Made from coffee beans eaten and then excreted by a Sumatran wild cat",
			funFact: "The asian palm civet improves coffee through selection, digestion, and fermentation.",
			image: "assets/images/kopi.jpg"

		},
		{
			question: "Coffee Break",
			answers:"",
			corectAnswer:"",
			funFact:"",
			image: "assets/images/coffeebreak.gif"
		},
		{
			question: "6. Do cats purr when in pain?",
			answers: ["A: True", "B: False"],
			correctAnswer: "A: True",
			funFact: "Cats will purr when in pain to release endorphins. Purrs' frequencies also promote bone healing and ease muscle pain.",
			image: "assets/images/catdoctor.jpg"

		},
		{
			question: "7. What is the term for a group of cats?",
			answers: ["A: Caggle", "B: Clutch", "C: Clowder", "D: Covey", "E: Wrong Answer :)"],
			correctAnswer: "C: Clowder",
			funFact: "They can also be called a clutter or a glaring. A group of wild cats is a destruction or dowt.",
			image: "assets/images/clowder.jpg"

		},
		{
			question: "8. What do cats smell to communicate with one another?",
			answers: ["A: Face", "B: Butt", "C: Paws", "D: Stomach", "E: Tail"],
			correctAnswer: "B: Butt",
			funFact: "Just like dogs, a cat can determine whether another cat is male or female, happy or aggressive, healthy or ill, and many other things.",
			image: "assets/images/catsmell.jpg"
		},
		{
			question: "9. What is not a cat breed?",
			answers: ["A: Tabby", "B: Maine Coon", "C: Ocicat", "D: Ragamuffin", "E: Turkish Van"],
			correctAnswer: "A: Tabby",
			funFact: "A tabby is the coat pattern on a cat. All tabbies have an 'M' on their forehead. Legend says they got it because a cat warmed up baby Jesus so Mary put an 'M' to forever remind the world",
			image: "assets/images/tabby.jpg"
		},
		{
			question: "10. Cats can't taste what?",
			answers: ["A: Sour", "B: Bitter", "C: Salty", "D: Spicy", "E: Sweet"],
			correctAnswer: "E: Sweet",
			funFact: "Cats lack the genes for sweet detection. They can however, taste coffee.",
			image: "assets/images/cattaste.jpg"
		}
		],

		//For each question, this will start the time at 20 seconds if the question round has not ended
		//and then call the interval for counting down. If the round has ended, this will set the time for in between questions
		startTime: function() {
			if(trivia.roundEnd === false) {
				$("#timer").empty();
				//if the current question is 6 (which is for the break in between), set time to 6
				if(trivia.currentQuestion === 6) {
					trivia.time = 6;
				}
				else {
					trivia.time = 20;
					var timerDiv = $("<div>");
					$(timerDiv).append("Time Remaining: " + trivia.time + " Seconds" + "<br><br>");
					$(timerDiv).hide().appendTo("#timer").fadeIn(1000);
				};

			}
			//If the round has ended, set the amount of time in between each question to 7
			else if(trivia.roundEnd === true) {
				trivia.time = 7;
			}
			trivia.intervalId = setInterval(trivia.timeCountDown, 1000);
		},

		//Counts down the time by 1 every second
		timeCountDown: function() {
			if(trivia.roundEnd === false && trivia.currentQuestion !== 6) {
				trivia.time--;
				$("#timer").html("Time Remaining: " + trivia.time + " Seconds" + "<br><br>");
				//If the time has run out, then the question will end and move to the round end screen in between questions
				if(trivia.time === 0) {
					trivia.numUnanswered++;
					trivia.stopTime();
					trivia.roundEndScreen();
					trivia.playWrongSound();
				}
			}
			//If the question round has already ended, then count down time for in between questions
			else if(trivia.roundEnd === true) {
				trivia.time--;
				if(trivia.time === 0) {
					clearInterval(trivia.intervalId);
					if(trivia.gameEnded === false) {
						trivia.getQuestion();
					}
					else if(trivia.gameEnded === true) {
						trivia.endGameScreen();
						$("#restartButton").fadeToggle(1000);
					};
				};
			}
			//If the question is 6, then count down time and move to next question immediately with no in between time
			else if(trivia.currentQuestion === 6) {
				trivia.time--;
				if(trivia.time === 0) {
					clearInterval(trivia.intervalId);
					trivia.getQuestion();
				}
			}
		},

		//Stops the time from counting down and sets the question to end
		stopTime: function() {
			clearInterval(trivia.intervalId);
			trivia.roundEnd = true;
			trivia.startTime();
		},

		//Gets the question and puts in all the properties of the questions
		getQuestion: function() {
			$("#question").empty();
			$("#answers").empty();
			$("#endRoundText").empty();
			var qNum = trivia.currentQuestion;
			trivia.currentAnswer = trivia.quiz[qNum].correctAnswer;
			trivia.currentFunFact = trivia.quiz[qNum].funFact;
			trivia.currentImage = trivia.quiz[qNum].image;
			trivia.roundEnd = false;
			var questionDiv = $("<div>");
			$(questionDiv).append(trivia.quiz[qNum].question + "<br><br>");
			$(questionDiv).hide().appendTo("#question").fadeIn(1000);
			for(var i = 0; i < trivia.quiz[qNum].answers.length; i++){
				var answerDiv = $("<div>");
				answerDiv.addClass("answerChoice answerBox");
				if(trivia.quiz[qNum].answers[i] === trivia.currentAnswer){
					answerDiv.attr("data-correctAnswer", trivia.quiz[qNum].answers[i]);
				}
				$(answerDiv).append(trivia.quiz[qNum].answers[i] + "<br>");
				$(answerDiv).hide().appendTo("#answers").fadeIn(1000);
			}
			trivia.currentQuestion ++;
			if(trivia.currentQuestion === trivia.quiz.length) {
				trivia.gameEnded = true;
			};
			if(trivia.currentQuestion === 6) {
				var img = $("<img>");
				img.addClass("imageResize");
				img.attr("src", trivia.currentImage);
				$(img).hide().appendTo("#endRoundText").fadeIn(1000);
			}
			trivia.startTime();
		},

		//When clicking an answer, if correct then go to the correct round end screen, if incorrect go to incorrect round end screen
		clickAnswer: function(answerClicked) {
			var yourGuess = $(answerClicked).attr("data-correctAnswer");
			if(yourGuess === trivia.currentAnswer) {
				trivia.numCorrectAnswers++;
				trivia.roundEndScreen("correct");
				trivia.playCorrectSound();
			}
			else{
				trivia.numIncorrectAnswers++;
				trivia.roundEndScreen("incorrect");
				trivia.playWrongSound();
			}
			trivia.stopTime();
		},

		//Function called in other functions, plays the wrong sound if answered incorrectly
		playWrongSound: function() {
			if(trivia.mute === false) {
				document.getElementById("wrong").src = trivia.sounds[trivia.randomSound];
				document.getElementById("wrong").play();
				trivia.randomSound++;
				if(trivia.randomSound > 2) {
					trivia.randomSound = 1;
				}
			}
		},

		//Function called in other functions, plays the correct sound if answered correctly
		playCorrectSound: function() {
			if(trivia.mute === false) {
				document.getElementById("correct").play();
			}
		},

		//Sets the music and sounds to be used
		setMusic: function() {
			var music = new Audio;
			music.src = trivia.sounds[3];
			music.loop = true;
			music.id = "music";
			music.muted = false;
			$("#backgroundMusic").html(music);

			var soundEffect = new Audio;
			soundEffect.id = "wrong";
			soundEffect.src = trivia.sounds[1];
			$("#soundEffect").html(soundEffect);

			var correctSound = new Audio;
			correctSound.id = "correct";
			correctSound.src = trivia.sounds[0];
			$("#soundEffect").append(correctSound);
		},

		//Pauses the music when clicking. The second click will play the music
		muteMusic: function() {
			if(trivia.mute === false) {
				document.getElementById("music").pause();
				trivia.mute = true;
			}
			else {
				trivia.mute = false;
				if(trivia.startMusic === true) {
					document.getElementById("music").play();
				}
			};
		},

		//starts the game music, this function is called when pressing the start button
		startGameMusic: function() {
			if(trivia.mute === false) {
				document.getElementById("music").play();
			}
			trivia.startMusic = true;
		},

		//This is for the round end screen in between each question, it shows the correct answer/image/fun fact
		roundEndScreen: function(yourGuess) {
			$("#question").empty();
			$("#answers").empty();
			var endRoundTextDiv = $("<div>");
			var img = $("<img>");
			img.addClass("imageResize");
			img.attr("src", trivia.currentImage);
			
			if(yourGuess === "correct") {
				$(endRoundTextDiv).html("Correct<br><br>" + trivia.currentFunFact + "<br><br>");
				$(endRoundTextDiv).append(img);
				$(endRoundTextDiv).hide().appendTo("#endRoundText").fadeIn(1000);
			}
			else if(yourGuess === "incorrect") {
				$(endRoundTextDiv).html("Nope<br>The correct answer is " + trivia.currentAnswer + "<br><br>" + trivia.currentFunFact
					+ "<br><br>");
				$(endRoundTextDiv).append(img);
				$(endRoundTextDiv).hide().appendTo("#endRoundText").fadeIn(1000);
				
			}
			else {
				$(endRoundTextDiv).html("Ran out of time!<br>The correct answer is " + 
					trivia.currentAnswer + "<br><br>" + trivia.currentFunFact + "<br><br>");
				$(endRoundTextDiv).append(img);
				$(endRoundTextDiv).hide().appendTo("#endRoundText").fadeIn(1000);
				
			};
		},

		//when called, shows the screen for when the game has ended
		endGameScreen: function() {
			$("#timer").empty();
			$("#question").empty();
			$("#answers").empty();
			$("#endRoundText").empty();
			var endRoundTextDiv = $("<div>");
			var img = $("<img>");
			img.addClass("imageResize");
			img.attr("src", "assets/images/coffeeend.gif");
			$(endRoundText).html("All done, heres how you did!<br>" + "Correct Answers: " + trivia.numCorrectAnswers
				+ "<br>Incorrect Answers: " + trivia.numIncorrectAnswers + "<br>Unanswered: " + trivia.numUnanswered + "<br><br>");
			$(endRoundTextDiv).append(img)
			$(endRoundTextDiv).hide().appendTo("#endRoundText").fadeIn(1000);
			
		},

		//resets the game to the first question
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
		trivia.startGameMusic();
	});
	
	$(document).on("click", ".answerChoice", function() {
		trivia.clickAnswer(this);
	});

	$(document).on("click", "#restartButton", function() {
		trivia.resetGame();
	});

	$(document).on("click", "#muteButton", function() {
		trivia.muteMusic();
	});

	window.onload = trivia.setMusic();


});