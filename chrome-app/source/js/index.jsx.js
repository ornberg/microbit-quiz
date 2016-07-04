//var currentQuiz = new Quiz("Test Quiz");
var currentQuestion = new Question("Do you like chocolate?", ["Yes", "No"]);

function Serial(dataCallback)
{

    var MICROBIT_PORT = CONNECTION_INFO = null;
    var serialBuffer = [];

    function getMicrobit(portList)
    {
        for (var i = 0; i < portList.length; i++) {
            var port = portList[i];
            if ((port.displayName == 'mbed Serial Port') || ((port.displayName == 'MBED CMSIS_DAP') && (port.path.indexOf("tty") >= 0))) { //for windows and os x
                MICROBIT_PORT = port;
                break;
            }
        }
        if (MICROBIT_PORT)
            connectToMicrobit();
        else {
            console.log("No microbit :(");
        }
    }

    function connectToMicrobit(callback)
    {
        chrome.serial.connect(MICROBIT_PORT.path, {bitrate: 115200}, function(connectionInfo) {
            CONNECTION_INFO = connectionInfo;
            console.log("CONNECTED.");
        });
        chrome.serial.onReceive.addListener(onData);
    }

    function onData(received)
    {
        var data = String.fromCharCode.apply(null, new Uint8Array(received.data));
        serialBuffer.push(data);
        if (data.lastIndexOf(";") > -1) { //full command received
            var response = serialBuffer.join("");
            parsedResponse = response.split(/[;:]+/);
            parsedResponse.pop(); //remove empty index
            dataCallback(parsedResponse);
            serialBuffer = [];
        }
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

    chrome.serial.getDevices(getMicrobit);

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
        }
    }

}


function Quiz(name)
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

function Question(desc, ans)
{
    var answers = [];
    var votes = {
        "count": 0
    };
    var quizName = name;

    for (var i = 0; i < ans.length; i++)
        answers.push({desc: ans[i], count: 0});

    return {
        "addVote": function(microbitId) {
            if (typeof votes[microbitId] === "undefined") {
                votes[microbitId] = true;
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
                return ans.name;
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
        currentQuestion.addVote(data[3]);
        var cmd = "ack:" + data.join(":").substring(4) + ";"; //always ack even if it's a resubmission
        console.log(cmd);
        s.write(cmd);
    }
});
