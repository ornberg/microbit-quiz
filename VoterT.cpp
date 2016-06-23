
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

#ifdef MICROBIT_SAMPLE_VOTER_TEACHER

MicroBit uBit;

// The number of the question we're on in the current session

int question = 1;

// 4 capital letters randomly generated as the ID of the current session (ex.: EZAP)

ManagedString session;

// Number of possible answers for the current question

ManagedString numberOfAnswers;


/*

	Sets up the session ID, the number of the question and the number of answers based on a serial message,
	then send it out to the listening micro:bits
	
	ex.: "1:EZAP:3:4" is the third question of session 'EZAP' with the possible answers A, B, C and D

*/

void option1(ManagedString incoming){
	if(session == incoming.substring(2,4)){
					question++;
				} else {
					question = 1;
				}
				session = incoming.substring(2,4);
				numberOfAnswers = incoming.charAt(7);
				ManagedString message = "1:" + session + ":" + question + ":" + numberOfAnswers;
				uBit.radio.datagram.send(message);
}


/*

	Sends back the serial number of a micro:bit as connection verification
	
	ex.: "1:1232654392"

*/

void option2(ManagedString incoming){
	ManagedString message = "1:" + incoming.substring(2,incoming.length()-2);
	uBit.radio.datagram.send(message);
}

/*

	Sets up the session ID, the number of the question and the number of answers based on a serial message
	without sending it (same as option 1 without sending)

*/

void option3(ManagedString incoming){
	if(session == incoming.substring(2,4)){
		question++;
	} else {
		question = 1;
	}
	session = incoming.substring(2,4);
	numberOfAnswers = incoming.substring(7, incoming.length()-7);
	
}

/*

	Send out the session ID, number of the current question and the number of possible answers to the listening micro:bits
	(same as option 1 without changin any value)
	
	ex.: "1:EZAP:3:4" is the third question of session 'EZAP' with the possible answers A, B, C and D

*/

void option4(){
	ManagedString message = "1:" + session + ":" + question + ":" + numberOfAnswers;
	uBit.radio.datagram.send(message);
}


/*

	Sends back an error message through the serial line

*/

void option5(){
	uBit.radio.datagram.send("1:0");
}


/*

	Displays the session ID on the LED display

*/

void option6(){
	uBit.display.print(session);
	uBit.sleep(1000);
	uBit.display.clear();
}


/*

	Displays the number of the current question on the LED display

*/

void option7(){
	uBit.display.print(question);
	uBit.sleep(1000);
	uBit.display.clear();
}


/*

	Displays the number of possible answers for the current question on the LED display

*/

void option8(){
	uBit.display.print(numberOfAnswers);
	uBit.sleep(1000);
	uBit.display.clear();
}



/*
	
	Sends any received datagrams through the serial line
	
*/

void onData(MicroBitEvent)
{
    ManagedString s = uBit.radio.datagram.recv();
	uBit.serial.send(s);
}

/*

	When A is pressed, displays the session ID, number of the current question and the number of possible answers
	
	When B is pressed, sends a request for the next question through the serial line

*/

void onButton(MicroBitEvent e)
{	
    if (e.source == MICROBIT_ID_BUTTON_A){
			option6();
			option7();
			option8();
		}

    if (e.source == MICROBIT_ID_BUTTON_B){
		uBit.serial.send("1:1");
		uBit.display.print(">");
		uBit.sleep(500);
		uBit.display.clear();
	}
		
}


/*

	On receiving data through the serial line, reads it and fire a function according to the message id.
	If no id is recognised, sends back an error message

*/

void reader()
{
	char first;
	while(1){
		if(first = uBit.serial.read(SYNC_SLEEP)){
			uBit.sleep(50);
			int length = uBit.serial.rxBufferedSize();
			char c[length+2];
			c[0] = first;
			for(int i = 1; i < length+1; i++)
				c[i] = uBit.serial.read(SYNC_SLEEP);
			c[length+1] = 0;
			ManagedString incoming = c;
			
			ManagedString id = incoming.charAt(0);
			if(id == "1"){
				option1(incoming);
			} else if (id == "2"){
				option2(incoming);
			} else if(id == "3"){
				option3(incoming);
			} else if(id == "4"){
				option4();
			} else if(id == "5"){
				option5();
			} else {
				uBit.serial.send("101010");
			}
		}
		
		uBit.sleep(50);
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
	
	// Creates a new fiber that listens for incoming serial signals
	create_fiber(reader);
	
	// Get into powersaving sleep mode
	while(1)
        uBit.sleep(10000);
}

#endif
