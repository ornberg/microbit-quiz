//var currentQuiz = new Quiz("Test Quiz");
var currentQuestion = new qQuestion("Do you like chocolate?", ["Yes", "No", "Hey, who knows", "Maybe", "Pick me if you don't pick another"]);

function Serial(dataCallback)
{
    var connected = false;
    var CONNECTION_INFO = null;
    var serialBuffer = [];
    chrome.serial.onReceive.addListener(onData);
    chrome.serial.onReceiveError.addListener(onError);

    function onData(received)
    {
        var data = String.fromCharCode.apply(null, new Uint8Array(received.data));
        serialBuffer.push(data);
        if (data.lastIndexOf(";") > -1) { //full command received
            var response = serialBuffer.join("");
            parsedResponse = response.split(/[;:]+/);
            parsedResponse.pop(); //remove empty index
            if (!connected && parsedResponse[0] === "ack") {
              connected = true;
            }
            dataCallback(parsedResponse);
            serialBuffer = [];
        }
    }

    function onError(err) {
      if (!(err.error === "device_lost") && !(err.error === "disconnected") && !(err.error === "break"))  
        throw new Error(err.error); //unknown error
      connected = false;
    }

    function utf8AbFromStr(str)
    {
        var strUtf8 = unescape(encodeURIComponent(str));
        var ab = new Uint8Array(strUtf8.length);
        for (var i = 0; i < strUtf8.length; i++) {
            ab[i] = strUtf8.charCodeAt(i);
        }
        return ab;
    }

    function strFromUtf8Ab(ab)
    {
        return escape(decodeURIComponent(String.fromCharCode.apply(null, ab)));
    }

    function write(str)
    {
        if (CONNECTION_INFO)
        {
            chrome.serial.send(CONNECTION_INFO.connectionId, utf8AbFromStr(string).buffer, function(info) {
                console.log(info);
            });
        }
    }

    function getMicrobitPort(callback) {
      chrome.serial.getDevices(function(portList) {
        for (var i = 0; i < portList.length; i++) {
          var port = portList[i];
          if ((port.displayName == 'mbed Serial Port') || ((port.displayName == 'MBED CMSIS_DAP') && (port.path.indexOf("tty") >= 0))) { //for windows and os x
              return callback(port);
          }
        }
        callback(null);
      });
    }

    function connect(callback) {
      getMicrobitPort(function(port) {
        if (port) {
          chrome.serial.connect(port.path, {bitrate: 115200}, function(connectionInfo) {
            if (chrome.runtime.lastError) {
              CONNECTION_INFO = null;
              connected = false;
              console.log(chrome.runtime.lastError.message);
              return callback(connected);
            }
            else {
              CONNECTION_INFO = connectionInfo;
              s.write("ack;");
              setTimeout(function() {
                if (!connected) {
                  console.log("Connected microbit isn't flashed with the correct program");
                  callback(false);
                }
                else {
                  callback(true);
                }
              }, 3000);
            }
          });
        }
        else {
          connected = false;
          callback(false);
        }
      });
      //app.QuizBitActions.updateConnectionState();
    }

    connect(()=>{});

    return {
        "write": function(str)
        {
            if (CONNECTION_INFO)
            {
                chrome.serial.send(CONNECTION_INFO.connectionId, utf8AbFromStr(str).buffer, function(info) {
                    if (info.error) {
                        console.log("Error: unable to contact micro:bit");
                        s = new Serial(dataCallback); //try reinstatiating the serial connection
                    }

                });
            }
        },
        "isConnected": function() {
          return connected;
        },
        "reconnect": function(callback) {
          if (connected)
            return callback(true);
          connect(callback);
        }
    }

}


function qQuiz(name)
{
    var name;
    var id = "ABCD";
    var questions = [];

    return {
        "addQuestion": function(q) {
            if (q.constructor.name != "Question")
                throw new Error("");
            else
                questions.add(q);
        },
        "start": function() {

        }
    }
}

function qQuestion(desc, ans)
{
    var answers = [];
    var votes = {
        "count": 0
    };
    var quizName = name;

    for (var i = 0; i < ans.length; i++)
        answers.push({desc: ans[i], count: 0});

    return {
        "addVote": function(microbitId, answerId) {
            if (typeof votes[microbitId] === "undefined") {
                votes[microbitId] = true;
                answers[answerId].count++;
                votes.count++;
            }
        },
        "getDesc": function() {
            return desc;
        },
        "getVoteCount": function() {
            return votes.count;
        },
        "getAnswerList": function() {
            return answers.map(function(ans) {
                return ans.desc;
            });
        },
        "getAnswerCounts": function() {
            return answers.map(function(ans) {
                return ans.count;
            });
        },
    }
}

var s = new Serial(function(data) {
    if (data[0] === "ans") {
        currentQuestion.addVote(data[3], data[4]);
        var cmd = "ack:" + data.join(":").substring(4) + ";"; //always ack even if it's a resubmission
        s.write(cmd);
    }
    else if (data[0] === "ack") {
      connected = true;
    }
});
