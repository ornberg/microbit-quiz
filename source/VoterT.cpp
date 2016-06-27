
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

#ifdef MICROBIT_SAMPLE_VOTER_TEACHER

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
  Sets up the session ID, the number of the questionID and the number of answers based on a serial message,
  then send it out to the listening micro:bits
  ex.: incoming == "set:ABCD:1:4;"
*/

void set(ManagedString incoming) {
  uBit.display.animateAsync(radio, 500, 5, 0, 0);
  uBit.radio.datagram.send(incoming);
}


/*
  Sends the received answer from a micro:bit through the serial line
  example: incoming == "ans:ABCD:1:012345689:2;"
*/

void ans(ManagedString incoming) {
  uBit.serial.send(incoming);
}


/*
  Sends back an acknowledgement received through the serial line to the other micro:bits as a datagram
  example: income == "ack:ABCD:1:012345689:2;"
*/

void ack(ManagedString incoming) {
  uBit.radio.datagram.send(incoming);
}


/*
  Broadcast a kill signal to the micro:bits
*/

void stp() {
  uBit.radio.datagram.send("stp;");
}


/*
  Displays the session ID on the LED display
*/

void displayQuizID() {
  uBit.display.print(quizID);
  uBit.sleep(1000);
  uBit.display.clear();
}


/*
  Displays the number of the current question on the LED display
*/

void displayQuestionID() {
  uBit.display.print(questionID);
  uBit.sleep(1000);
  uBit.display.clear();
}


/*
  Displays the number of possible answers for the current question on the LED display
*/

void displayAlternatives() {
  uBit.display.print(alternatives);
  uBit.sleep(1000);
  uBit.display.clear();
}



/*
  Sends any received 'ans' datagrams through the serial line
*/

void onData(MicroBitEvent) {
  ManagedString message = uBit.radio.datagram.recv();

  if (message.substring(0,3) == "ans")
    ans(message);
}

/*
	When A is pressed, displays the session ID, number of the current question and the number of possible answers
	When B is pressed, sends a request for the next question through the serial line
*/

void onButton(MicroBitEvent e) {
  if (e.source == MICROBIT_ID_BUTTON_A){
    displayQuizID();
    displayQuestionID();
    displayAlternatives();
  }

  if (e.source == MICROBIT_ID_BUTTON_B){
    uBit.serial.send("nxt;");
    uBit.display.print(">");
    uBit.sleep(500);
    uBit.display.clear();
  }

  uBit.sleep(20);
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
            set(incoming);
        } else if (id == "ack") {
            uBit.serial.send("ack;");
            ack(incoming);
        } else if (id == "stp") {
            uBit.serial.send("ack;");
            stp();
        }
    }
}


int main() {
  // Initialise the micro:bit runtime.
  uBit.init();
  uBit.radio.enable();

  // Initialise the micro:bit listeners for radio datagrams and button events.
  uBit.messageBus.listen(MICROBIT_ID_RADIO, MICROBIT_RADIO_EVT_DATAGRAM, onData);
  uBit.messageBus.listen(MICROBIT_ID_BUTTON_A, MICROBIT_BUTTON_EVT_CLICK, onButton);
  uBit.messageBus.listen(MICROBIT_ID_BUTTON_B, MICROBIT_BUTTON_EVT_CLICK, onButton);

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
