import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import CustomerLoginForm from "../frontend/src/Components/LoginForm";
import history from './history';

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    {/* <Route path="/" exact component={Home} /> */}
                    <Route path="/CustomerLogin" component={CustomerLoginForm} />
                    {/* <Route path="/Contact" component={Contact} />
                    <Route path="/Products" component={Products} /> */}
                </Switch>
            </Router>
        )
    }
}