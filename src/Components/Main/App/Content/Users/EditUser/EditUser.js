import React from "react";
import "./EditUser.css";
import ReactDOM from "react-dom";
import { Icon } from "semantic-ui-react";
import { Form } from "semantic-ui-react";
import $ from "jquery";
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox";
import AllUsers from "../AllUsers/AllUsers";

const IconStyles = {
	fontSize: "3vw",
	position: "relative",
	padding: "0px",
	margin: "0px",
	top: "3vh",
	color: "rgba(51, 10, 88, 0.79)"
};

const options = [
	{ key: "admin", text: "Admin", value: "admin" },
	{ key: "viewer", text: "Viewer", value: "viewer" }
];

export default class EditUser extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			username: "",
			password: "",
			role: "",
			token: this.props.userInfo.token.replace(/^"/, "").replace(/"$/, ""),
			check: false
		};
		this.handleChange = this.handleChange.bind(this);

		this.handleSubmit = this.handleSubmit.bind(this);
	}
	render() {
		let name, username, password, role;
		let check = this.state.check;
		return (
			<div className="EditUser">
				<div className="response-box" />
				<div className="EditUser-Form">
					<div className="IconPlace" style={{ textAlign: "center" }}>
						<Icon name="user circle outline" style={IconStyles} />
					</div>
					<br />
					<hr style={{ borderColor: "rgba(156, 39, 176, 0.34)" }} />
					<br />
					<div className="Form">
						<h3 className="Form-Heading">Enter Username</h3>
						<Form onSubmit={this.handleSubmit}>
							<Form.Group>
								<Form.Input
									placeholder="Username"
									name="username"
									value={username}
									onChange={this.handleChange}
									required
									autoComplete="off"
								/>
								<br />
								<h3 className="Form-Heading">Edit Details</h3>
								<Form.Input
									placeholder="Name"
									name="name"
									value={name}
									onChange={this.handleChange}
									autoComplete="off"
								/>
								<Form.Input
									placeholder="Password"
									name="password"
									value={password}
									onChange={this.handleChange}
									autoComplete="off"
								/>
								<div className="Checkboxes">
									<Checkbox
										label="Admin"
										checked={check === "1"}
										onChange={this.handleCheckboxChange.bind(this, "admin")}
										ref="admin"
									/>
									<Checkbox
										label="Viewer"
										checked={check === "2"}
										onChange={this.handleCheckboxChange.bind(this, "viewer")}
									/>
								</div>
								<div className="Checkboxes">
									<Checkbox
										label="Doctor"
										checked={check === "3"}
										onChange={this.handleCheckboxChange.bind(this, "doctor")}
										ref="admin"
									/>
									<Checkbox
										label="Inventory"
										checked={check === "4"}
										onChange={this.handleCheckboxChange.bind(this, "inventory")}
									/>
								</div>
								<div className="Save">
									<Form.Button
										content="Save"
										onClick={this.handleClick.bind(this, "submit")}
										key="submit"
									/>
								</div>
								<div className="Delete">
									<Form.Button
										content="Delete"
										onClick={this.handleClick.bind(this, "delete")}
										key="delete"
										className="Delete"
									/>
								</div>
							</Form.Group>
						</Form>
					</div>
				</div>

			</div>
		);
	}

	handleClick(i, e) {
		this.props.selectItem(i);
	}

	handleCheckboxChange(ref, e) {
		if (ref === "admin") {
			if (this.state.check !== "1") {
				this.setState({
					check: "1",
					role: "admin"
				});
			} else {
				this.setState({
					check: "0",
					role: ""
				});
			}
		}
		if (ref === "viewer") {
			if (this.state.check !== "2") {
				this.setState({
					check: "2",
					role: "viewer"
				});
			} else {
				this.setState({
					check: "0",
					role: ""
				});
			}
		}
		if (ref === "doctor") {
			if (this.state.check !== "3") {
				this.setState({
					check: "3",
					role: "doctor"
				});
			} else {
				this.setState({
					check: "0",
					role: ""
				});
			}
		}
		if (ref === "inventory") {
			if (this.state.check !== "4") {
				this.setState({
					check: "4",
					role: "inventory"
				});
			} else {
				this.setState({
					check: "0",
					role: ""
				});
			}
		}
		console.log(ref);
	}
	handleChange = (e, { name, value }) => this.setState({ [name]: value });

	// Function to handle things that should happen after submit.
	handleSubmit(e) {
		e.preventDefault();
		let { name, username, password, role, token } = this.state;
		let data = { name, username, password, role, token };

		// 	If the user presses DELETE
		if (this.props.activeItem === "delete") {
			this.props.deleteRequest(
				`http://localhost:2000/users/${username}`,
				res => {
					var responseBox = $(".EditUser .response-box");

					if (res.status === 202) {
						if (responseBox.hasClass("response-failed")) {
							responseBox.removeClass("response-failed");
						}
						responseBox.addClass("response-success");
					} else {
						if (responseBox.hasClass("response-success")) {
							responseBox.removeClass("response-success");
						}
						responseBox.addClass("response-failed");
						if (res.status === 400) {
							// Incomplete / Wrong Parameters
							let responseMessage = `Incomplete/Wrong Parameters`;
							console.log(responseMessage);
							console.log(res);
						}
						if (res.status === 401) {
							// No permission
							let responseMessage = `The request is not authorized`;
							console.log(responseMessage);
						}
						if (res.status === 409) {
							// If username is correct, but password is wrong.
							let responseMessage = `User already exists`;
							console.log(responseMessage);
						}
						if (res.status === 500) {
							// If empty form is submitted
							let responseMessage = `Internal Error`;
							console.log(responseMessage);
						}
					}
				}
			);
		}

		// If the user presses SAVE
		if (this.props.activeItem === "submit") {
			this.props.putRequest(
				`http://localhost:2000/users/${username}`,
				data,
				res => {
					var responseBox = $(".EditUser .response-box");

					if (res.status === 200) {
						if (responseBox.hasClass("response-failed")) {
							responseBox.removeClass("response-failed");
						}
						responseBox.addClass("response-success");
					} else {
						if (responseBox.hasClass("response-success")) {
							responseBox.removeClass("response-success");
						}
						responseBox.addClass("response-failed");
						if (res.status === 400) {
							// Incomplete / Wrong Parameters
							let responseMessage = `Incomplete/Wrong Parameters`;
							console.log(responseMessage);
							console.log(res);
						}
						if (res.status === 401) {
							// No permission
							let responseMessage = `The request is not authorized`;
							console.log(responseMessage);
						}
						if (res.status === 409) {
							// If username is correct, but password is wrong.
							let responseMessage = `User already exists`;
							console.log(responseMessage);
						}
						if (res.status === 500) {
							// If empty form is submitted
							let responseMessage = `Internal Error`;
							console.log(responseMessage);
						}
					}
				}
			);
		}
		this.setState({
			role: "",
			check: false
		});
		this.props.refreshAllUsers();
	}
}
