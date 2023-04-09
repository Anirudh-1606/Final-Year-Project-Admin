import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Clients from "./pages/Clients/Clients";
import History from "./pages/History/History";
import Progress from "./pages/Progress/Progress";
import InProgress from "./pages/Progress/InProgress";

function App() {
	const [showNav, setShowNav] = useState(true);

	return (
		<div className={`body-area${showNav ? " body-pd" : ""}`}>
			<Sidebar showNav={showNav} setShowNav={setShowNav} />

			<div className="pt-4 pb-4">
				<Routes>
					<Route path="/" element={<Progress />} />
					<Route path="/works/:id" element={<InProgress />} />
					<Route path="/history" element={<History />} />
					<Route path="/clients" element={<Clients />} />
				</Routes>
			</div>
		</div>
	);
}

export default App;
