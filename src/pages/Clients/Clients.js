import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

const Clients = () => {
	const { enqueueSnackbar } = useSnackbar();
	const [userData, setUserData] = useState([]);

	useEffect(() => {
		handleGetAllWorks();
	}, []);

	const handleGetAllWorks = async () => {
		try {
			const res = await axios.get(`http://localhost:2000/users/`);

			enqueueSnackbar("Fetch All clients successfully ", {
				variant: "success",
			});
			setUserData(res.data);
			console.log(res.data);
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
			<h4>Our clients</h4>
			<div
				className="info-box text-dark bg-light p-2 rounded"
				style={{ width: "120px" }}
			>
				<div className="label">Active Clients</div>
				<div className="value text-info">{userData.length}</div>
			</div>

			{userData &&
				userData.map((ele) => {
					return (
						<div className="card mt-2" id={ele._id}>
							<div className="card-body">
								Name: {ele.firstName} {ele.lastName}
								<br />
								Email: {ele.email}
								<br />
								Phone: {ele.phone}
								<br />
								Address: {ele.address1}
								<br />
								Location: {ele.location.city},{ele.location.district},
								{ele.location.state}
								<br />
								Pincode: {ele.location.pinCode}
							</div>
						</div>
					);
				})}
		</div>
	);
};

export default Clients;
