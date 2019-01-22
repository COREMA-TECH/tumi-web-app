import React, { Component } from 'react';
import '../index.css';
import languageLevelsJSON from '../../data/languagesLevels';
import Button from '@material-ui/core/Button/Button';
import { GET_APPLICATION_LANGUAGES_BY_ID, GET_LANGUAGES_QUERY } from '../../Queries';
import withApollo from 'react-apollo/withApollo';
import { ADD_LANGUAGES, REMOVE_APPLICANT_LANGUAGE } from '../../Mutations';
import CircularProgressLoading from '../../../material-ui/CircularProgressLoading';
import withGlobalContent from '../../../Generic/Global';

const menuSpanish = require(`../languagesJSON/${localStorage.getItem('languageForm')}/menuSpanish`);
const spanishActions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);
const languagesTable = require(`../languagesJSON/${localStorage.getItem('languageForm')}/languagesTable`);

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
            applicationId: null,
            loading: false
        };
    }

    // To get a list of languages saved from API
    getLanguagesList = (id) => {
        this.setState(
            {
                loading: true
            },
            () => {
                this.props.client
                    .query({
                        query: GET_APPLICATION_LANGUAGES_BY_ID,
                        variables: {
                            id: id
                        },
                        fetchPolicy: 'no-cache'
                    })
                    .then(({ data }) => {
                        this.setState({
                            languages: data.applications[0].languages,
                            loading: false
                        });
                    })
                    .catch((error) => {
                        this.props.handleOpenSnackbar(
                            'error',
                            'Error to show languages list. Please, try again!',
                            'bottom',
                            'right'
                        );
                    });
            }
        );
    };

    // To get a list of languages from API
    getAllLanguagesList = () => {
        this.props.client
            .query({
                query: GET_LANGUAGES_QUERY
            })
            .then(({ data }) => {
                this.setState({
                    languagesLoaded: data.getcatalogitem
                });
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

            this.setState(
                (prevState) => ({
                    newLanguages: this.state.languages.filter((_, i) => {
                        console.log(_.id);
                        return _.id === undefined;
                    })
                }),
                () => {
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
                                editing: false,
                                newLanguages: []
                            });

                            this.props.handleOpenSnackbar('success', 'Successfully created', 'bottom', 'right');

                            this.getLanguagesList(this.state.applicationId);
                        })
                        .catch((error) => {
                            // Replace this alert with a Snackbar message error
                            this.props.handleOpenSnackbar(
                                'error',
                                'Error to save languages. Please, try again!',
                                'bottom',
                                'right'
                            );
                        });
                }
            );
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
            .then(({ data }) => {
                this.props.handleOpenSnackbar('success', 'Successfully removed', 'bottom', 'right');

                this.getLanguagesList(this.state.applicationId);
            })
            .catch((error) => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to remove languages. Please, try again!',
                    'bottom',
                    'right'
                );
            });
    };

    componentWillMount() {
        this.setState(
            {
                applicationId: this.props.applicationId
            },
            () => {
                this.getAllLanguagesList();
                this.getLanguagesList(this.state.applicationId);
            }
        );
    }

    render() {
        // To render the Languages Section
        let renderlanguagesSection = () => (
            <div>
                {this.state.editing ? (
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
                                    document
                                        .getElementById('conversationLanguage')
                                        .classList.remove('invalid-apply-form');
                                    document.getElementById('nameLanguage').classList.remove('invalid-apply-form');
                                }
                            );
                        }}
                    >
                        <div className="col-4">
                            <span className="primary"> * {languagesTable[0].label}</span>
                            <select
                                id="nameLanguage"
                                name="languageName"
                                required
                                className="form-control"
                                form="form-language"
                            >
                                <option value="">{spanishActions[5].label}</option>
                                {this.state.languagesLoaded.map((item) => <option value={item.Id}>{item.Name}</option>)}
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
                            <span className="check-icon" />
                        </div>
                        <div className="col-3">
                            <span className="primary">* {languagesTable[1].label}</span>
                            <select
                                required
                                id="conversationLanguage"
                                form="form-language"
                                name="conversationLanguage"
                                className="form-control"
                            >
                                <option value="">{spanishActions[5].label}</option>
                                {languageLevelsJSON.map((item) => <option value={item.Id}>{item.Name}</option>)}
                            </select>
                            <span className="check-icon" />
                        </div>
                        <div className="col-3">
                            <span className="primary">* {languagesTable[2].label}</span>
                            <select
                                required
                                id="writingLanguage"
                                form="form-language"
                                name="writingLanguage"
                                className="form-control"
                            >
                                <option value="">{spanishActions[5].label}</option>
                                {languageLevelsJSON.map((item) => <option value={item.Id}>{item.Name}</option>)}
                            </select>
                            <span className="check-icon" />
                        </div>
                        <div className="col-2">
                            <br />
                            <Button type="submit" form="form-language" className="save-skill-button">
                                {spanishActions[0].label}
                            </Button>
                        </div>
                    </form>
                ) : (
                        ''
                    )}
                <br />
                {this.state.languages.length > 0 ? (
                    <div className="skills-container skills-container--header">
                        <div className="row">
                            <div className="col-3">
                                <span>{languagesTable[0].label}</span>
                            </div>
                            <div className="col-4">
                                <span>{languagesTable[1].label}</span>
                            </div>
                            <div className="col-4">
                                <span>{languagesTable[2].label}</span>
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
                                        this.setState(
                                            (prevState) => ({
                                                languages: this.state.languages.filter((_, i) => {
                                                    return _.uuid !== languageItem.uuid;
                                                })
                                            }),
                                            () => {
                                                if (languageItem.id !== undefined) {
                                                    this.removeLanguageById(languageItem.id);
                                                }
                                            }
                                        );
                                    }}
                                >
                                    <i className="fas fa-trash-alt" />
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
            </div>
        );

        return (
            <div className="Apply-container--application">
                <div className="">
                    <div className="">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">{menuSpanish[1].label}</span>
                                {this.state.editing ? (
                                    ''
                                ) : (
                                        <button
                                            className="applicant-card__edit-button"
                                            onClick={() => {
                                                this.setState({
                                                    editing: true
                                                });
                                            }}
                                        >
                                            {spanishActions[0].label} <i className="fas fa-plus" />
                                        </button>
                                    )}
                            </div>
                            <div className="">
                                {this.state.loading ? (
                                    <div className="form-section-1 form-section--center">
                                        <CircularProgressLoading />
                                    </div>
                                ) : (
                                        renderlanguagesSection()
                                    )}
                            </div>
                            {this.state.editing ? (
                                <div className="applicant-card__footer">
                                    <button
                                        className="applicant-card__cancel-button"
                                        onClick={() => {
                                            this.setState(
                                                (prevState) => ({
                                                    languages: this.state.languages.filter((_, i) => {
                                                        return _.id !== undefined;
                                                    })
                                                }),
                                                () => {
                                                    this.setState({
                                                        editing: false
                                                    });
                                                }
                                            );
                                        }}
                                    >
                                        {spanishActions[2].label}
                                    </button>
                                    <button
                                        onClick={() => {
                                            this.insertLanguagesApplication();
                                        }}
                                        className="applicant-card__save-button"
                                    >
                                        {spanishActions[4].label}
                                    </button>
                                </div>
                            ) : (
                                    <div className="applicant-card__footer">
                                        <button
                                            className="applicant-card__cancel-button"
                                            onClick={() => {
                                                this.props.handleBack();
                                            }}
                                        >
                                            {spanishActions[9].label}
                                        </button>
                                        <button
                                            onClick={() => {
                                                this.props.handleNext();
                                            }}
                                            className="applicant-card__save-button">
                                            {spanishActions[8].label}
                                        </button>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withApollo(withGlobalContent(Language));
