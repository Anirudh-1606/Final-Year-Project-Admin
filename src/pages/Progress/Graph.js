import React from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
);
export const options = {
	responsive: true,
	title: { text: "Works created per day", display: true },
	scales: {
		yAxes: [
			{
				ticks: {
					beginAtZero: true,
				},
			},
		],
	},
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
	labels,
	datasets: [
		{
			label: "Work orders frequency",
			data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
			borderColor: "rgb(255, 99, 132)",
			backgroundColor: "rgba(255, 99, 132, 0.5)",
		},
	],
};

const Graph = () => {
	return <Line options={options} data={data} />;
};

export default Graph;
