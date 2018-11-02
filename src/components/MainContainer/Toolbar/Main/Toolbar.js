import React, { Component } from 'react';
import './index.css';

class Toolbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			languageIcon: ''
		};
	}

	handleLogout = (event) => {
		localStorage.clear();
		window.location.href = '/login';
		event.preventDefault();
	};

	changeLanguage = (event) => {
		if (this.state.languageIcon == 'en') localStorage.setItem('languageForm', 'es');
		else localStorage.setItem('languageForm', 'en');
		window.location.reload();
		event.preventDefault();
	};

	componentWillMount() {
		this.setState({
			languageIcon: localStorage.getItem('languageForm')
		});
	}

	handleDropDown = (event) => {
		event.preventDefault();
		let selfHtml = event.currentTarget;
		let submenu = selfHtml.nextSibling;
		submenu.classList.toggle('show');
	};

	render() {
		return (
			<div className="toolbar__main">
				<ul className="RightMenu-list">
					<li className="RightMenu-item">
						<a href="" onClick={this.changeLanguage} className="Language-en">
							<img src={`/languages/${this.state.languageIcon}.png`} className="Language-icon" />
						</a>
					</li>
					<li className="RightMenu-item">
						<div class="dropdown">
							<button
								onClick={this.handleDropDown}
								class="btn btn-success btn-white dropdown-toggle"
								type="button"
								id="dropdownMenuButton"
								data-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="false"
							>
								<i class="fas fa-user-alt" />
							</button>
							<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
								<a class="dropdown-item" href="#" onClick={this.handleLogout}>
									Logout
								</a>
								<a class="dropdown-item" href="/reset">
									Reset Password
								</a>
							</div>
						</div>
					</li>
					<li className="RightMenu-item">
						<div class="dropdown">
							<button
								onClick={this.handleDropDown}
								class="btn btn-link btn-empty"
								type="button"
								id="dropdownMenuButton"
								data-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="false"
							>
								<i class="fas fa-ellipsis-v" />
							</button>
							<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
								<div className="row app-shortcuts">
									<a class="col-4 app-shortcuts__item" href="/home/work-orders">
										<i class="fas fa-briefcase" />
										<small>Work Orders</small>
										<span class="app-shortcuts__helper bg-gd-danger" />
									</a>
									<a class="col-4 app-shortcuts__item" href="/home/company/add">
										<i class="fas fa-home" />
										<small>Add Management</small>
										<span class="app-shortcuts__helper bg-gd-primary" />
									</a>
									<a class="col-4 app-shortcuts__item" href="/home/contract/add">
										<i class="far fa-handshake" />
										<small>Add Contract</small>
										<span class="app-shortcuts__helper bg-gd-info" />
									</a>
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
		);
	}
}

export default Toolbar;
