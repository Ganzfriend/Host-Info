import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import Location from './Location.jsx';
import Host from './HostInfo.jsx';
import Know from './ToKnow.jsx';

const App = () => (
  <HashRouter>
    <Switch>
      <Route path='/listing/:id'>
        <div>
          <Location />
          <Host />
          <Know />
        </div>
      </Route>
    </Switch>
  </HashRouter>
);

export default App;
