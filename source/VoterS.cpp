
/*
The MIT License (MIT)

Copyright (c) 2016 Lancaster University, UK.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
*/

#include "MicroBit.h"
#include "MicroBitQuiz.h"

#ifdef MICROBIT_SAMPLE_VOTER_STUDENT

MicroBit uBit;

// Sets the permanent serial number for identification purposes

ManagedString serial = uBit.getSerial();


// Sets a flag to see if this micro:bit is connected to the master

bool connectedFlag = 0 ;
bool voted = true;


// Sets the current session number

ManagedString quizID;


// Sets the number of the current question of the session

int questionID;


// Number of questions available answers in the current session

int alternatives;


// Number of the letter displayed so that char letter = 32 + letterNumber

int letterNumber;


//

ManagedString answer;


//The image of a tick

MicroBitImage tickImage("0,0,0,0,0\n0,0,0,0,1\n0,0,0,1,0\n1,0,1,0,0\n0,1,0,0,0\n");


//The image of a cross

MicroBitImage crossImage("1,0,0,0,1\n0,1,0,1,0\n0,0,1,0,0\n0,1,0,1,0\n1,0,0,0,1\n");

MicroBitImage smileyImage("\
    000,255,000,255,000\n\
    000,000,000,000,000\n\
    000,000,000,000,000\n\
    255,000,000,000,255\n\
    000,255,255,255,000\n");

/*

	This method triggers when a datagram is received.

	The three expected messages are:

	A) "set:<quizID>:<questionID>:<alternatives>;"

	B) "ack:<quizID>:<questionID>:<serial>:<answer>;"

	C) "stp;"

*/

void onData(MicroBitEvent)
{
    ManagedString message = uBit.radio.datagram.recv();

	int counter = 0;

	if(message.substring(0,3) == "set"){
		ManagedString incomingQuizID = message.substring(4,4);
		ManagedString incomingQuestionID;
		ManagedString incomingAlternatives;

		while(message.charAt(9 + counter) != 58){ // 58 is the ASCII value of ":"
			incomingQuestionID = incomingQuestionID + message.charAt(9 + counter);
			counter++;
		}
		while(message.charAt(10 + counter) != 59){
			incomingAlternatives = incomingAlternatives + message.charAt(10 + counter);
			counter++;
		}

		if(!((incomingQuizID == quizID) && (incomingQuestionID == questionID))){
			quizID = incomingQuizID;
			questionID = atoi(incomingQuestionID.toCharArray());
			alternatives = atoi(incomingAlternatives.toCharArray());
			letterNumber = 0;
            voted = false;
			uBit.display.print(char(65 + letterNumber));
		}
	} else if (message == ("ack:" + answer) ){
		connectedFlag = 1;
	} else if (message == "stp;"){
		uBit.display.scrollAsync("FINISHED!");
	}
}



/*

	This method triggers when a button is clicked.

	A and B are used to navigate between the available answers, AB is used to
	send the answer currently appearing on the screen and then display the 'tick' image.


*/


void onButton(MicroBitEvent e)
{
    // if we've already voted in this round, then ignore user input until a new question is announced.
    if (voted)
        return;

    if (e.source == MICROBIT_ID_BUTTON_A){
		if(letterNumber == 0)
			letterNumber = alternatives-1;
		else
			letterNumber--;

		uBit.display.print(char(65+letterNumber));
	}

    if (e.source == MICROBIT_ID_BUTTON_B){
		if(letterNumber == alternatives-1)
			letterNumber = 0;
		else
			letterNumber++;

		uBit.display.print(char(65+letterNumber));
	}


	if (e.source == MICROBIT_ID_BUTTON_AB){
		answer = quizID + ":" + questionID + ":" + serial + ":" + letterNumber + ";";
		ManagedString message = "ans:" + answer;
		int counter = 1;

		while (!connectedFlag && counter <= 5)
		{
			uBit.radio.datagram.send(message);
		    uBit.display.printAsync("^");
			uBit.sleep(counter * 200);
		    uBit.display.clear();
			uBit.sleep(200);
			counter++;
		}
		if(connectedFlag){
			connectedFlag = 0;
            voted = true;
			uBit.display.print(tickImage);
			uBit.sleep(2000);
            uBit.display.print(smileyImage);
		} else {
			uBit.display.print(crossImage);
			uBit.sleep(2000);
			uBit.display.clear();
			uBit.display.print(char(65+letterNumber));
		}
	}
}




int main()
{
     // Initialise the micro:bit runtime.
    uBit.init();
	uBit.radio.enable();

	// Initialise the micro:bit listeners for radio datagrams and button events.
	uBit.messageBus.listen(MICROBIT_ID_RADIO, MICROBIT_RADIO_EVT_DATAGRAM, onData);
	uBit.messageBus.listen(MICROBIT_ID_BUTTON_A, MICROBIT_BUTTON_EVT_CLICK, onButton);
    uBit.messageBus.listen(MICROBIT_ID_BUTTON_B, MICROBIT_BUTTON_EVT_CLICK, onButton);
    uBit.messageBus.listen(MICROBIT_ID_BUTTON_AB, MICROBIT_BUTTON_EVT_CLICK, onButton);

	// Sets the group to an arbitrary number (59 in this case) to avoid interference
	uBit.radio.setGroup(59);

    // Use the highest output put level on the radio, to increase range and reliability.
    uBit.radio.setTransmitPower(7);

    uBit.display.print(smileyImage);

	// Get into powersaving sleep mode
	while(1)
		uBit.sleep(10000);

}

#endif
