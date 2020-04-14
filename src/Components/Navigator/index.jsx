import React from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ArrowBack from '@material-ui/icons/ArrowBack'
import IconButton from '@material-ui/core/IconButton'
import ExitToApp from '@material-ui/icons/ExitToApp'
import { Creators as AuthActions } from '../../store/ducks/auth'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

export default function Navigator() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()

  //Getting redux states
  const { authUser } = useSelector(
    (state) => ({
      authUser: state.auth.authUser,
    }),
    shallowEqual
  )

  function handleLogout() {
    dispatch(AuthActions.handleLogout())
    localStorage.removeItem('persist:root')
    history.push('/')
  }

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            onClick={() => history.goBack()}
            edge='start'
            color='inherit'
            aria-label='menu'
          >
            <ArrowBack />
          </IconButton>
          <Typography
            style={{ textAlign: 'center' }}
            variant='h6'
            className={classes.title}
          >
            {`Olá, ${authUser.userName}!`}
          </Typography>
          <IconButton
            onClick={() => handleLogout()}
            edge='end'
            color='inherit'
            aria-label='menu'
          >
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  )
}
