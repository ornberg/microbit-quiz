//var currentQuiz = new Quiz("Test Quiz");
var currentQuestion = new qQuestion("Do you like chocolate?", ["Yes", "No", "Hey, who knows", "Maybe", "Pick me if you don't pick another"]);

export function Serial(dataCallback, connectCallback)
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
            var parsedResponse = response.split(/[;:]+/);
            parsedResponse.pop(); //remove empty index
            if (!connected && parsedResponse[0] === "ack") {
              connected = true;
              connectCallback(connected);
            }
            dataCallback(parsedResponse);
            serialBuffer = [];
        }
    }

    function onError(err) {
      if (!(err.error === "device_lost") && !(err.error === "disconnected") && !(err.error === "break"))
        throw new Error(err.error); //unknown error
      connected = false;
      connectCallback(connected);
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
          console.log(str);
            chrome.serial.send(CONNECTION_INFO.connectionId, utf8AbFromStr(str).buffer, function(info) {
                //console.log(info);
                //if (info.error) ...
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
              connectCallback(connected);
              console.log(chrome.runtime.lastError.message);
              return callback(connected);
            }
            else {
              CONNECTION_INFO = connectionInfo;
              write("ack;");
              setTimeout(function() {
                if (!connected) {
                  console.log("Connected microbit isn't flashed with the correct program");
                  callback(false);
                }
                else {
                  callback(true);
                }
              }, 5000);
            }
          });
        }
        else {
          connected = false;
          connectCallback(connected);
          callback(false);
        }
      });
      //app.QuizBitActions.updateConnectionState();
    }

    connect(()=>{});

    return {
        "write": function(str)
        {
            write(str);
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
