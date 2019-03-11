import { ADD_TASK, ADD_COLUMN, REORDER_COLUMN, REORDER_COLUMN_TASKS } from '../Actions/index';
import { combineReducers } from 'redux';
import * as R from 'ramda';

const Tasks = (state = [], action) => {
  if (action.type === ADD_TASK) {
    return [...state, action.payload];
  }
  return state;
}
//Add new Column to Column Order array
const ColumnOrder = (state = [], action) => {
  if (action.type === ADD_COLUMN) {
    return [...state, action.payload.columnId];
  }
  if (action.type === REORDER_COLUMN) {
    return action.payload;
  }
  return state;
}
//Add new column to Columns
const Columns = (state = [], action) => {
  if (action.type === ADD_COLUMN) {
    return [...state, action.payload];
  }
  if (action.type === ADD_TASK) {
    //find specific column's Tasks array
    let columnTasks = R.find(R.propEq('columnId', action.columnId))(state).taskIds;
    //append new taskid in this column's tasks array
    columnTasks = [...columnTasks, action.payload.taskId];
    return R.map(
      R.when(R.propEq('columnId', action.columnId), R.assoc('taskIds', columnTasks)),
      state
    );
  }
  if (action.type === REORDER_COLUMN_TASKS) {
    return action.payload;
  }
  return state;
}

const rootReducer = combineReducers({
  Tasks,
  ColumnOrder,
  Columns
})
export default rootReducer;