import * as AxiosMark from '../../service/Axios'

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
      await AxiosMark.insertMark(markData)
      await dispatch(Creators.getMarks())
    }
  },

  removeUserMark: (rowIndex) => {
    return async (dispatch) => {
      await AxiosMark.removeMask(rowIndex)
      await dispatch(Creators.getMarks())
    }
  },
}
