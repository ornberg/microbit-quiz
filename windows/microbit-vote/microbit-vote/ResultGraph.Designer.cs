namespace microbit_vote
{
    partial class ResultGraph
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
            System.Windows.Forms.DataVisualization.Charting.ChartArea chartArea1 = new System.Windows.Forms.DataVisualization.Charting.ChartArea();
            System.Windows.Forms.DataVisualization.Charting.Legend legend1 = new System.Windows.Forms.DataVisualization.Charting.Legend();
            System.Windows.Forms.DataVisualization.Charting.Series series1 = new System.Windows.Forms.DataVisualization.Charting.Series();
            this.resultsChart = new System.Windows.Forms.DataVisualization.Charting.Chart();
            this.questionTextBox = new System.Windows.Forms.TextBox();
            ((System.ComponentModel.ISupportInitialize)(this.resultsChart)).BeginInit();
            this.SuspendLayout();
            // 
            // resultsChart
            // 
            this.resultsChart.BackSecondaryColor = System.Drawing.Color.White;
            this.resultsChart.BorderlineColor = System.Drawing.Color.Black;
            chartArea1.Name = "ChartArea1";
            this.resultsChart.ChartAreas.Add(chartArea1);
            legend1.Name = "Legend1";
            this.resultsChart.Legends.Add(legend1);
            this.resultsChart.Location = new System.Drawing.Point(50, 88);
            this.resultsChart.Name = "resultsChart";
            series1.ChartArea = "ChartArea1";
            series1.Legend = "Legend1";
            series1.Name = "Series1";
            this.resultsChart.Series.Add(series1);
            this.resultsChart.Size = new System.Drawing.Size(1357, 529);
            this.resultsChart.TabIndex = 0;
            this.resultsChart.Text = "chart1";
            // 
            // questionTextBox
            // 
            this.questionTextBox.BackColor = System.Drawing.Color.DimGray;
            this.questionTextBox.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.questionTextBox.Font = new System.Drawing.Font("Microsoft Sans Serif", 24F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.questionTextBox.ForeColor = System.Drawing.Color.Yellow;
            this.questionTextBox.Location = new System.Drawing.Point(50, 21);
            this.questionTextBox.Name = "questionTextBox";
            this.questionTextBox.Size = new System.Drawing.Size(1357, 37);
            this.questionTextBox.TabIndex = 7;
            this.questionTextBox.Text = "Question";
            // 
            // ResultGraph
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.Black;
            this.ClientSize = new System.Drawing.Size(1456, 629);
            this.Controls.Add(this.questionTextBox);
            this.Controls.Add(this.resultsChart);
            this.Name = "ResultGraph";
            this.Text = "ResultGraph";
            ((System.ComponentModel.ISupportInitialize)(this.resultsChart)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.DataVisualization.Charting.Chart resultsChart;
        private System.Windows.Forms.TextBox questionTextBox;
    }
}