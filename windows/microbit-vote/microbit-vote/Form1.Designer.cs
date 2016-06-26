namespace microbit_vote
{
    partial class microbitVoteForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.comportListBox = new System.Windows.Forms.ListBox();
            this.connectButton = new System.Windows.Forms.Button();
            this.possibleAnswerListBox = new System.Windows.Forms.ListBox();
            this.questionTextBox = new System.Windows.Forms.TextBox();
            this.clearButton = new System.Windows.Forms.Button();
            this.addButton = new System.Windows.Forms.Button();
            this.removeButton = new System.Windows.Forms.Button();
            this.newAnswerBox = new System.Windows.Forms.TextBox();
            this.startVoteButton = new System.Windows.Forms.Button();
            this.seeResultsButton = new System.Windows.Forms.Button();
            this.resultTotal = new System.Windows.Forms.Label();
            this.bindingSource1 = new System.Windows.Forms.BindingSource(this.components);
            ((System.ComponentModel.ISupportInitialize)(this.bindingSource1)).BeginInit();
            this.SuspendLayout();
            // 
            // comportListBox
            // 
            this.comportListBox.FormattingEnabled = true;
            this.comportListBox.Location = new System.Drawing.Point(1317, 633);
            this.comportListBox.Name = "comportListBox";
            this.comportListBox.Size = new System.Drawing.Size(120, 95);
            this.comportListBox.TabIndex = 3;
            this.comportListBox.Visible = false;
            this.comportListBox.SelectedIndexChanged += new System.EventHandler(this.comportListBox_SelectedIndexChanged);
            // 
            // connectButton
            // 
            this.connectButton.Enabled = false;
            this.connectButton.Location = new System.Drawing.Point(1317, 747);
            this.connectButton.Name = "connectButton";
            this.connectButton.Size = new System.Drawing.Size(120, 44);
            this.connectButton.TabIndex = 4;
            this.connectButton.Text = "connect";
            this.connectButton.UseVisualStyleBackColor = true;
            this.connectButton.Visible = false;
            this.connectButton.Click += new System.EventHandler(this.connectButton_Click);
            // 
            // possibleAnswerListBox
            // 
            this.possibleAnswerListBox.Font = new System.Drawing.Font("Microsoft Sans Serif", 24F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.possibleAnswerListBox.FormattingEnabled = true;
            this.possibleAnswerListBox.ItemHeight = 37;
            this.possibleAnswerListBox.Location = new System.Drawing.Point(50, 77);
            this.possibleAnswerListBox.Name = "possibleAnswerListBox";
            this.possibleAnswerListBox.Size = new System.Drawing.Size(1040, 633);
            this.possibleAnswerListBox.TabIndex = 5;
            // 
            // questionTextBox
            // 
            this.questionTextBox.BackColor = System.Drawing.Color.DimGray;
            this.questionTextBox.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.questionTextBox.Font = new System.Drawing.Font("Microsoft Sans Serif", 24F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.questionTextBox.ForeColor = System.Drawing.Color.Yellow;
            this.questionTextBox.Location = new System.Drawing.Point(50, 19);
            this.questionTextBox.Name = "questionTextBox";
            this.questionTextBox.Size = new System.Drawing.Size(1040, 37);
            this.questionTextBox.TabIndex = 6;
            this.questionTextBox.Text = "Should the UK be a part of the European Union?";
            // 
            // clearButton
            // 
            this.clearButton.Location = new System.Drawing.Point(1126, 612);
            this.clearButton.Name = "clearButton";
            this.clearButton.Size = new System.Drawing.Size(75, 43);
            this.clearButton.TabIndex = 7;
            this.clearButton.Text = "clear";
            this.clearButton.UseVisualStyleBackColor = true;
            this.clearButton.Click += new System.EventHandler(this.clearButton_Click);
            // 
            // addButton
            // 
            this.addButton.Location = new System.Drawing.Point(1126, 747);
            this.addButton.Name = "addButton";
            this.addButton.Size = new System.Drawing.Size(76, 44);
            this.addButton.TabIndex = 8;
            this.addButton.Text = "add";
            this.addButton.UseVisualStyleBackColor = true;
            this.addButton.Click += new System.EventHandler(this.addButton_Click);
            // 
            // removeButton
            // 
            this.removeButton.Location = new System.Drawing.Point(1126, 666);
            this.removeButton.Name = "removeButton";
            this.removeButton.Size = new System.Drawing.Size(75, 44);
            this.removeButton.TabIndex = 9;
            this.removeButton.Text = "remove";
            this.removeButton.UseVisualStyleBackColor = true;
            this.removeButton.Click += new System.EventHandler(this.button1_Click);
            // 
            // newAnswerBox
            // 
            this.newAnswerBox.Font = new System.Drawing.Font("Microsoft Sans Serif", 24F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.newAnswerBox.Location = new System.Drawing.Point(50, 747);
            this.newAnswerBox.Name = "newAnswerBox";
            this.newAnswerBox.Size = new System.Drawing.Size(1040, 44);
            this.newAnswerBox.TabIndex = 10;
            this.newAnswerBox.Text = "A: YES!";
            // 
            // startVoteButton
            // 
            this.startVoteButton.BackColor = System.Drawing.Color.LimeGreen;
            this.startVoteButton.Enabled = false;
            this.startVoteButton.FlatAppearance.BorderColor = System.Drawing.Color.Black;
            this.startVoteButton.FlatStyle = System.Windows.Forms.FlatStyle.Popup;
            this.startVoteButton.Font = new System.Drawing.Font("Microsoft Sans Serif", 20F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.startVoteButton.ForeColor = System.Drawing.Color.White;
            this.startVoteButton.Location = new System.Drawing.Point(1127, 77);
            this.startVoteButton.Name = "startVoteButton";
            this.startVoteButton.Size = new System.Drawing.Size(310, 191);
            this.startVoteButton.TabIndex = 11;
            this.startVoteButton.Text = "START VOTE!";
            this.startVoteButton.UseVisualStyleBackColor = false;
            this.startVoteButton.Click += new System.EventHandler(this.button2_Click);
            // 
            // seeResultsButton
            // 
            this.seeResultsButton.BackColor = System.Drawing.Color.Orange;
            this.seeResultsButton.Enabled = false;
            this.seeResultsButton.FlatAppearance.BorderSize = 0;
            this.seeResultsButton.FlatStyle = System.Windows.Forms.FlatStyle.Popup;
            this.seeResultsButton.Font = new System.Drawing.Font("Microsoft Sans Serif", 20F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.seeResultsButton.ForeColor = System.Drawing.Color.White;
            this.seeResultsButton.Location = new System.Drawing.Point(1126, 306);
            this.seeResultsButton.Name = "seeResultsButton";
            this.seeResultsButton.Size = new System.Drawing.Size(310, 191);
            this.seeResultsButton.TabIndex = 12;
            this.seeResultsButton.Text = "VIEW RESULTS!";
            this.seeResultsButton.UseVisualStyleBackColor = false;
            this.seeResultsButton.Click += new System.EventHandler(this.button3_Click);
            // 
            // resultTotal
            // 
            this.resultTotal.AutoSize = true;
            this.resultTotal.Font = new System.Drawing.Font("Microsoft Sans Serif", 24F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.resultTotal.ForeColor = System.Drawing.Color.LimeGreen;
            this.resultTotal.Location = new System.Drawing.Point(1126, 19);
            this.resultTotal.Name = "resultTotal";
            this.resultTotal.Size = new System.Drawing.Size(214, 37);
            this.resultTotal.TabIndex = 13;
            this.resultTotal.Text = "VOTES IN: 0";
            // 
            // microbitVoteForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.Black;
            this.ClientSize = new System.Drawing.Size(1457, 815);
            this.Controls.Add(this.resultTotal);
            this.Controls.Add(this.seeResultsButton);
            this.Controls.Add(this.startVoteButton);
            this.Controls.Add(this.newAnswerBox);
            this.Controls.Add(this.removeButton);
            this.Controls.Add(this.addButton);
            this.Controls.Add(this.clearButton);
            this.Controls.Add(this.questionTextBox);
            this.Controls.Add(this.possibleAnswerListBox);
            this.Controls.Add(this.connectButton);
            this.Controls.Add(this.comportListBox);
            this.Name = "microbitVoteForm";
            this.Text = "micro:bit vote!";
            this.Load += new System.EventHandler(this.microbitVoteForm_Load);
            ((System.ComponentModel.ISupportInitialize)(this.bindingSource1)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.BindingSource bindingSource1;
        private System.Windows.Forms.ListBox comportListBox;
        private System.Windows.Forms.Button connectButton;
        private System.Windows.Forms.ListBox possibleAnswerListBox;
        private System.Windows.Forms.TextBox questionTextBox;
        private System.Windows.Forms.Button clearButton;
        private System.Windows.Forms.Button addButton;
        private System.Windows.Forms.Button removeButton;
        private System.Windows.Forms.TextBox newAnswerBox;
        private System.Windows.Forms.Button startVoteButton;
        private System.Windows.Forms.Button seeResultsButton;
        private System.Windows.Forms.Label resultTotal;
    }
}

