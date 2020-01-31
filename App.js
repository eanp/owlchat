import React, {Component} from 'react';
import {Root} from 'native-base';
import Router from './src/config/router';

export default class App extends Component {
  render() {
    return (
      <>
        <Root>
          <Router />
        </Root>
      </>
    );
  }
}
