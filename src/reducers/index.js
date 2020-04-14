import { combineReducers } from 'redux'

import auth from '../store/ducks/auth'
import marks from '../store/ducks/mark'

export default combineReducers({
  auth,
  marks,
})
