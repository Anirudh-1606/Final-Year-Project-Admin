import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const History = () => {
	const token =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDJlMzdjOTEzOTdkMTI1NTllNDkzMTQiLCJlbWFpbCI6ImR1bW15QGVtYWlsLmNvbSIsImlhdCI6MTY4MDk0ODM1OCwiZXhwIjoxNjgwOTUxOTU4fQ.ykSWTzJqYItLLKLH5vn_GaJFFYWf_YPQWhGVL1tu-6A";
	const [completedWorks, setCompletedWorks] = useState([]);
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

			//pending works
			const data = res.data.filter((work) => work.status === "completed");
			setCompletedWorks(data);
			console.log(data);

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

	return (
		<div className="container">
			{completedWorks.length ? (
				completedWorks.map((ele) => {
					return (
						<div key={ele._id} className="border p-3">
							Address: {ele.address}
							<br />
							PinCode: {ele.pinCode}
							<br />
							<button
								className="btn btn-primary"
								onClick={() => navigate(`/works/${ele._id}`)}
							>
								See Details
							</button>
						</div>
					);
				})
			) : (
				<h5 className="text-center">No works here Yet</h5>
			)}
		</div>
	);
};

export default History;
