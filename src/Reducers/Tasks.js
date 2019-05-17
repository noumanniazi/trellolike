import { ADD_TASK, ADD_COLUMN, REORDER_COLUMN, REORDER_COLUMN_TASKS } from '../Actions/index';

export const Tasks = (state = [], action) => {
  if (action.type === ADD_TASK) {
    return [...state, action.payload];
  }
  return state;
}