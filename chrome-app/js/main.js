jQuery(document).ready(function($){

	//	Module handling
	//---------------------------------------------------------------------
	const animationSpeed = 200;
	var modules = $('.module');
	var module = modules.first();

	modules.hide();
	module.fadeIn(animationSpeed);

	$('.module-trigger').click(function() {
		doModuleSwap($(this).data('target'));
	});


	function doModuleSwap(target) {
		module.fadeOut(animationSpeed, function() {
			if (target) {
				module = $('.' + target);
				module.fadeIn(animationSpeed);
			}
			else {
				module = module.next(); //TODO what if no next?
				module.fadeIn(animationSpeed);
			}
		});
	}


	//	Quiz data structure
	//---------------------------------------------------------------------
	var quizzes = {};

	chrome.storage.local.get('quizzes', function (result) {
		if (Object.keys(result['quizzes']).length > 0) {
			quizzes = result['quizzes'];
			updateQuizList();
		}
	});

	function storeData() {
		chrome.storage.local.set({'quizzes': quizzes}, function() {});
	}

	function Quiz(id, name) {
		this.id = id;
		this.name = name;
		this.questions = [new Question()];
	}

	function Question() {
		this.title = 'Title';
		this.content = 'Content goes here';
		this.answers = ['Answer A', 'Answer B'];
	}

	var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	function generateQuizId() { //TODO need to check if exists
		var id = '';
		for (var i=0; i < 4; i++)
			 id += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
		return id;
	}


	//	Intro
	//---------------------------------------------------------------------
	function swapToModule_intro() { //wrapper function
		updateQuizList();
	}

	function updateQuizList() {
		$('.quiz-list div:not(:last-child)').remove();
		for (quizID in quizzes) {
			$('.create-quiz').before('<div class="white-box" data-quiz="' + quizID +'">'
				+ quizzes[quizID].name + '<span class="edit-quiz glyphicon glyphicon-pencil" '
				+ 'aria-hidden="true"></span></div>');
		}
		bindQuizListClick();
	}

	function bindQuizListClick() { //because DOM elements does not exists yet
		$('.white-box:not(:last-child)').click(function () { //TODO change name to something more fitting
			doModuleSwap('microbit-connect'); //TODO rename to moduleSwap()
			currentQuiz = quizzes[$(this).data('quiz')];
			log($(this).data('quiz'));
			log(quizzes);
			currentQuestionIndex = 0;
			attemptConnection();
		});
		$('.edit-quiz').click(function () {
			prepareModule_Edit(quizzes[$(this).parent().data('quiz')]);
		});
	}

	$('.create-quiz-button').click(function () {
		var newQuiz = new Quiz(generateQuizId(), $('#quiz-title').text());
		quizzes[generateQuizId()] = newQuiz;
		prepareModule_Edit(newQuiz);
	});


	//	Edit mode //TODO change names of edit mode to just 'edit'
	//---------------------------------------------------------------------
	var currentQuiz;
	var currentQuestionIndex = 0;

	function prepareModule_Edit(quiz) { //TODO use one function instead with a function as a parameter, called specifically for every module's needs
		currentQuiz = quiz;
		$('.edit-mode .name').text(currentQuiz.name);
		loadQuestion(0);
		doModuleSwap('edit-mode'); //TODO create jquery variables of modules instead of string identifier
	}

	function loadQuestion(q) {
		currentQuestionIndex = q;
		q = currentQuiz.questions[q];
		$('.edit-mode .title').text(q.title);
		$('.edit-mode .content').text(q.content);
		$('.question li:not(:last-child)').remove();
		for (var i = 0; i < q.answers.length; i++) { //TODO jquery for each?
			$('.question ul').prepend('<li><span class="marker center-vertically">' + alphabet.charAt(i)
				+'</span><span class="answer center-vertically" contenteditable="true">'
				+q.answers[i]+'</span></li>');
		}
	}

	function storeQuestion() { //TODO maybe saveQuestion instead?
		var q = currentQuiz.questions[currentQuestionIndex];
		q.title = $('.edit-mode .title').text();
		q.content = $('.edit-mode .content').text();
		var answers = [];
		$('.answer').each(function () {
			answers.push($(this).text());
		});
		q.answers = answers;
	}

	$('.exit-edit').click(function () {
		storeQuestion();
		storeData();
		updateQuizList(); // this will be called 'swap module intro'
	});

	var startOpacity = 0; //TODO get rid of drag and drop behavior
	$('.answers :not(:last-child)').draggable({
		start : function (event, ui) {
			startOpacity = $(this).css('opacity');
			log(startOpacity);
			$(this).css({opacity:0.4});
		},
		stop : function (event, ui) {
			$(this).css({opacity:startOpacity});
		},
		cursor : 'move',
		revert : true,
		revertDuration : 200,
		zIndex : 98
	});

	$('.delete').droppable({
		drop : function (event, ui) {
			ui.draggable.fadeTo(200, 0.01, function () {
				$(this).remove();
			});
		}
	});

	//TODO split into appropriate files
	//	Microbit connect
	//---------------------------------------------------------------------

	function ab2str(buf) {
		return String.fromCharCode.apply(null, new Uint8Array(buf));
	}

	function str2ab(str) {
	  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
	  var bufView = new Uint8Array(buf);
	  for (var i=0, strLen=str.length; i<strLen; i++) {
	    bufView[i] = str.charCodeAt(i);
	  }
	  return buf;
	}


	function attemptConnection() { //check if connection already has been made
		if (!connectionId)
			chrome.serial.getDevices(getDevices);
	}


	var connectionId;
	var getDevices = function(ports) {
		for (var i = 0; i < ports.length; i++) {
			var pathName = ports[i].path;
			var portName = ports[i].displayName;
			if ((portName == 'mbed Serial Port') || (portName == 'MBED CMSIS_DAP' && pathName.indexOf("tty") >= 0)) { //for windows and os x
				chrome.serial.connect(pathName, {bitrate: 115200}, onConnect);
				return;
			}
		}
		log("didn't find microbit :'( ");
	};

	function getCode(i) {
		return 'set:'+currentQuiz.id+':1:'+currentQuiz.questions[currentQuestionIndex].answers.length+';';

	}

	var onConnect = function(connectionInfo) { //TODO need to do disconnect on app exit
		connectionId = connectionInfo.connectionId;
		send(getCode(1), function() {}); //response from microbit will trigger loading of quiz
	}

	function send(str, callback) { //wrapper function

		chrome.serial.send(connectionId, str2ab(str), callback);
	}


	var stringReceived = '';
	var onReceiveCallback = function(info) { //receives data from serial in chunks
	    if (info.connectionId == connectionId && info.data) {
	      var str = ab2str(info.data);

	      if (str.charAt(str.length-1) === '\n') {
	        stringReceived += str.substring(0, str.length-1);
	        onLineReceived(stringReceived);
	        stringReceived = '';
	      }

	      else {
	        stringReceived += str;
	        if (str.indexOf(';')) //end of message
	        	parseMessage(stringReceived);
	        	stringReceived = '';
	      }
	    }
	};

	chrome.serial.onReceive.addListener(onReceiveCallback);

	function parseMessage(msg) { //or controller
		log('msg');
		log(msg);
		if (msg.substring(0,3) == 'ans') { //received answer from micro:bit
			var str = msg.split(':');
			if (str[1] == currentQuiz.id && str[2] == currentQuestionIndex) {
				if (!str[3] in responses) {
					responses[str[3]] = str[4];
					send('ack'+msg.substring(2,msg.length+1));
				}
			}
		}
		else if (msg.substring(0,3) == 'nxt') { //micro:bit controller asking for previous
			advanceQuiz();
		}
		else if (msg.substring(0,3) == 'ack') { //micro:bit start verification received
			prepareQuiz();
		}
	}

	var responses = {};

	//	Quiz!
	//---------------------------------------------------------------------
	function prepareQuiz() {
		var q = currentQuiz.questions[currentQuestionIndex];
		$('.quiz .title').text(q.title); //todo have a template and store jquery vars in the beginning of script
											// so that there are only one reference to the same object (instead of having
											// to look it up every single time)
		$('.quiz .content').text(q.content); //todo this could be the same html and so as the edit-mode thing
		$('.quiz ul li').remove();

		for (var i = 0; i < q.answers.length; i++) { //TODO jquery for each?
			$('.quiz ul').append('<li><span class="marker center-vertically">' + alphabet.charAt(i)
				+'</span><span class="answer center-vertically">'
				+q.answers[i]+'</span></li>');
		}

		doModuleSwap('quiz');
	}

	function advanceQuiz() {
		//increase current question index OR display results
	}

});


function log(message) {
	console.log(message);
}
