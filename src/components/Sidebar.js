import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../index.css";
import { Link } from "react-router-dom";

function Sidebar({ showNav, setShowNav }) {
	return (
		<div>
			<header className={`header${showNav ? " body-pd" : ""}`}>
				<div className="header_toggle">
					<i
						className={`bi ${showNav ? "bi-x" : "bi-list"}`}
						onClick={() => setShowNav(!showNav)}
					/>
				</div>
				<div className="header_img">
					<img
						src="https://reqres.in/img/faces/5-image.jpg"
						alt="Clue Mediator"
					/>
				</div>
			</header>
			<div className={`l-navbar${showNav ? " showSideBar" : ""}`}>
				<nav className="nav">
					<div>
						<Link
							to="/progress"
							target="_self"
							className="nav_logo"
							rel="noopener"
						>
							<i className="bi bi-building" />{" "}
							<span className="nav_logo-name">Admin Pannel</span>
						</Link>
						<div className="nav_list">
							<Link to="/" target="_self" className="nav_link" rel="noopener">
								<i className="bi bi-card-text" />
								<span className="nav_name">Progress</span>
							</Link>
							<Link to="/clients" className="nav_link" rel="noopener">
								<i className="bi bi-people nav_icon" />
								<span className="nav_name">Clients</span>
							</Link>
							<Link
								to="/history"
								target="_self"
								className="nav_link"
								rel="noopener"
							>
								<i className="bi bi-clock-history"></i>
								<span className="nav_name">History</span>
							</Link>
							<Link to="#" target="_self" className="nav_link" rel="noopener">
								<i className="bi bi-person-check nav_icon" />
								<span className="nav_name">Role</span>
							</Link>
						</div>
					</div>
					<Link to="https://cluemediator.com" className="nav_link">
						<i className="bi bi-box-arrow-left nav_icon" />
						<span className="nav_name">SignOut</span>
					</Link>
				</nav>
			</div>
		</div>
	);
}
export default Sidebar;
