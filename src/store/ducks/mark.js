import * as AxiosMark from '../../service/Axios'

import { Creators as AuthActions } from '../ducks/auth'

export const Types = {
  MARKS: 'mark/MARKS',
}

const INITIAL_STATE = {
  marks: [],
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case Types.MARKS:
      return {
        ...state,
        marks: action.payload,
      }
    default:
      return state
  }
}

export const Creators = {
  getMarks: () => {
    return async (dispatch) => {
      try {
        const results = await AxiosMark.getMarks()
        dispatch({
          type: Types.MARKS,
          payload: results,
        })
      } catch (err) {
        console.error(err)
      }
    }
  },

  submitUserMark: (markData) => {
    return async (dispatch) => {
      dispatch(AuthActions.handleLoader(true))
      await AxiosMark.insertMark(markData)
      await dispatch(Creators.getMarks())
      dispatch(AuthActions.handleLoader(false))
    }
  },

  removeUserMark: (rowIndex) => {
    return async (dispatch) => {
      dispatch(AuthActions.handleLoader(true))
      await AxiosMark.removeMask(rowIndex)
      await dispatch(Creators.getMarks())
      dispatch(AuthActions.handleLoader(false))
    }
  },
}
