import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-luxon';
import { DateTime } from 'luxon';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { makeStyles } from '@material-ui/core';

ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const useStyles = makeStyles((theme)=>({
    chart: {
        marginTop: 30
    }
}))

const UserLineChart = ({ users }) => {
    const userCountsByDate = {};
    const classes = useStyles()

    users.forEach(user => {
      const joinedDate = DateTime.fromJSDate(new Date(user.createdAt));
      const formattedDate = joinedDate.toISODate();
  
      if (!userCountsByDate[formattedDate]) {
        userCountsByDate[formattedDate] = 0;
      }
  
      userCountsByDate[formattedDate]++;
    });

    const labels = Object.keys(userCountsByDate);
    const data = Object.values(userCountsByDate);

    const chartData = {
        labels, // Dates
        datasets: [
            {
                label: 'Users Joined Count',
                data, // User counts
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                },
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                type: 'linear',
                title: {
                    display: true,
                    text: 'Users Joined Count'
                },
            },
        },
    };

    return (
        <div className={classes.chart} >
            <Line data={chartData} options={options} />
        </div>
    );
};

export default UserLineChart;