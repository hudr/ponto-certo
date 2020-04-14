import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import routes from './routes'

import './App.css'

function App() {
  return (
    <Switch>
      {routes.map((route) => (
        <Route key={route.path} {...route} />
      ))}
    </Switch>
  )
}

export default withRouter(App)
