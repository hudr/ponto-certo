import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store/index'

import { BrowserRouter as Router } from 'react-router-dom'

import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme, CssBaseline } from '@material-ui/core'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
})

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<h1>Carregando...</h1>} persistor={persistor}>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)
