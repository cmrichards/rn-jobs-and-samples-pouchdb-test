import React, {Component} from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import AppContainerWithCardStack from "./containers/AppContainerWithCardStack";

import * as reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

import Database from "./Database"

export default class App extends Component {

  constructor(props) {
    super(props)
    this.database = new Database()
  }

  componentWillUnmount() {
    this.database.closeConnection()
  }

  render() {
    return (
      <Provider store={store}>
        <AppContainerWithCardStack database={this.database}/>
      </Provider>
    );
  }
}
