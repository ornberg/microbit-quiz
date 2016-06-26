using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.Windows.Forms;
using System.IO.Ports;

/*
 * <cmd>:<quiz_id>:<question_id>:<alternatives>;
 * 
 * cmd = 3 chars. ["set" | "ans" ]
 * quiz_id = 4 chars.
 * question id = up tp 2 digits.
 * alternatives = up to 2 digits.
 *
 * e.g. "set:ABCD:1:2;"
 * 
 * response:
 * <cmd>:<quiz_id>:<question_id>:<serial>:<choice>;
 *
 */ 
 

namespace microbit_vote
{

    public struct Vote
    {
        public string  id;
        public int choice;
    }

    public partial class microbitVoteForm : Form
    {
        SerialPort port = new SerialPort();
        Thread t, scanner, advertiser;
        string quizId = "QZ00";
        bool quizRunning = false;

        List<Vote> votes = new List<Vote>();

        // This delegate enables asynchronous calls for setting
        // the text property on a TextBox control.
        delegate void SetTextCallback(string text);
        private void SetText(string text)
        {
            // InvokeRequired required compares the thread ID of the
            // calling thread to the thread ID of the creating thread.
            // If these threads are different, it returns true.
            if (this.resultTotal.InvokeRequired)
            {
                SetTextCallback d = new SetTextCallback(SetText);
                this.Invoke(d, new object[] { text });
            }
            else
            {
                this.resultTotal.Text = text;
            }
        }

        delegate void EnablePortSelectionCallback(string[] ports);
        private void enablePortSelection(string[] ports)
        {
            // InvokeRequired required compares the thread ID of the
            // calling thread to the thread ID of the creating thread.
            // If these threads are different, it returns true.
            if (this.connectButton.InvokeRequired || this.comportListBox.InvokeRequired)
            {
                EnablePortSelectionCallback d = new EnablePortSelectionCallback(enablePortSelection);
                this.Invoke(d, new object[] { ports });
            }
            else
            {
                foreach (string s in ports)
                    this.comportListBox.Items.Add(s);

                this.comportListBox.Visible = true;
                this.connectButton.Visible = true;
            }
        }

        delegate void EnableVotingCallback();
        private void enableVoting()
        {
            // InvokeRequired required compares the thread ID of the
            // calling thread to the thread ID of the creating thread.
            // If these threads are different, it returns true.
            if (this.startVoteButton.InvokeRequired || this.seeResultsButton.InvokeRequired)
            {
                EnableVotingCallback d = new EnableVotingCallback(enableVoting);
                this.Invoke(d);
            }
            else
            {
                this.startVoteButton.Enabled = true;
                this.seeResultsButton.Enabled = true;
            }
        }


        public microbitVoteForm()
        {
            InitializeComponent();
        }

        private void microbitVoteForm_Load(object sender, EventArgs e)
        {
            scanner = new System.Threading.Thread(new ThreadStart(portScanner));
            scanner.Start();
        }

        private void portScanner()
        {
            string[] ports = SerialPort.GetPortNames();

            while (ports.Length == 0)
            {
                Thread.Sleep(1000);
                ports = SerialPort.GetPortNames();
            }

            if (ports.Length > 1)
                this.enablePortSelection(ports);
            else
                this.serialConnect(ports[0]);
        }

        private void serialConnect(string comport)
        {
            port.PortName = comport;
            port.BaudRate = 115200;
            port.DataBits = 8;
            port.StopBits = StopBits.One;
            port.Parity = Parity.None;

            port.ReadTimeout = SerialPort.InfiniteTimeout;
            port.Open();

            t = new System.Threading.Thread(new ThreadStart(serialListener));
            t.Start();

            this.enableVoting();
        }

        private void connectButton_Click(object sender, EventArgs e)
        {
            if (this.comportListBox.SelectedIndex >= 0)
            {
                this.connectButton.Enabled = false;
                this.serialConnect((string) this.comportListBox.SelectedItem);
            }
        }

