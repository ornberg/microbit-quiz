
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

int question = 0;

int numberOfAnswers;



void onData(MicroBitEvent)
{
    PacketBuffer p = uBit.radio.datagram.recv();
	ManagedString s = p[0];
	if (s.length() == 10)
		uBit.radio.datagram.send(p);
}

void onButton(MicroBitEvent e)
{	
    if (e.source == MICROBIT_ID_BUTTON_A){
			uBit.radio.datagram.send("0001");
			uBit.serial.send("1:0001");
			uBit.sleep(100);
		}

    if (e.source == MICROBIT_ID_BUTTON_B){
		char session[5];
		for (int i = 0; i < 4; i++)
			session[i] = 65 + uBit.random(26);
		session[4] = 0;
		ManagedString s = session;
		question++;
		numberOfAnswers = 2 + uBit.random(4);
		ManagedString message = "1:" + s + ":" + question + ":" + numberOfAnswers;
		uBit.serial.send(message);
		uBit.sleep(100);
	}
	
	
	if (e.source == MICROBIT_ID_BUTTON_AB){
	}		
}


int main()
{
     // Initialise the micro:bit runtime.
    uBit.init();
    uBit.radio.enable();
    uBit.messageBus.listen(MICROBIT_ID_RADIO, MICROBIT_RADIO_EVT_DATAGRAM, onData);
    uBit.messageBus.listen(MICROBIT_ID_BUTTON_A, MICROBIT_BUTTON_EVT_CLICK, onButton);
    uBit.messageBus.listen(MICROBIT_ID_BUTTON_B, MICROBIT_BUTTON_EVT_CLICK, onButton);
    uBit.messageBus.listen(MICROBIT_ID_BUTTON_AB, MICROBIT_BUTTON_EVT_CLICK, onButton);
	
		
	while(1)
    {
        uBit.sleep(10000);
    }
}

#endif
