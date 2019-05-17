import { ADD_COLUMN, REORDER_COLUMN } from '../Actions/index';

//Add new Column to Column Order array
export const ColumnOrder = (state = [], action) => {
  if (action.type === ADD_COLUMN) {
    return [...state, action.payload.columnId];
  }
  if (action.type === REORDER_COLUMN) {
    return action.payload;
  }
  return state;
}