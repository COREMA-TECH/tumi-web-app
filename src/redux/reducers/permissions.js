import { GET_PERMISSION } from '../types';

const INITIAL_STATE = {
  permissions: []
}
const permissionsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_PERMISSION:
      return { ...state, permissions: action.payload }
    default:
      return state
  }
}

export default permissionsReducer