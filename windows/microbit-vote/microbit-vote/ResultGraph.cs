using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Windows.Forms.DataVisualization.Charting;

namespace microbit_vote
{
    public partial class ResultGraph : Form
    {
        List<Point> bars = new List<Point>();

        public ResultGraph(List<Vote> votes, List<string> options, string title)
        {
            InitializeComponent();

            this.questionTextBox.Text = title;

            this.resultsChart.Series.Clear();

            for (int i=0; i<options.Count; i++)
            {
                int value = 0;
                foreach (Vote v in votes)
                    if (v.choice == i)
                        value++;

                string s = options[i];    
                this.resultsChart.Series.Add(s);
                DataPoint d = new DataPoint();
                d.SetValueY(value);
                this.resultsChart.Series[s].Points.Add(d);
            }
        }
    }
}
