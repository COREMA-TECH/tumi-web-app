import React, {Component} from 'react';
import '../index.css';
import languageLevelsJSON from "../../data/languagesLevels";
import Button from "@material-ui/core/Button/Button";
import {GET_APPLICATION_LANGUAGES_BY_ID, GET_LANGUAGES_QUERY} from "../../Queries";
import withApollo from "react-apollo/withApollo";
import {ADD_LANGUAGES, REMOVE_APPLICANT_EDUCATION, REMOVE_APPLICANT_LANGUAGE} from "../../Mutations";

const uuidv4 = require('uuid/v4');

class Language extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // Editing state properties - To edit general info
            editing: false,
            languages: [],
            languagesLoaded: [],
            newLanguages: [],
            applicationId: null
        }
    }

    // To get a list of languages saved from API
    getLanguagesList = (id) => {
        this.props.client
            .query({
                query: GET_APPLICATION_LANGUAGES_BY_ID,
                variables: {
                    id: id
                },
                fetchPolicy: 'no-cache'
            })
            .then(({data}) => {
                this.setState({
                    languages: data.applications[0].languages
                })
            })
            .catch();
    };

    // To get a list of languages from API
    getAllLanguagesList = () => {
        this.props.client
            .query({
                query: GET_LANGUAGES_QUERY
            })
            .then(({data}) => {
                this.setState({
                    languagesLoaded: data.getcatalogitem
                })
            })
            .catch();
    };

    // To insert languages
    insertLanguagesApplication = () => {
        if (this.state.languages.length > 0) {
            // to remove all the uuid properties in the object
            this.state.languages.forEach((item) => {
                delete item.uuid;
            });

            this.state.languages.forEach((item) => {
                item.ApplicationId = this.state.applicationId;
            });

            this.setState((prevState) => ({
                newLanguages: this.state.languages.filter((_, i) => {
                    console.log(_.id);
                    return _.id === undefined;
                })
            }), () => {
                // Then insert education list
                this.props.client
                    .mutate({
                        mutation: ADD_LANGUAGES,
                        variables: {
                            application: this.state.newLanguages
                        }
                    })
                    .then(() => {
                        this.setState({
                            editing: false
                        });

                        this.getLanguagesList(this.props.applicationId);
                    })
                    .catch((error) => {
                        // Replace this alert with a Snackbar message error
                        alert('Error');
                    });
            });
        }
    };

    removeLanguageById = (id) => {
        this.props.client
            .mutate({
                mutation: REMOVE_APPLICANT_LANGUAGE,
                variables: {
                    id: id
                }
            })
            .then(({data}) => {
                this.getLanguagesList(this.state.applicationId);
            })
            .catch();
    };

    componentWillMount() {
        this.setState({
            applicationId: this.props.applicationId
        }, () => {
            this.getAllLanguagesList();
            this.getLanguagesList(this.state.applicationId);
        });
    }

    render() {

        // To render the Languages Section
        let renderlanguagesSection = () => (
            <div>
                {this.state.languages.length > 0 ? (
                    <div className="skills-container skills-container--header">
                        <div className="row">
                            <div className="col-3">
                                <span>Language Name</span>
                            </div>
                            <div className="col-4">
                                <span>Conversation</span>
                            </div>
                            <div className="col-4">
                                <span>Writing</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    ''
                )}

                {this.state.languages.map((languageItem) => (
                    <div key={uuidv4()} className="skills-container">
                        <div className="row">
                            <div className="col-3">
                                <span>
                                    {this.state.languagesLoaded.map((item) => {

                                        if (item.Id == languageItem.language) {
                                            return item.Name.trim();
                                        }
                                    })}
                                </span>
                            </div>
                            <div className="col-4">
                                <span>
                                    {languageLevelsJSON.map((item) => {
                                        if (item.Id == languageItem.conversation) {
                                            return item.Name;
                                        }
                                    })}
                                </span>
                            </div>
                            <div className="col-4">
                                <span>
                                    {languageLevelsJSON.map((item) => {
                                        if (item.Id == languageItem.writing) {
                                            return item.Name;
                                        }
                                    })}
                                </span>
                            </div>
                            <div className="col-1">
                                <span
                                    className="delete-school-button"
                                    onClick={() => {
                                        this.setState((prevState) => ({
                                            languages: this.state.languages.filter((_, i) => {
                                                return _.uuid !== languageItem.uuid;
                                            })
                                        }), () => {
                                            if (languageItem.id !== undefined) {
                                                this.removeLanguageById(languageItem.id)
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
                                {/*languages: this.state.languages.filter((_, i) => {*/}
                                {/*console.log(this.state.languages);*/}
                                {/*return _.uuid !== languageItem.uuid;*/}
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
                <br/>
                <br/>
                {
                    this.state.editing ? (
                        <form
                            className="row form-section-1"
                            id="form-language"
                            autoComplete="off"
                            onSubmit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                let item = {
                                    uuid: uuidv4(),
                                    ApplicationId: this.state.applicationId,
                                    language: document.getElementById('nameLanguage').value,
                                    writing: parseInt(document.getElementById('writingLanguage').value),
                                    conversation: parseInt(document.getElementById('conversationLanguage').value)
                                };
                                this.setState(
                                    (prevState) => ({
                                        open: false,
                                        languages: [...prevState.languages, item]
                                    }),
                                    () => {
                                        document.getElementById('form-language').reset();
                                        document.getElementById('writingLanguage').classList.remove('invalid-apply-form');
                                        document.getElementById('conversationLanguage').classList.remove('invalid-apply-form');
                                        document.getElementById('nameLanguage').classList.remove('invalid-apply-form');
                                    }
                                );
                            }}
                        >
                            <div className="col-4">
                                <span className="primary"> Languages</span>
                                <select
                                    id="nameLanguage"
                                    name="languageName"
                                    required
                                    className="form-control"
                                    form="form-language">
                                    <option value="">Select an option</option>
                                    {this.state.languagesLoaded.map((item) => (
                                        <option value={item.Id}>{item.Name}</option>
                                    ))}
                                </select>

                                {/*<Query query={GET_LANGUAGES_QUERY}>*/}
                                {/*{({loading, error, data, refetch, networkStatus}) => {*/}
                                {/*//if (networkStatus === 4) return <LinearProgress />;*/}
                                {/*if (loading) return <LinearProgress/>;*/}
                                {/*if (error) return <p>Error </p>;*/}
                                {/*if (this.state.languagesLoaded != null && this.state.languagesLoaded.length > 0) {*/}
                                {/*return (*/}
                                {/**/}
                                {/*);*/}
                                {/*}*/}
                                {/*return <SelectNothingToDisplay/>;*/}
                                {/*}}*/}
                                {/*</Query>*/}
                                {/*<input*/}
                                <span className="check-icon"/>
                            </div>
                            <div className="col-3">
                                <span className="primary"> Conversation</span>
                                <select
                                    required
                                    id="conversationLanguage"
                                    form="form-language"
                                    name="conversationLanguage"
                                    className="form-control"
                                >
                                    <option value="">Select an option</option>
                                    {languageLevelsJSON.map((item) => <option value={item.Id}>{item.Name}</option>)}
                                </select>
                                <span className="check-icon"/>
                            </div>
                            <div className="col-3">
                                <span className="primary"> Writing</span>
                                <select
                                    required
                                    id="writingLanguage"
                                    form="form-language"
                                    name="writingLanguage"
                                    className="form-control"
                                >
                                    <option value="">Select an option</option>
                                    {languageLevelsJSON.map((item) => <option value={item.Id}>{item.Name}</option>)}
                                </select>
                                <span className="check-icon"/>
                            </div>
                            <div className="col-2">
                                <br/>
                                <Button type="submit" form="form-language" className="save-skill-button">
                                    Add
                                </Button>
                            </div>
                        </form>
                    ) : ''
                }
            </div>
        );

        return (
            <div className="Apply-container--application">
                <div className="row">
                    <div className="col-12">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">Languages</span>
                                {
                                    this.state.editing ? (
                                        ''
                                    ) : (
                                        <button className="applicant-card__edit-button" onClick={() => {
                                            this.setState({
                                                editing: true
                                            })
                                        }}>Add <i className="fas fa-plus"/>
                                        </button>
                                    )
                                }
                            </div>
                            <div className="row">
                                {
                                    renderlanguagesSection()
                                }
                            </div>
                            {
                                this.state.editing ? (
                                    <div className="applicant-card__footer">
                                        <button
                                            className="applicant-card__cancel-button"
                                            onClick={
                                                () => {
                                                    this.setState((prevState) => ({
                                                        languages: this.state.languages.filter((_, i) => {
                                                            return _.id !== undefined;
                                                        })
                                                    }), () => {
                                                        this.setState({
                                                            editing: false
                                                        });
                                                    });
                                                }
                                            }
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                this.insertLanguagesApplication()
                                            }}
                                            className="applicant-card__save-button">
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    ''
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withApollo(Language);