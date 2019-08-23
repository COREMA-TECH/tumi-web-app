import { GET_PERMISSION } from '../types';

export const setPermissions = (payload) => {
  return {
    type: GET_PERMISSION,
    payload
  }
}
