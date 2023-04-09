import React, { useState, useEffect } from "react";
import "./Progress.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { useSnackbar } from "notistack";
import Graph from "./Graph";

const Progress = () => {
	const token =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDJlMzdjOTEzOTdkMTI1NTllNDkzMTQiLCJlbWFpbCI6ImR1bW15QGVtYWlsLmNvbSIsImlhdCI6MTY4MDk0ODM1OCwiZXhwIjoxNjgwOTUxOTU4fQ.ykSWTzJqYItLLKLH5vn_GaJFFYWf_YPQWhGVL1tu-6A";
	const [allWorks, setAllworks] = useState([]);
	const [pendingWorks, setPendingWorks] = useState([]);
	const [inProgressWorks, setInProgress] = useState([]);
	const [inLaboratory, setLaboratory] = useState([]);
	const [chartData, setChartData] = useState({});
	const [loading, setLoading] = useState(true);
	const [pendingPayments, setPendingPayments] = useState([]);
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();

	useEffect(() => {
		handleGetAllWorks();
	}, []);

	const handleGetAllWorks = async () => {
		try {
			const headers = {
				Authorization: `Bearer ${token}`,
			};

			const res = await axios.get(`http://localhost:2000/works/`, {
				headers,
			});

			setAllworks(res.data);

			//pending works
			const data = res.data.filter((work) => work.status === "pending");
			setPendingWorks(data);
			setInProgress(res.data.filter((ele) => ele.status === "in progress"));
			setPendingPayments(
				res.data.filter((ele) => ele.status === "awaiting for payment"),
			);
			setLaboratory(res.data.filter((ele) => ele.status === "at laboratory"));

			if (res.data) {
				//chart logic
				const startDate = new Date();
				startDate.setDate(startDate.getDate() - 6);
				const endDate = new Date();
				const dateRange = getDateRange(startDate, endDate);

				// Group the works by day
				const worksByDay = new Map();
				res.data.forEach((work) => {
					const date = new Date(work.createdAt).toDateString();
					const count = worksByDay.get(date) || 0;
					worksByDay.set(date, count + 1);
				});

				// Create chart data from the grouped works
				const chartLabels = dateRange.map((date) => date.toDateString());
				const chartData = dateRange.map(
					(date) => worksByDay.get(date.toDateString()) || 0,
				);
				console.log(chartLabels, chartData);
				// Function to get an array of dates between two dates
				function getDateRange(startDate, endDate) {
					const dateRange = [];
					let currentDate = startDate;
					while (currentDate <= endDate) {
						dateRange.push(new Date(currentDate));
						currentDate.setDate(currentDate.getDate() + 1);
					}
					return dateRange;
				}

				// Set the chart data state
				setChartData({
					labels: chartLabels,
					datasets: [
						{
							label: "Work orders per day",
							data: chartData,
							fill: false,
							borderColor: "rgba(75,192,192,1)",
						},
					],
				});
				console.log("from", chartData);
				setLoading(false);
			}

			enqueueSnackbar("Fetched all works successfully ", {
				variant: "success",
			});
		} catch (err) {
			if (String(err.response.status)[0] === "4") {
				enqueueSnackbar(err.response.data.message, { variant: "error" });
			} else {
				enqueueSnackbar(
					"Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
					{ variant: "error" },
				);
			}
			console.log(err);
		}
	};

	const handleAccept = async (data, flag) => {
		console.log("from", data);
		console.log(flag);
		var work;
		if (flag) {
			work = { ...data, status: "in progress" };
		} else {
			work = { ...data, status: "pending" };
		}

		try {
			const headers = {
				Authorization: `Bearer ${token}`,
			};

			const res = await axios.put(
				`http://localhost:2000/works/${data._id}/status`,
				work,
				{
					headers,
				},
			);
			console.log(res.data);
			if (flag === true) {
				enqueueSnackbar("Accepted the work Order", {
					variant: "success",
				});
			} else {
				enqueueSnackbar("Rejected the work Order", {
					variant: "success",
				});
			}
		} catch (err) {
			if (String(err.response.status)[0] === "4") {
				enqueueSnackbar(err.response.data.message, { variant: "error" });
			} else {
				enqueueSnackbar(
					"Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
					{ variant: "error" },
				);
			}
			console.log(err);
		}
	};
	return (
		<div className="container ">
			<div className="row ">
				<h3>DashBoard</h3>
				<div className="info d-flex justify-content-between">
					<div className="info-box text-dark bg-light p-2 rounded">
						<div className="label">Total Works</div>
						<div className="value text-info">{allWorks.length}</div>
					</div>
					<div className="info-box text-dark bg-light p-2 rounded">
						<div className="label">Pending Works</div>
						<div className="value text-info">{pendingWorks.length}</div>
					</div>
					<div className="info-box text-dark bg-light p-2 rounded">
						<div className="label">In Progress</div>
						<div className="value text-info">{inProgressWorks.length}</div>
					</div>
					<div className="info-box text-dark bg-light p-2 rounded">
						<div className="label">At Labouratory</div>
						<div className="value text-info">{inLaboratory.length}</div>
					</div>
					<div className="info-box text-dark bg-light p-2 rounded">
						<div className="label">Waiting Payment</div>
						<div className="value text-info">{pendingPayments.length}</div>
					</div>
				</div>
			</div>
			<br />
			<div className="row d-flex justify-content-evenly">
				<div className="col-md-6">
					<h5>New Work Orders</h5>
					<br />
					{pendingWorks &&
						pendingWorks.map((work) => {
							return (
								<div
									className="card border-0 shadow-sm p-3 mb-3 bg-body-tertiary rounded"
									key={work._id}
								>
									<div className="card-body ">
										<div className="row d-flex justify-content-between align-items-center">
											<div className="col-lg-8">
												Location : {work.address}
												<br /> Description: {work.description}
												<br /> Start Date:{" "}
												{new Date(work.startDate).toLocaleDateString("en-GB")}
												<br /> Status:{work.status}
											</div>
											<div className="col-lg-4 d-sm-flex justify-content-between">
												<button
													type="button"
													className="btn btn-success "
													onClick={() => handleAccept(work, true)}
												>
													Accept
												</button>
												<button
													type="button"
													className="btn btn-outline-danger"
													onClick={() => handleAccept(work, false)}
												>
													Reject
												</button>
											</div>
										</div>
									</div>
								</div>
							);
						})}
				</div>
				<div className="col-md-6">
					<div className="chart">
						<h5>Last Week Insights</h5>
						{chartData && loading === false ? (
							<Line
								data={chartData}
								options={{
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
								}}
							/>
						) : (
							<h5>Loading</h5>
						)}
					</div>
				</div>
			</div>
			{/* //3rd section */}
			<div className="row mt-4">
				<div className="col-6">
					<div className="row">
						<h5>In progress works</h5>
						{inProgressWorks &&
							inProgressWorks.map((work) => {
								return (
									<div
										className="card border-0 shadow-sm p-3 mb-3 bg-body-tertiary rounded"
										key={work._id}
									>
										<div className="card-body ">
											<div className="row d-flex justify-content-between align-items-center">
												<div className="col-lg-8">
													Location : {work.address}
													<br /> Description: {work.description}
													<br /> Start Date:{" "}
													{new Date(work.startDate).toLocaleDateString("en-GB")}
												</div>
												<div className="col-lg-4 d-sm-flex justify-content-between">
													<button
														type="button"
														className="btn btn-info text-white"
														onClick={() => {
															navigate(`/works/${work._id}`);
														}}
													>
														Edit work
													</button>
												</div>
											</div>
										</div>
									</div>
								);
							})}
					</div>

					<div className="row mt-4">
						<h5>In Lab</h5>
						{inLaboratory &&
							inLaboratory.map((work) => {
								return (
									<div
										className="card border-0 shadow-sm p-3 mb-3 bg-body-tertiary rounded"
										key={work._id}
									>
										<div className="card-body ">
											<div className="row d-flex justify-content-between align-items-center">
												<div className="col-lg-8">
													Location : {work.address}
													<br /> Description: {work.description}
													<br /> Start Date:{" "}
													{new Date(work.startDate).toLocaleDateString("en-GB")}
												</div>
												<div className="col-lg-4 d-sm-flex justify-content-between">
													<button
														type="button"
														className="btn btn-info text-white"
														onClick={() => {
															navigate(`/works/${work._id}`);
														}}
													>
														Edit work
													</button>
												</div>
											</div>
										</div>
									</div>
								);
							})}
					</div>
				</div>

				<div className="col-6">
					{pendingPayments && (
						<div>
							<h5>Awaitng for payments</h5>
							{pendingPayments.map((work) => {
								return (
									<div
										className="card border-0 shadow-sm p-3 mb-3 bg-body-tertiary rounded"
										key={work._id}
									>
										<div className="card-body ">
											<div className="row d-flex justify-content-between align-items-center">
												<div className="col-lg-8">
													Location : {work.address}
													<br /> Description: {work.description}
													<br /> Start Date:{" "}
													{new Date(work.startDate).toLocaleDateString("en-GB")}
													<br /> Status:{work.status}
													<br />
													{work.workPayment && (
														<p>Amount: {work.workPayment}</p>
													)}
												</div>
												<div className="col-lg-4 d-sm-flex justify-content-between">
													<button
														type="button"
														className="btn btn-info text-white "
														onClick={() => navigate(`/works/${work._id}`)}
													>
														View Details
													</button>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Progress;
