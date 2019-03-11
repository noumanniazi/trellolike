export const ADD_TASK = 'add_task';
export const ADD_COLUMN = 'add_column';
export const REORDER_COLUMN = 'reorder_column';
export const REORDER_COLUMN_TASKS = 'reorder_column_tasks';

export const addTask = (taskId, taskTitle, taskContent, columnId) => {
    return{
      type: ADD_TASK,
      payload: {
        taskId: taskId,
        taskTitle: taskTitle,
        taskContent: taskContent,
      },
      columnId: columnId
    }
}

export const addColumn = (columnId, columnTitle) => {
  return{
    type: ADD_COLUMN,
    payload: {
      columnId: columnId,
      columnTitle: columnTitle,
      taskIds:[]
    }
  }
}
export const reorderColumn = (columnOrder) => {
  return{
    type: REORDER_COLUMN,
    payload: columnOrder
  }
}
export const reorderColumnTasks = (columns) => {
  return{
    type: REORDER_COLUMN_TASKS,
    payload: columns
  }
}