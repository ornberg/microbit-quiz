
/*
The MIT License (MIT)

Copyright (c) 2016 British Broadcasting Corporation.
This software is provided by Lancaster University by arrangement with the BBC.

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
#include "MicroBitSamples.h"

#ifdef MICROBIT_SAMPLE_VOTER_STUDENT

MicroBit uBit;

// Sets the permanent serial number for identification purposes

ManagedString serial = uBit.getSerial();


// Sets a flag to see if this micro:bit is connected to the master

bool connectedFlag = 0 ;


// Sets the current session number

ManagedString sessionID;


// Sets the number of the current question of the session

int questionID; 


// Number of questions available answers in the current session

int numberOfAnswers;


// Number of the letter displayed so that char letter = 32+letterNumber

int letterNumber;


//The image of a tick

MicroBitImage tickImage("0,0,0,0,0\n0,0,0,0,1\n0,0,0,1,0\n1,0,1,0,0\n0,1,0,0,0\n");


//The image of a cross

MicroBitImage crossImage("1,0,0,0,1\n0,1,0,1,0\n0,0,1,0,0\n0,1,0,1,0\n1,0,0,0,1\n");


/*

	This method triggers when a datagram is received.
	
	The datagram is valid if it starts with "1:"
	
	The three expected messages are:
	
	A) "1:<the micro:bit's own serial number>"

	B) "1:<session ID>:<number of the question>:<number of possible answers>"
	
	C) "1:0"

*/

void onData(MicroBitEvent)
{
    ManagedString message = uBit.radio.datagram.recv();

	if (message.substring(2,10) == serial && (message.substring(0,2) == "1:"))
		connectedFlag = 1;
	else if (connectedFlag && !(sessionID == message.substring(0,4)) && (message.substring(0,2) == "1:")){
		int messageLength = message.length();
		sessionID = message.substring(2,6);
		int counter = 1;
		while(!(message.charAt(7+counter) == ":"))
			counter++;
		question = atoi(message.substring(7, counter).toCharArray());
		numberOfAnswers = atoi(message.substring(8 + counter, messageLength - 9).toCharArray());
		letterNumber = 0;
		uBit.display.print(char(65+letterNumber));
	} else if (message.charAt(2) == 0 && (message.substring(0,2) == "1:"))
		uBit.display.print("The session have ended");
}



/*

	This method triggers when a button is clicked.
	
	A and B are used to navigate between the available answers, AB is used to
	send the answer currently appearing on the screen and then display the 'tick' image.
	

*/


void onButton(MicroBitEvent e)
{	
    if (e.source == MICROBIT_ID_BUTTON_A){
		if(letterNumber == 0)
			letterNumber = numberOfAnswers;
		else
			letterNumber--;
		
		uBit.display.print(char(65+letterNumber));
	}

    if (e.source == MICROBIT_ID_BUTTON_B){
		if(letterNumber == numberOfAnswers-1)
			letterNumber = 0;
		else
			letterNumber++;
		
		uBit.display.print(char(65+letterNumber));
	}
	
	
	if (e.source == MICROBIT_ID_BUTTON_AB){
		ManagedString message = uBit.getSerial() + ":" + sessionID + ":" + questionID + ":" + letterNumber;
		uBit.radio.datagram.send(message);
		uBit.display.print("^");
		uBit.sleep(100);
		for(int i = 0; i < 6; i++){
			if(connectedFlag){
				connectedFlag = 0;
				uBit.display.print(tickImage);
				uBit.sleep(2000);
				uBit.display.clear();
			} else {
				if(i == 5){
					uBit.display.print(crossImage);
					uBit.sleep(2000);
					uBit.display.clear();
					uBit.display.print(char(65+letterNumber));
					break;
				}
				uBit.radio.datagram.send(message);
				uBit.display.clear();
				uBit.sleep(200);
				uBit.display.print("^");
				uBit.sleep(i * 1000);
				
			}
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
	
	// Sets the display mode to black & white to make sure our 'tick' and 'cross' images show up correctly
	uBit.display.setDisplayMode(DISPLAY_MODE_BLACK_AND_WHITE);

	
	
	// Get into powersaving sleep mode
	while(1)
		uBit.sleep(10000);

}

#endif
