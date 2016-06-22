
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

int connectedFlag = 0 ;


// Sets the current session number

ManagedString sessionID = "abcD";


// Sets the number of the current question of the session

int questionID = 4; 


// Number of questions available answers in the current session

int numberOfAnswers;


// Number of the letter displayed so that char letter = 32+letterNumber

int letterNumber;


// While this equals 0, it blocks the buttons A and B until next question arrives

int buttonBlock = 0;


//The image of a tick

MicroBitImage tickImage("0,0,0,0,0\n0,0,0,0,1\n0,0,0,1,0\n1,0,1,0,0\n0,1,0,0,0\n");


//The image of a cross

MicroBitImage crossImage("1,0,0,0,1\n0,1,0,1,0\n0,0,1,0,0\n0,1,0,1,0\n1,0,0,0,1\n");


/*

	This method triggers when a datagram is received.
	
	The datagram is turned into a PacketBuffer from which point p[0] can be:
	
	1) A start sequence to connect to the master micro:bit
	
	2) The micro:bit's own serial as a confirmation of connection
	
	3) The details of the session such as the first 4 characters are the session ID, then a ':', then the number of
	   the current question. In this case the PacketBuffer has also got a p[1] which is the number of possible answers.

*/

void onData(MicroBitEvent)
{
    ManagedString s = uBit.radio.datagram.recv();
	if(s == "1:0001")
		uBit.radio.datagram.send(serial);
	else if (s == serial && !connectedFlag)
		connectedFlag = 1;
	else if (connectedFlag && !(sessionID == s.substring(0,4))){
		sessionID = s.substring(2,6);
		questionID = atoi((s.substring(7,s.length())).toCharArray());
		numberOfAnswers = s.charAt(s.length()-1)-48;
		letterNumber = 0;
		buttonBlock = 1;
		uBit.display.print(char(65+letterNumber));
	}
}



/*

	This method triggers when a button is clicked.
	
	If the buttonBlock equals '1', A and B are used to navigate between the available answers, AB is used to
	send the answer currently appearing on the screen and then display the 'tick' image.
	
	If the buttonBlock equals '0', the 'cross' image appears briefly instead without anything else happening.

*/


void onButton(MicroBitEvent e)
{	
    if (e.source == MICROBIT_ID_BUTTON_A && buttonBlock){
		if(letterNumber == 0)
			letterNumber = numberOfAnswers;
		else
			letterNumber--;
		
		uBit.display.print(char(65+letterNumber));
	}

    if (e.source == MICROBIT_ID_BUTTON_B && buttonBlock){
		if(letterNumber == numberOfAnswers-1)
			letterNumber = 0;
		else
			letterNumber++;
		
		uBit.display.print(char(65+letterNumber));
	}
	
	
	if (e.source == MICROBIT_ID_BUTTON_AB && buttonBlock){
		ManagedString s = sessionID + ":" + questionID + ":" + letterNumber;
		uBit.radio.datagram.send(s);
		buttonBlock = 0;
		uBit.display.print(tickImage);
		uBit.sleep(200);
	}
	
	if (!buttonBlock){
		uBit.display.print(crossImage);
		uBit.sleep(500);
		uBit.display.clear();
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

	
	ManagedString s = sessionID + ":" + questionID;
	uBit.serial.send(s);
	
	
	// Get into powersaving sleep mode
	while(1)
		uBit.sleep(10000);

}

#endif
