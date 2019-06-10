import React, { Component } from 'react';

class DisplayAttachment extends Component{
    constructor(props){
        super(props);

        this.state = {
            title: 'm4a1-cinnamon-cannon.jpg',
            startTitle: 'm4a1-cinnamon-cannon.jpg',
            editName: 'm4a1-cinnamon-cannon.jpg',
            idToDelete: 0,
            updating: false
        }
    }

    renderEditButtons = () => {
		return this.state.editName ? (
			<div
				className="fa-container fa-container-edit"
				onClick={() => {
					this.setState({
						editName: false
					});
				}}
			>
				<i className="far fa-edit" />
			</div>
		) : (
			<div className="fa-container-option">
				<div
					className="fa-container-save bg-success"
					onClick={_ => {}}
				>
					{!this.state.updating && <i className="far fa-save" />}
					{this.state.updating && <i className="fa fa-spinner fa-spin" />}
				</div>
				<div
					className="fa-container-cancel bg-danger"
					onClick={() => {
						this.setState({
							editName: true,
							title: this.state.startTitle
						});
					}}
				>
					<i className="fas fa-ban" />
				</div>
			</div>
		);
    };
    
    render(){
        return (
			<li className="UploadDocument-item Attachments-item">
				<div className="group-container">
					<div className="file-name-container">
						<input
							disabled={false}
							type="text"
							value={this.state.title}
							onChange={(e) => {
								this.setState({
									title: e.target.value
								});
							}}
							className={this.state.editName ? 'group-title' : 'group-title input-file-name-edit'}
						/>
						{!this.props.typeId && this.renderEditButtons()}
					</div>
					<div className="image-show-wrap">
						<div className="drag-text">
							<i className={'far fa-file-image fa-7x'} />
						</div>
					</div>
					<div className="button-container">
						<a className="file-input input-middle" href={'www.amazon.com'} target="_blank">
							<i className="fas fa-download fa-lg" />
						</a>
						<a
							href=""
							className="file-input input-middle"
							onClick={(e) => {
								e.preventDefault();
								this.setState({ openConfirm: true, idToDelete: 0 });
							}}
						>
							<i className="fas fa-trash fa-lg" />
						</a>
					</div>
				</div>
			</li>
		);
    }
}

export default DisplayAttachment;