import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

import _ from "lodash";
import Accordion from "react-bootstrap/Accordion";
import axios from "axios";

const InProgress = () => {
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const [work, setWork] = useState();
	const [userDetails, setUserDetails] = useState({
		quotation: "",
		bill: "",
		workOrder: "",
		endDate: "",
	});
	const [isEdit, setEdit] = useState(true);

	const [loading, setLoading] = useState(true);

	const { id } = useParams();
	const token =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDJlMzdjOTEzOTdkMTI1NTllNDkzMTQiLCJlbWFpbCI6ImR1bW15QGVtYWlsLmNvbSIsImlhdCI6MTY4MDk0ODM1OCwiZXhwIjoxNjgwOTUxOTU4fQ.ykSWTzJqYItLLKLH5vn_GaJFFYWf_YPQWhGVL1tu-6A";

	useEffect(() => {
		if (id) {
			handleFetchWorkDetails(id);
		}
	}, []);

	const handleOwnerDetails = async (id) => {
		try {
			const headers = {
				Authorization: `Bearer ${token}`,
			};

			const res = await axios.get(`http://localhost:2000/users/${id}/`, {
				headers,
			});
			console.log(res.data);

			setUserDetails(res.data);

			enqueueSnackbar("Fetched the Owner Details", {
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

	const handleFetchWorkDetails = async (id) => {
		try {
			const headers = {
				Authorization: `Bearer ${token}`,
			};

			const res = await axios.get(`http://localhost:2000/works/${id}/`, {
				headers,
			});
			console.log(res.data);
			setWork(res.data);
			//owner details

			handleOwnerDetails(res.data.owner);
			setLoading(false);
			enqueueSnackbar("Fetched the work Order", {
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

	const handleEditWorkDetails = async (data) => {
		console.log(data);
		try {
			const headers = {
				Authorization: `Bearer ${token}`,
			};

			const res = await axios.put(
				`http://localhost:2000/works/${data._id}/`,
				data,
				{
					headers,
				},
			);
			console.log(res.data);
			navigate("/");
			enqueueSnackbar("Updated the work Order", {
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

	const handleDelete = async (id) => {
		console.log(id);
		window.alert("Are you sure you wanna delete the work order");
		try {
			const headers = {
				Authorization: `Bearer ${token}`,
			};

			const res = await axios.delete(
				`http://localhost:2000/works/${id}/`,

				{
					headers,
				},
			);
			console.log(res.data);
			navigate("/");
			enqueueSnackbar("Deleted the work Order", {
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

	//change
	const handleApiData = (e) => {
		setWork({ ...work, [e.target.name]: e.target.value });
		// console.log(work);
	};

	const handleUpdateWork = async () => {
		const buttonElement = document.getElementById("updateBtn");
		const clone = _.cloneDeep(buttonElement);
		const json = JSON.stringify(clone);
		console.log(json);

		handleEditWorkDetails(work);
	};

	return (
		<div className="container">
			{loading === false && (
				<div className="update">
					<div className="head d-flex justify-content-between align-items-center">
						<div className="col">
							<h5>
								Work Quoted by: {userDetails.firstName} {userDetails.lastName}
							</h5>

							<p>
								Placed Order on:{" "}
								{new Date(work.startDate).toLocaleDateString("en-GB")}
							</p>
						</div>

						<button
							className="btn btn-primary"
							onClick={() => {
								setEdit(!isEdit);
							}}
						>
							{isEdit ? "Edit" : "Cancel"}
						</button>
					</div>
					<hr />
					<div className="form ">
						<h5>Update the work details</h5>
						<div className="row my-4">
							<div className="col ">
								<label for="quotation" class="form-label">
									Quotation Number
								</label>
								<input
									readOnly={isEdit}
									type="number"
									name="quotation"
									value={work.quotation}
									class="form-control"
									placeholder="Enter the quotation number"
									onChange={(e) => handleApiData(e)}
								/>
							</div>
							<div className="col">
								<label for="workOrder" class="form-label">
									Work Order
								</label>
								<input
									readOnly={isEdit}
									type="text"
									name="workOrder"
									value={work.workOrder}
									class="form-control"
									placeholder="Enter Work Order Id or Invoice number"
									onChange={(e) => handleApiData(e)}
								/>
							</div>
							<div className="col">
								<label for="exampleFormControlInput1" class="form-label">
									Bill Number
								</label>
								<input
									readOnly={isEdit}
									type="number"
									class="form-control"
									name="bill"
									value={work.bill}
									placeholder="Bill Number"
									onChange={(e) => handleApiData(e)}
								/>
							</div>
						</div>
						<div className="row">
							<div className="col">
								<label for="exampleFormControlInput1" class="form-label">
									Address
								</label>
								<input
									readOnly={isEdit}
									type="text"
									class="form-control"
									name="address"
									value={work.address}
									onChange={(e) => handleApiData(e)}
									placeholder="Address"
								/>
							</div>
							<div className="col">
								<label for="description" class="form-label">
									Description
								</label>
								<input
									readOnly={isEdit}
									type="text"
									class="form-control"
									name="description"
									value={work.description}
									onChange={(e) => handleApiData(e)}
									placeholder="description"
								/>
							</div>
						</div>
						<div className="row mt-3 d-flex justify-content-evenly">
							<div className="col">
								<label for="exampleDataList" class="form-label">
									Status
								</label>
								<select
									disabled={isEdit}
									className="form-select"
									aria-label="Default select example"
									onChange={handleApiData}
									name="status"
									value={work.status}
								>
									<option value="completed">completed</option>
									<option value="in progress">in progress</option>
									<option value="pending">pending</option>
									<option value="awaiting for payment">
										awaiting for payment
									</option>
									<option value="rejected">rejected</option>
									<option value="accepted">accepted</option>
									<option value="at laboratory">at laboratory</option>
								</select>
							</div>
							<div className="col">
								<label for="date">
									Date of the work start:{" "}
									{new Date(work.startDate).toLocaleDateString("en-GB")}
								</label>
								<br />

								<input
									readOnly={isEdit}
									type="date"
									id="startDate"
									name="startDate"
									onChange={(e) => handleApiData(e)}
									style={{ padding: "10px" }}
								></input>
							</div>
							<div className="col">
								<label for="date">End Date: </label>
								<br />
								<input
									readOnly={isEdit}
									type="date"
									id="endDate"
									name="endDate"
									onChange={(e) => handleApiData(e)}
									style={{ padding: "10px" }}
								></input>
							</div>
						</div>
						<div className="row mt-3">
							<div className="col">
								<label for="exampleFormControlInput1" class="form-label">
									Amount to be paid:
								</label>
								<input
									readOnly={isEdit}
									type="number"
									class="form-control"
									name="workPayment"
									value={work.workPayment}
									placeholder="Enter Amount"
									onChange={(e) => handleApiData(e)}
								/>
							</div>
						</div>
						<div className="row mt-3">
							{!isEdit && (
								<div className="showBtn">
									<br />
									<button
										className="btn btn-primary"
										id="updateBtn"
										onClick={handleUpdateWork}
										style={{ width: "100px" }}
									>
										Update
									</button>
								</div>
							)}
						</div>
					</div>
					<br />
					<br />
					<hr className="mt-5" />
					{userDetails && (
						<div className="info mt-2">
							<Accordion defaultActiveKey="0" flush>
								<Accordion.Item eventKey="0">
									<Accordion.Header>Owner Details</Accordion.Header>
									<Accordion.Body>
										<div className="row d-flex">
											<div className="col">
												Name: {userDetails.firstName} {userDetails.lastName}
											</div>
											<div className="col">Email : {userDetails.email}</div>
											<div className="col">Phone: {userDetails.phone}</div>
										</div>
										<div className="row d-flex">
											<div className="col">
												Address1: {userDetails.address1}
											</div>
											<div className="col">
												Address2: {userDetails.address2}
											</div>
											{userDetails.location && (
												<div className="col">
													Pin Code: {userDetails.location.pinCode}
												</div>
											)}
										</div>
										{userDetails.location && (
											<div className="row d-flex">
												<div className="col">
													City: {userDetails.location.city}
												</div>
												<div className="col">
													District : {userDetails.location.district}
												</div>
												<div className="col">
													State: {userDetails.location.state}
												</div>
											</div>
										)}
									</Accordion.Body>
								</Accordion.Item>
							</Accordion>
						</div>
					)}

					<div className="row mt-5">
						<div className="col">
							<button
								type="button"
								className="btn btn-outline-danger "
								onClick={() => handleDelete(id)}
							>
								Delete work
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default InProgress;
