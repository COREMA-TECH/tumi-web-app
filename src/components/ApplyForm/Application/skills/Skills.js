import React, {Component} from 'react';
import withApollo from "react-apollo/withApollo";
import InputRangeDisabled from "../../ui/InputRange/InputRangeDisabled";
import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import InputRange from "../../ui/InputRange/InputRange";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
const uuidv4 = require('uuid/v4');

class Skills extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // Editing state properties - To edit general info
            editing: false,
            applicationId: null,

            // Skills array
            skills: [],
            newSkills: [],

            // skills dialog state
            open: false
        }
    }

    // To open the skill dialog
    handleClickOpen = () => {
        this.setState({ open: true });
    };

    // To close the skill dialog
    handleClose = () => {
        this.setState({ open: false });
    };

    componentWillMount() {
        this.setState({
            applicationId: this.props.applicationId
        }, () => {

        });
    }


    render() {

        // To render the skills section
        let renderSkillsSection = () => (
            <div className="">
                <div className="row">
                    <div className="col-12">
                        {this.state.skills.length > 0 ? (
                            <div className="skills-container skills-container--header">
                                <div className="row">
                                    <div className="col-6">
                                        <span>Skill Name</span>
                                    </div>
                                    <div className="col-6">
                                        <span>Skill Level</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ''
                        )}
                        {this.state.skills.map((skillItem) => (
                            <div key={uuidv4()} className="skills-container">
                                <div className="row">
                                    <div className="col-6">
                                        <span>{skillItem.description}</span>
                                    </div>
                                    <div className="col-5">
                                        <InputRangeDisabled percent={skillItem.level}/>
                                    </div>
                                    <div className="col-1">
                                        <span
                                            className="delete-school-button"
                                            onClick={() => {
                                                this.setState((prevState) => ({
                                                    skills: this.state.skills.filter((_, i) => {
                                                        console.log(this.state.skills);
                                                        return _.uuid !== skillItem.uuid;
                                                    })
                                                }), () => {
                                                    if (skillItem.id !== undefined) {
                                                        this.removeLanguageById(skillItem.id)
                                                    }
                                                });
                                            }}
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </span>
                                        {/*<Button*/}
                                        {/*className="deleteSkillSection"*/}
                                        {/*onClick={() => {*/}
                                        {/*this.setState((prevState) => ({*/}
                                        {/*skills: this.state.skills.filter((_, i) => {*/}
                                        {/*console.log(this.state.skills);*/}
                                        {/*return _.uuid !== skillItem.uuid;*/}
                                        {/*})*/}
                                        {/*}));*/}
                                        {/*}}*/}
                                        {/*>*/}
                                        {/*x*/}
                                        {/*</Button>*/}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-12">
                        <Button onClick={this.handleClickOpen} className="save-skill-button">
                            New Skill
                        </Button>
                        {renderSkillsDialog()}
                    </div>
                </div>
            </div>
        );

        // To render the Skills Dialog
        let renderSkillsDialog = () => (
            <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                <form
                    autoComplete="off"
                    id="skill-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        let item = {
                            uuid: uuidv4(),
                            description: document.getElementById('description').value,
                            level: this.state.percent
                        };

                        this.setState(
                            (prevState) => ({
                                open: false,
                                skills: [...prevState.skills, item]
                            }),
                            () => {
                                this.setState({
                                    percent: 50
                                });
                            }
                        );
                    }}
                    className="apply-form"
                >
                    <h1 className="title-skill-dialog" id="form-dialog-title" style={{textAlign: 'center'}}>
                        New Skill
                    </h1>
                    <br/>
                    <DialogContent style={{width: '450px'}}>
                        <div className="row">
                            <div className="col-12">
                                <span className="primary">Skill Name</span>
                                <br/>
                                <input
                                    id="description"
                                    name="description"
                                    type="text"
                                    className="form-control"
                                    required
                                    min="0"
                                    maxLength="20"
                                    minLength="3"
                                    form="skill-form"
                                />
                            </div>
                        </div>
                        <br/>
                        <div className="row">
                            <div className="col-12">
                                <span className="primary">Skill Level</span>
                                <br/>
                                <InputRange
                                    getPercentSkill={(percent) => {
                                        // update the percent skill
                                        this.setState({
                                            percent: percent
                                        });
                                    }}
                                />
                            </div>
                        </div>
                        <br/>
                        <br/>
                    </DialogContent>
                    <DialogActions>
                        <Button className="cancel-skill-button" onClick={this.handleClose} color="default">
                            Cancel
                        </Button>
                        <Button className="save-skill-button" type="submit" form="skill-form" color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );

        return (
            <div className="Apply-container--application">
                <div className="row">
                    <div className="col-12">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">Skills</span>
                                {/*{*/}
                                    {/*this.state.editing ? (*/}
                                        {/*''*/}
                                    {/*) : (*/}

                                        {/*<button className="applicant-card__edit-button" onClick={() => {*/}
                                            {/*this.setState({*/}
                                                {/*editing: true*/}
                                            {/*})*/}
                                        {/*}}>*/}
                                            {/*{*/}
                                                {/*<span> Add <i className="fas fa-plus"/></span>*/}
                                            {/*}*/}
                                        {/*</button>*/}
                                    {/*)*/}
                                {/*}*/}
                            </div>
                            <div className="row">
                                {
                                    renderSkillsSection()
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default withApollo(Skills);