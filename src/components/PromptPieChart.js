import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { makeStyles } from '@material-ui/core';
ChartJS.register(ArcElement, Tooltip, Legend);


const useStyles = makeStyles((theme)=>({
    chart: {
        marginTop: 30
    }
}))

const PromptPieChart = ({ prompts }) => {
    const classes = useStyles();
    const data = {
        labels: ['Prompt 1', 'Prompt 2', 'Prompt 3', 'Prompt 4'],
        datasets: [
            {
                data: [prompts[0].length, prompts[1].length, prompts[2].length, prompts[3].length],
                backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0', '#FFCE56'],
            },
        ],
    };

    return (
        <div className={classes.chart}>
            <Pie data={data} />
        </div>
    );
};

export default PromptPieChart;
