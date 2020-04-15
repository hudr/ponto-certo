import firebase from '../../config/Firebase'

import { alertSuccessMessage, alertErrorMessage } from '../../Utils/SweetAlert'

import { Creators as MarksCreators } from './mark'

export const Types = {
  LOADING: 'auth/LOADING',
  LOGIN: 'auth/LOGIN',
  LOGOUT: 'auth/LOGOUT',
  USERINFO: 'auth/USERINFO',
  ERROR: 'auth/ERROR',
}

const INITIAL_STATE = {
  isLogged: false,
  isLoading: false,
  authUser: {},
  errorMessage: '',
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case Types.LOADING:
      return {
        ...state,
        isLoading: action.payload,
      }
    case Types.LOGIN:
      return {
        ...state,
        isLogged: true,
        errorMessage: '',
      }
    case Types.USERINFO:
      return {
        ...state,
        authUser: action.payload,
        isLogged: action.payload.isLogged,
        errorMessage: '',
      }
    case Types.LOGOUT:
      return {
        ...state,
        isLogged: action.payload.isLogged,
        authUser: action.payload.authUser,
      }
    case Types.ERROR:
      return {
        ...state,
        errorMessage: action.payload,
      }
    default:
      return state
  }
}

export const Creators = {
  handleSignUp: (nome, endereco, email, senha, confirmarsenha) => {
    return async (dispatch) => {
      const db = firebase.firestore()

      if (!nome || !endereco || !email || !senha || !confirmarsenha) {
        dispatch({
          type: Types.ERROR,
          payload: 'Preencha todos os campos.',
        })
        return alertErrorMessage('Preencha todos os campos.')
      } else if (senha !== confirmarsenha) {
        dispatch({
          type: Types.ERROR,
          payload: 'As senhas precisam ser iguais.',
        })
        return alertErrorMessage('As senhas precisam ser iguais.')
      } else {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(email, senha)
          .then(async (user) => {
            await db
              .collection('users')
              .doc('data')
              .collection('profile')
              .doc(user.user.uid)
              .set({
                nome,
                enderecoprofissional: endereco,
              })

            dispatch({
              type: Types.USERINFO,
              payload: {
                nome,
                enderecoprofissional: endereco,
                email,
                isLogged: false,
              },
            })

            return alertSuccessMessage('Conta criada com sucesso!')
          })
          .catch((error) => {
            if (error.code === 'auth/invalid-email') {
              dispatch({
                type: Types.ERROR,
                payload: 'Endereço de email inválido.',
              })

              return alertErrorMessage('Endereço de email inválido.')
            } else if (error.code === 'auth/email-already-in-use') {
              dispatch({
                type: Types.ERROR,
                payload: 'Email já está em uso.',
              })
              return alertErrorMessage('Email já está em uso.')
            } else if (error.code === 'auth/weak-password') {
              dispatch({
                type: Types.ERROR,
                payload: 'Você precisa de uma senha mais forte.',
              })
              return alertErrorMessage('Você precisa de uma senha mais forte.')
            } else if (error.code === 'auth/operation-not-allowed') {
              dispatch({
                type: Types.ERROR,
                payload: 'Criação de usuário por email desabilitada',
              })
              return alertErrorMessage(
                'Criação de usuário por email desabilitada.'
              )
            }
          })
      }
    }
  },

  handleLogin: (email, senha) => {
    return async (dispatch) => {
      if (!email || !senha) {
        dispatch({
          type: Types.ERROR,
          payload: 'Preencha todos os campos.',
        })
        return alertErrorMessage('Preencha todos os campos.')
      } else {
        await firebase
          .auth()
          .signInWithEmailAndPassword(email, senha)
          .then(async () => {
            await dispatch(Creators.handleUserInfo())
          })
          .then(() => {
            dispatch({
              type: Types.LOGIN,
              payload: true,
            })
          })
          .then(() => {
            return alertSuccessMessage('Logado com sucesso!')
          })
          .catch((error) => {
            if (error.code === 'auth/invalid-email') {
              dispatch({
                type: Types.ERROR,
                payload: 'Endereço de email inválido.',
              })
              return alertErrorMessage('Endereço de email inválido.')
            } else if (error.code === 'auth/user-not-found') {
              dispatch({
                type: Types.ERROR,
                payload: 'Esta conta não existe.',
              })
              return alertErrorMessage('Esta conta não existe.')
            } else if (error.code === 'auth/wrong-password') {
              dispatch({
                type: Types.ERROR,
                payload: 'Senha inválida',
              })
              return alertErrorMessage('Senha inválida.')
            } else if (error.code === 'auth/too-many-requests') {
              dispatch({
                type: Types.ERROR,
                payload: 'Você tentou logar muitas vezes, aguarde',
              })
              return alertErrorMessage(
                'Você tentou logar muitas vezes, aguarde.'
              )
            }
          })
      }
    }
  },

  handleUserInfo: () => {
    return async (dispatch) => {
      const user = firebase.auth().currentUser
      if (user) {
        const db = firebase.firestore()
        const docRef = db
          .collection('users')
          .doc('data')
          .collection('profile')
          .doc(`${user.uid}`)
        docRef
          .get()
          .then(async (doc) => {
            if (doc.exists) {
              dispatch(Creators.handleLoader(true))
              const userName = await doc.data().nome
              const businessAddress = await doc.data().enderecoprofissional

              dispatch({
                type: Types.USERINFO,
                payload: {
                  userName,
                  businessAddress,
                  userUid: user.uid,
                  isLogged: true,
                },
              })
            } else {
              console.warn('Documento não encontrado!')
            }
          })
          .then(async () => {
            await dispatch(MarksCreators.getMarks())
            dispatch(Creators.handleLoader(false))
          })
          .catch(function (error) {
            console.warn('Erro ao solicitar documento:', error)
          })
      } else {
        console.warn('Usuário não está logado')
      }
    }
  },

  handleLogout: () => {
    return async (dispatch) => {
      try {
        await firebase
          .auth()
          .signOut()
          .then(() =>
            dispatch({
              type: Types.LOGOUT,
              payload: {
                isLogged: false,
                authUser: {},
              },
            })
          )
          .catch((error) => {
            console.error(error)
          })
      } catch (err) {
        console.log(err)
      }
    }
  },

  handleLoader: (status) => {
    return async (dispatch) => {
      dispatch({
        type: Types.LOADING,
        payload: status,
      })
    }
  },
}
