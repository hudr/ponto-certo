import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

import { Creators as AuthActions } from '../../store/ducks/auth'

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

export default function SignUp() {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [nome, setNome] = useState('')
  const [endereco, setEndereco] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarsenha, setConfirmarSenha] = useState('')

  function handleSignUp(e) {
    e.preventDefault()

    dispatch(
      AuthActions.handleSignUp(nome, endereco, email, senha, confirmarsenha)
    )
  }

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Typography className={classes.title} component='h1' variant='h5'>
          Cadastrar Usuário
        </Typography>
        <form className={classes.form} onSubmit={handleSignUp}>
          <CssTextField
            variant='outlined'
            margin='normal'
            fullWidth
            name='Nome'
            label='Nome'
            type='text'
            id='nome'
            size='small'
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <CssTextField
            variant='outlined'
            margin='normal'
            fullWidth
            name='Endereço Profissional'
            label='Endereço Profissional'
            type='text'
            id='enderecoprofissional'
            size='small'
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />

          <CssTextField
            style={{ borderColor: 'white' }}
            variant='outlined'
            margin='normal'
            fullWidth
            id='email'
            label='Email'
            name='email'
            autoComplete='email'
            size='small'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <CssTextField
            variant='outlined'
            margin='normal'
            fullWidth
            name='senha'
            label='Senha'
            type='password'
            id='senha'
            autoComplete='current-password'
            size='small'
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <CssTextField
            variant='outlined'
            margin='normal'
            fullWidth
            name='confirmarsenha'
            label='Confirmar Senha'
            type='password'
            id='confirmarsenha'
            size='small'
            value={confirmarsenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />

          <Button
            color='primary'
            type='submit'
            fullWidth
            variant='contained'
            className={classes.submit}
            size='small'
          >
            FINALIZAR CADASTRO
          </Button>
        </form>
      </div>
    </Container>
  )
}
