
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

#ifdef MICROBIT_QUIZ_QUIZMASTER

MicroBit uBit;

// The number of the question we're on in the current session
int questionID = 0;

// 4 capital letters randomly generated as the ID of the current session (ex.: EZAP)
ManagedString quizID;

// Number of possible answers for the current question
ManagedString alternatives;

const char * const radio_waves ="\
  000,000,000,000,000,  000,000,000,000,000,  000,000,255,255,255\n\
  000,000,000,000,000,  000,000,000,000,000,  000,255,000,000,000\n\
  000,000,000,000,000,  000,000,000,255,255,  255,000,000,255,255\n\
  000,000,000,000,000,  000,000,255,000,000,  255,000,255,000,000\n\
  000,000,000,000,255,  000,000,255,000,255,  255,000,255,000,255\n";

MicroBitImage radio(radio_waves);


/*
  Sends any received 'ans' datagrams through the serial line
*/

void onData(MicroBitEvent) {
  ManagedString message = uBit.radio.datagram.recv();

  if (message.substring(0,3) == "ans")
    uBit.serial.send(message);
}

/*
	When A is pressed, displays the session ID, number of the current question and the number of possible answers
	When B is pressed, sends a request for the next question through the serial line
*/

void onButton(MicroBitEvent e) {
  if (questionID) {
    if (e.source == MICROBIT_ID_BUTTON_A) {

      uBit.display.print(quizID);
      uBit.sleep(1000);
      uBit.display.clear();

      uBit.display.print(questionID);
      uBit.sleep(1000);
      uBit.display.clear();

      uBit.display.print(alternatives);
      uBit.sleep(1000);
      uBit.display.clear();
    }

    if (e.source == MICROBIT_ID_BUTTON_B) {
      uBit.serial.send("nxt;");
      uBit.display.print(">");
      uBit.sleep(500);
      uBit.display.clear();
    }

    uBit.sleep(20);
  }
}


/*
	On receiving data through the serial line, if we can recognise the id fire the corresponding function and send back an "ack;"
*/

void reader() {
    while(1) {
        ManagedString incoming = uBit.serial.readUntil(";") + ";";
        ManagedString id = incoming.substring(0,3);

        if (id == "set"){
            uBit.serial.send("ack;");
            uBit.display.animateAsync(radio, 500, 5, 0, 0);
            uBit.radio.datagram.send(incoming);
        }

        else if (id == "ack") {
            uBit.serial.send("ack;");
            uBit.radio.datagram.send(incoming);
        }
    }
}


int main() {
  // Initialise the micro:bit runtime.
  uBit.init();
  uBit.radio.enable();

  // Initialise the micro:bit listeners for radio datagrams and button events.
  uBit.messageBus.listen(MICROBIT_ID_RADIO, MICROBIT_RADIO_EVT_DATAGRAM, onData);
  uBit.messageBus.listen(MICROBIT_ID_BUTTON_A, MICROBIT_BUTTON_EVT_CLICK, onButton, MESSAGE_BUS_LISTENER_DROP_IF_BUSY);
  uBit.messageBus.listen(MICROBIT_ID_BUTTON_B, MICROBIT_BUTTON_EVT_CLICK, onButton, MESSAGE_BUS_LISTENER_DROP_IF_BUSY);

  // Sets the group to an arbitrary number (59 in this case) to avoid interference
  uBit.radio.setGroup(59);

  // Use the highest output put level on the radio, to increase range and reliability.
  uBit.radio.setTransmitPower(7);

  // Increase the receive buffer size on our serial port, to be at least the same size as
  // a packet. This guarantees correct parsing of packets.
  uBit.serial.setRxBufferSize(32);

  // Run a short animaiton at power up.
  uBit.display.animateAsync(radio, 500, 5, 0, 0);

  // Creates a new fiber that listens for incoming serial signals
  create_fiber(reader);

  // Get into powersaving sleep mode
  while(1)
    uBit.sleep(10000);
}

#endif
