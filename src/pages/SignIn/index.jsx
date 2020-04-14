import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

import { Creators as AuthActions } from '../../store/ducks/auth'

function Copyright() {
  return (
    <Typography variant='body2' color='textPrimary' align='center'>
      {'Copyright © '}
      Ponto Certo
    </Typography>
  )
}

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(12, 0, 0, 0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  title: {
    fontSize: '2.3em',
    fontWeight: 'bold',
  },
}))

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
  },
})(TextField)

export default function SignIn() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  function handleLogin(e) {
    e.preventDefault()
    dispatch(AuthActions.handleLogin(email, senha))
  }

  //Getting redux states
  const { isLogged } = useSelector(
    (state) => ({
      isLogged: state.auth.isLogged,
    }),
    shallowEqual
  )

  useEffect(() => {
    if (isLogged) {
      history.push('/inicio')
    }
  }, [isLogged, history])

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography className={classes.title} component='h1' variant='h5'>
          Ponto Certo
        </Typography>
        <form className={classes.form} onSubmit={handleLogin}>
          <CssTextField
            style={{ borderColor: 'white' }}
            variant='outlined'
            margin='normal'
            fullWidth
            id='email'
            label='Email'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete='email'
          />
          <CssTextField
            variant='outlined'
            margin='normal'
            fullWidth
            name='senha'
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            label='Senha'
            type='password'
            id='senha'
            autoComplete='current-password'
          />

          <Button
            color='primary'
            type='submit'
            fullWidth
            variant='contained'
            className={classes.submit}
          >
            ENTRAR
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}
