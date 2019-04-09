import React, { Component } from 'react';
import JsonHelper from '../../services/JsonHelper';

import './item-add-form.css';

export default class ItemAddForm extends Component {

    state = {
        label: ''
    };

    jsonHelper = new JsonHelper();

    onLabelChange = (e) => {
        this.setState({
            label: e.target.value
        });
    };

    onSubmit = (e) => {
        e.preventDefault();
        const { label } = this.state;        
        const cb = this.props.onItemAdded || (() => { });

        let form = document.querySelector('#frmCreate');
        let formJson = this.jsonHelper.formToJson(form);
        console.log(formJson);
        fetch('api/ToDo',
            {
                method: 'Post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formJson)
            })
            .then((response) => {
                if (response.status === 200 || response.status === 201) {
                    cb();
                    this.setState({ label: '' });
                }
                else {
                    return response.json();
                }
            });
        
    };

    render() {

        const { deleteRows } = this.props;

        return (
            <form
                id='frmCreate'
                className="bottom-panel d-flex"
                onSubmit={this.onSubmit}>

                <input type="text"
                    name='Label'
                    className="form-control new-todo-label"
                    value={this.state.label}
                    onChange={this.onLabelChange}
                    placeholder="What needs to be done?" />

                <button type="submit"
                    className="btn btn-outline-secondary">Add</button>
                <input type="button" className="btn btn-outline-secondary" name="action" onClick={deleteRows} value="Remove Selected" />
            </form>
        );
    }
}