        private void serialListener()
        {
            string s = "";
            char[] delims = { ';', ':' };
            while (true)
            {
                try
                {
                    s = port.ReadTo(";");
                    Console.WriteLine("[" + s + "]");

                    string[] p = s.Split(delims);
                    if (p.Length == 5 && p[0].Equals("ans") && p[1].Equals(quizId.ToString()) && p[2].Equals("1"))
                    {
                        Vote v;
                        v.id = p[3];
                        v.choice = Int32.Parse(p[4]);

                        bool unique = true;

                        foreach (Vote i in votes)
                        {
                            if (i.id.Equals(v.id))
                                unique = false;
                        }

                        if (unique)
                        {
                            votes.Add(v);
                            this.SetText("VOTES IN: " + votes.Count);
                        }

                        string cmd = "ack:" + s.Substring(4) + ";";
                        //string cmd = "ack:" + p[1] + ":" + p[2] + ":" + p[3] + ":" + p[4] + ";";
                        Console.WriteLine(cmd);
                        port.Write(cmd);
                    }
                }
                catch (Exception e) {Thread.Sleep(100); }
            }
        }

        private void addButton_Click(object sender, EventArgs e)
        {
            this.possibleAnswerListBox.Items.Add(this.newAnswerBox.Text);
            this.newAnswerBox.Clear();
        }

        private void clearButton_Click(object sender, EventArgs e)
        {
            this.possibleAnswerListBox.Items.Clear();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            if (this.possibleAnswerListBox.SelectedIndex >= 0)
            {
                this.possibleAnswerListBox.Items.RemoveAt(this.possibleAnswerListBox.SelectedIndex);
            }
        }

        private void button3_Click(object sender, EventArgs e)
        {
            List<string> categories = new List<string>();
            for (int i = 0; i < this.possibleAnswerListBox.Items.Count; i++)
                categories.Add((string)this.possibleAnswerListBox.Items[i]);

            ResultGraph r = new ResultGraph(votes, categories,this.questionTextBox.Text);
            r.Show();
        }

        private string generateRandomQuizID()
        {
            Random r = new Random();

            char[] c = new char[4];

            for (int i=0; i<4; i++)
                c[i] = (char) (64 + r.Next(25));

            return new string(c);
        }

        private void button2_Click(object sender, EventArgs e)
        {
            if (this.startVoteButton.Text.Equals("START VOTE!"))
            {
                if (this.possibleAnswerListBox.Items.Count < 2)
                {
                    MessageBox.Show("Please add at least to choices before starting a vote.", "micro:bit vote");
                    return;
                }

                quizId = this.generateRandomQuizID();
                
                votes.Clear();
                this.SetText("VOTES IN: " + votes.Count);

                quizRunning = true;

                advertiser = new System.Threading.Thread(new ThreadStart(quizAdvertiser));
                advertiser.Start();

                this.startVoteButton.Text = "STOP VOTE!";
                this.startVoteButton.BackColor = Color.Red;
                this.addButton.Enabled = false;
                this.clearButton.Enabled = false;
                this.removeButton.Enabled = false;
                return;
            }

            if (this.startVoteButton.Text.Equals("STOP VOTE!"))
            {
                quizRunning = false;

                this.startVoteButton.Text = "START VOTE!";
                this.startVoteButton.BackColor = Color.LimeGreen;
                this.addButton.Enabled = true;
                this.clearButton.Enabled = true;
                this.removeButton.Enabled = true;
            }
        }

        private void quizAdvertiser()
        {
            string cmd = "set:" + quizId + ":1:" + this.possibleAnswerListBox.Items.Count + ";";

            while (quizRunning)
            {
                port.Write(cmd);
                Thread.Sleep(1000);
            }
        }

        private void comportListBox_SelectedIndexChanged(object sender, EventArgs e)
        {
            this.connectButton.Enabled = true;
        }
    }
}
