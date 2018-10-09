import React, {Component} from 'react';
import withApollo from "react-apollo/withApollo";
import InputRangeDisabled from "../../ui/InputRange/InputRangeDisabled";
import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import InputRange from "../../ui/InputRange/InputRange";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import {ADD_SKILL, REMOVE_APPLICANT_LANGUAGE, REMOVE_APPLICANT_SKILL} from "../../Mutations";
import {GET_APPLICATION_SKILLS_BY_ID} from "../../Queries";
import CircularProgressLoading from "../../../material-ui/CircularProgressLoading";
import withGlobalContent from "../../../Generic/Global";
import SkillCard from "../../../ui-components/SkillCard/SkillCard";

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
            open: false,
            loading: false
        }
    }

    // To open the skill dialog
    handleClickOpen = () => {
        this.setState({open: true});
    };

    // To close the skill dialog
    handleClose = () => {
        this.setState({
            open: false,
            editing: false
        });
    };

    // To get a list of languages saved from API
    getSkillsList = (id) => {
        this.setState({
            loading: true
        }, () => {
            this.props.client
                .query({
                    query: GET_APPLICATION_SKILLS_BY_ID,
                    variables: {
                        id: id
                    },
                    fetchPolicy: 'no-cache'
                })
                .then(({data}) => {
                    this.setState({
                        skills: data.applications[0].skills,
                        loading: false
                    })
                })
                .catch();
        });
    };

    // To insert a list of skills
    insertSkillsApplication = () => {
        if (this.state.skills.length > 0) {
            // to remove all the uuid properties in the object
            this.state.skills.forEach((item) => {
                delete item.uuid;
            });

            this.state.skills.forEach((item) => {
                item.ApplicationId = this.state.applicationId;
            });

            this.setState((prevState) => ({
                newSkills: this.state.skills.filter((_, i) => {
                    console.log(_.id);
                    return _.id === undefined;
                })
            }), () => {
                this.props.client
                    .mutate({
                        mutation: ADD_SKILL,
                        variables: {
                            application: this.state.newSkills
                        }
                    })
                    .then(() => {
                        this.setState({
                            editing: false,
                            newSkills: []
                        });

                        this.props.handleOpenSnackbar(
                            'success',
                            'Successfully created',
                            'bottom',
                            'right'
                        );

                        this.getSkillsList(this.state.applicationId);
                    })
                    .catch((error) => {
                        // Replace this alert with a Snackbar message error
                        this.props.handleOpenSnackbar(
                            'error',
                            'Error to remove skill. Please, try again!',
                            'bottom',
                            'right'
                        );
                    });
            });


        }
    };

    removeSkillById = (id) => {
        this.props.client
            .mutate({
                mutation: REMOVE_APPLICANT_SKILL,
                variables: {
                    id: id
                }
            })
            .then(({data}) => {
                this.props.handleOpenSnackbar(
                    'success',
                    'Successfully removed',
                    'bottom',
                    'right'
                );
                this.getSkillsList(this.state.applicationId);
            })
            .catch();
    };

    componentWillMount() {
        this.setState({
            applicationId: this.props.applicationId
        }, () => {
            this.getSkillsList(this.state.applicationId);
        });
    }


    render() {

        // To render the skills section
        let renderSkillsSection = () => (
            <div className="">
                <div className="row">
                    <div className="col-12">
                        {this.state.skills.map((skillItem) => (
                            <div className="col-4">
                                <SkillCard
                                    skillDescription={skillItem.description}
                                    skillLevel={skillItem.level}
                                    removeSkill={() => {
                                        this.setState((prevState) => ({
                                            skills: this.state.skills.filter((_, i) => {
                                                console.log(this.state.skills);
                                                return _.uuid !== skillItem.uuid;
                                            })
                                        }), () => {
                                            if (skillItem.id !== undefined) {
                                                this.removeSkillById(skillItem.id)
                                            }
                                        });
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="col-12">
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
                                this.insertSkillsApplication();
                                this.setState({
                                    percent: 50
                                });
                            }
                        );
                    }}
                    className="apply-form"
                >
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
                                {
                                    this.state.editing ? (
                                        ''
                                    ) : (

                                        <button className="applicant-card__edit-button" onClick={() => {
                                            this.setState({
                                                editing: true,
                                                open: true
                                            })
                                        }}>
                                            {
                                                <span> Add <i className="fas fa-plus"/></span>
                                            }
                                        </button>
                                    )
                                }
                            </div>
                            <div className="row">
                                {
                                    this.state.loading ? (
                                        <div className="form-section-1 form-section--center">
                                            <CircularProgressLoading/>
                                        </div>
                                    ) : (
                                        renderSkillsSection()
                                    )
                                }
                            </div>
                            {/*{*/}
                                {/*this.state.editing ? (*/}
                                    {/*<div className="applicant-card__footer">*/}
                                        {/*<button*/}
                                            {/*className="applicant-card__cancel-button"*/}
                                            {/*onClick={*/}
                                                {/*() => {*/}
                                                    {/*this.setState((prevState) => ({*/}
                                                        {/*skills: this.state.skills.filter((_, i) => {*/}
                                                            {/*return _.id !== undefined;*/}
                                                        {/*})*/}
                                                    {/*}), () => {*/}
                                                        {/*this.setState({*/}
                                                            {/*editing: false*/}
                                                        {/*});*/}
                                                    {/*});*/}
                                                {/*}*/}
                                            {/*}*/}
                                        {/*>*/}
                                            {/*Cancel*/}
                                        {/*</button>*/}
                                        {/*<button*/}
                                            {/*onClick={() => {*/}
                                                {/*this.insertSkillsApplication()*/}
                                            {/*}}*/}
                                            {/*className="applicant-card__save-button">*/}
                                            {/*Save*/}
                                        {/*</button>*/}
                                    {/*</div>*/}
                                {/*) : (*/}
                                    {/*''*/}
                                {/*)*/}
                            {/*}*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default withApollo(withGlobalContent(Skills));