$(document).ready(function() {


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
			question: "Coffee Break",
			answers:"",
			corectAnswer:"",
			funFact:"",
			image: "assets/images/coffeebreak.gif"
		},
		{
			question: "5. What's the origin for the word jazz?",
			answers: ["A: French jaser, meaning to chat", "B: Baseball", "C: Ragtime spirit", "D: Enthusiasm", "E: Sex term ;)"],
			correctAnswer: "E: Sex term ;)",
			funFact: "Jazz was a slang and noun that derived from jism. As a verb, it meant to 'make love'",
			image: "assets/images/jazz.jpg"

		},
		{
			question: "6. Cats purr when in pain?",
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

		startTime: function() {
			if(trivia.roundEnd === false) {
				$("#timer").empty();
				if(trivia.currentQuestion === 5) {
					trivia.time = 8;
				}
				else{
					trivia.time = 30;
					var timerDiv = $("<div>");
					$(timerDiv).append("Time Remaining: " + trivia.time + " Seconds" + "<br><br>");
					$(timerDiv).hide().appendTo("#timer").fadeIn(1000);
				};

			}
			else if(trivia.roundEnd === true) {
				trivia.time = 1;
			}
			trivia.intervalId = setInterval(trivia.timeCountDown, 1000);
		},

		timeCountDown: function() {
			if(trivia.roundEnd === false && trivia.currentQuestion !== 5) {
				trivia.time--;
				$("#timer").html("Time Remaining: " + trivia.time + " Seconds" + "<br><br>");
				if(trivia.time === 0) {
					trivia.numUnanswered++;
					trivia.stopTime();
					trivia.roundEndScreen();
					trivia.playWrongSound();
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
						$("#restartButton").fadeToggle(1000);
					};
				};
			}
			else if(trivia.currentQuestion === 5) {
				trivia.time--;
				if(trivia.time === 0) {
					clearInterval(trivia.intervalId);
					trivia.getQuestion();
				}
			}
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
			if(trivia.currentQuestion === 5){
				var img = $("<img>");
				img.addClass("imageResize");
				img.attr("src", trivia.currentImage);
				$(img).hide().appendTo("#endRoundText").fadeIn(1000);
			}
			trivia.startTime();
		},

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

		playWrongSound: function() {
			if(trivia.mute === false){
				document.getElementById("wrong").src = trivia.sounds[trivia.randomSound];
				document.getElementById("wrong").play();
				trivia.randomSound++;
				if(trivia.randomSound > 2){
					trivia.randomSound = 1;
				}
			}
		},

		playCorrectSound: function(){
			if(trivia.mute === false){
				document.getElementById("correct").play();
			}
		},

		setMusic: function(){
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

		muteMusic: function(){
			if(trivia.mute === false) {
				document.getElementById("music").pause();
				trivia.mute = true;
			}
			else {
				trivia.mute = false;
				if(trivia.startMusic === true){
					document.getElementById("music").play();
				}
			};
		},

		startGameMusic: function(){
			if(trivia.mute === false){
				document.getElementById("music").play();
			}
			trivia.startMusic = true;
		},

		roundEndScreen: function(yourGuess) {
			$("#question").empty();
			$("#answers").empty();
			var endRoundTextDiv = $("<div>");
			var img = $("<img>");
			img.addClass("imageResize");
			img.attr("src", trivia.currentImage);
			
			if(yourGuess === "correct"){
				$(endRoundTextDiv).html("Correct<br><br>" + trivia.currentFunFact + "<br><br>");
				$(endRoundTextDiv).append(img);
				$(endRoundTextDiv).hide().appendTo("#endRoundText").fadeIn(1000);
			}
			else if(yourGuess === "incorrect"){
				$(endRoundTextDiv).html("Nope<br>The correct answer is " + trivia.currentAnswer + "<br><br>" + trivia.currentFunFact
					+ "<br><br>");
				$(endRoundTextDiv).append(img);
				$(endRoundTextDiv).hide().appendTo("#endRoundText").fadeIn(1000);
				
			}
			else{
				$(endRoundTextDiv).html("Ran out of time!<br>The correct answer is " + 
					trivia.currentAnswer + "<br><br>" + trivia.currentFunFact + "<br><br>");
				$(endRoundTextDiv).append(img);
				$(endRoundTextDiv).hide().appendTo("#endRoundText").fadeIn(1000);
				
			};
		},

		endGameScreen: function(){
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