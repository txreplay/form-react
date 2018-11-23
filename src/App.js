import React, { Component } from 'react';
import './reset.css';
import './App.css';

const fetch = require('node-fetch');

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            error: undefined,
            gender: 'male',
            firstname: undefined,
            lastname: undefined,
            email: undefined,
            phone: undefined,
            framework: undefined,
            frameworkOther: undefined
        };
    }

    //TODO: Keep data when previous is clicked

    createProfile = (e) => {
        e.preventDefault();

        fetch('http://localhost:3001/form', {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                gender: this.state.gender,
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                email: this.state.email,
                phone: this.state.phone,
                framework: this.state.framework,
            })
        }).then((res) => {
            res.json();
        }).then(() => {
            this.setState({step: this.state.step + 1,})
        }).catch((err) => {
            console.log(err);
        });
    };

    previous() {
        this.setState({step: this.state.step - 1})
    }

    next() {
        this.setState({error: ''});

        if (this.state.step === 1) {
            if (this.firstname.value === '') {
                this.setState({error: 'Le champ prénom est obligatoire.'});
            } else if (this.lastname.value === '') {
                this.setState({error: 'Le champ nom est obligatoire.'});
            } else if (this.email.value === '') {
                this.setState({error: 'Le champ email est obligatoire.'});
            } else if (!this.email.value.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)) {
                this.setState({error: "L'email n'est pas au bon format."});
            } else if (this.phone.value && !this.phone.value.match(/(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/gi)) {
                this.setState({error: "Le téléphone n'est pas au bon format."});
            } else {
                this.setState({
                    step: this.state.step + 1,
                    firstname: this.firstname.value,
                    lastname: this.lastname.value,
                    email: this.email.value,
                    phone: this.phone.value
                });
            }
        }

        if (this.state.step === 2) {
            if (this.state.framework === undefined) {
                this.setState({error: 'Le champ nom est obligatoire.'});
            } else if (this.state.framework === 'other' && this.state.frameworkOther === undefined) {
                this.setState({error: 'Le champ framwork est obligatoire.'});
            } else {
                if (this.state.framework === 'other') {
                  this.setState({framework: this.state.frameworkOther});
                }
                this.setState({step: this.state.step + 1,})
            }
        }
    }

    cancel() {
        console.log(this.state);
    }

    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState({[name]: value});
    };

    render() {
        return (
            <div className="App">
                <div>
                    <h1>Form</h1>
                    <p><small>Les champs marqués d'un * sont obligatoire.</small></p>
                </div>

                <form onSubmit={this.createProfile}>
                    {(this.state.step === 1) ?
                        <div className="step1">
                            <div className="form-wrapper">
                                <select name="gender" value={this.state.gender} id="gender" onChange={this.handleChange}>
                                    <optgroup label="Please choose:">
                                        <option value="male">Homme</option>
                                        <option value="female">Femme</option>
                                        <option value="other">Autre</option>
                                    </optgroup>
                                </select>
                            </div>
                            <div className="form-wrapper">
                                <input type="text" required placeholder="Prénom *" name="firstname" id="firstname" ref={(i) => this.firstname = i} />
                            </div>
                            <div className="form-wrapper">
                                <input type="text" required placeholder="Nom *" name="lastname" id="lastname" ref={(i) => this.lastname = i}/>
                            </div>
                            <div className="form-wrapper">
                                <input type="email" required placeholder="E-mail *" name="email" id="email" ref={(i) => this.email = i}/>
                            </div>
                            <div className="form-wrapper">
                                <input type="text" placeholder="Téléphone (+33...)" name="phone" id="phone" ref={(i) => this.phone = i}/>
                            </div>
                        </div>
                        : ''}

                    {(this.state.step === 2) ?
                        <div className="step2">
                            <div className="form-radio">
                                <input type="radio" checked={this.state.framework === 'vuejs'} onChange={this.handleChange} id="vuejs" name="framework" value="vuejs" />
                                <label htmlFor="vuejs">Vue.js</label>
                            </div>
                            <div className="form-radio">
                                <input type="radio" checked={this.state.framework === 'react'} onChange={this.handleChange} id="react" name="framework" value="react" />
                                <label htmlFor="react">React</label>
                            </div>
                            <div className="form-radio">
                                <input type="radio" checked={this.state.framework === 'angular'} onChange={this.handleChange} id="angular" name="framework" value="angular" />
                                <label htmlFor="angular">Angular</label>
                            </div>
                            <div className="form-radio">
                                <input type="radio" checked={this.state.framework === 'other'} onChange={this.handleChange} id="other" name="framework" value="other" />
                                <label htmlFor="other">Other</label>
                            </div>
                            {(this.state.framework === 'other') ?
                                <div className="form-wrapper">
                                    <textarea name="frameworkOther" onChange={this.handleChange} id="frameworkOther" cols="30" rows="10"/>
                                </div>
                                : ''}
                        </div>
                        : ''}

                    {(this.state.step === 3) ?
                        <div className="step3">
                            <ul>
                                <li><b>Genre: </b>{this.state.gender}</li>
                                <li><b>Prénom: </b>{this.state.firstname}</li>
                                <li><b>Nom: </b>{this.state.lastname}</li>
                                <li><b>Email: </b>{this.state.email}</li>
                                <li><b>Télephone: </b>{this.state.phone}</li>
                                <li><b>Framwork: </b>{this.state.framework}</li>
                            </ul>
                        </div>
                        : ''}


                    {(this.state.error) ? <p className="error">{this.state.error}</p> : ''}
                    {(this.state.step === 4) ? <p className="success">Formulaire enregistré avec succès.</p> : ''}

                    <div className="btns">
                        {(this.state.step === 2 || this.state.step === 3) ? <button type="button" onClick={() => this.previous()}>Précedent</button> : ''}
                        {(this.state.step === 1 || this.state.step === 2) ? <button type="button" onClick={() => this.next()}>Suivant</button> : ''}
                        {(this.state.step === 3) ? <button type="submit">Sauvegarder</button> : ''}
                        {(this.state.step === 3) ? <button type="button" onClick={() => this.cancel()}>Annuler</button> : ''}
                    </div>
                </form>
            </div>
        );
    }
}

export default App;