import { ADD_TASK, ADD_COLUMN, REORDER_COLUMN_TASKS } from '../Actions/index';
import {find, propEq, map, when, assoc} from 'ramda';

//Add new column to Columns
export const Columns = (state = [], action) => {
  if (action.type === ADD_COLUMN) {
    return [...state, action.payload];
  }
  if (action.type === ADD_TASK) {
    //find specific column's Tasks array
    let columnTasks = find(propEq('columnId', action.columnId))(state).taskIds;
    //append new taskid in this column's tasks array
    columnTasks = [...columnTasks, action.payload.taskId];
    return map(
      when(propEq('columnId', action.columnId), assoc('taskIds', columnTasks)),
      state
    );
  }
  if (action.type === REORDER_COLUMN_TASKS) {
    return action.payload;
  }
  return state;
}
