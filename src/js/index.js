import React from 'react';
import ReactDOM from 'react-dom';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import { reducer } from './reducers';
import * as actions from './actions';

import Root from './components/root';

import '../style/index.styl';

let logger = createLogger();
let store = Redux.applyMiddleware(thunkMiddleware, logger)(Redux.createStore)(reducer);

let connectState = state => ({state});
let connectDispatch = dispatch => ({
    dispatch: {
        launch: payload => dispatch(actions.launch(payload)),
    },
});

let Provider = ReactRedux.Provider;
let ConnectedRoot = ReactRedux.connect(connectState, connectDispatch)(Root);
let provider = <Provider store={store}><ConnectedRoot/></Provider>;

let container = document.createElement('div');
container.className = 'react-container';
document.body.appendChild(container);

ReactDOM.render(provider, container);
