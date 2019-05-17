import * as R from 'ramda';

export const rearrangeColumns = (columnOrder, source, destination, draggableId) => {
  const newColumnOrder = Array.from(columnOrder);
  const columnId = parseInt(draggableId.substring(7, draggableId.length));

  newColumnOrder.splice(source.index, 1);
  newColumnOrder.splice(destination.index, 0, columnId);
  return newColumnOrder;
}
export const rearrangeTasks = (columns, source, destination, draggableId) => {
  const columnId = parseInt(source.droppableId.substring(9, source.droppableId.length));
  const taskId = parseInt(draggableId.substring(5, draggableId.length));
  //reorder tasks in given columnId
  // const temp = value => value.taskIds.splice(source.index, 1);
  // const temp1 = val => val.splice(destination.index, 0, taskId);
  // const arr = R.pipe(R.find(R.propEq('columnId', columnId)),
  //   value => temp(value),
  //   val => temp1(val))
  // //   // value => value.taskIds.splice(source.index, 1),
  // //   // value => value.splice(destination.index, 0, taskId))
  //   (columns);
  // console.log('========================================');
  // console.log('array',arr);
  const taskIdsArray = R.find(R.propEq('columnId', columnId))(columns).taskIds;
  console.log('========================================');
  console.log('taskIdsArray: ', taskIdsArray);
  taskIdsArray.splice(source.index, 1);
  console.log('taskIdsArray splice 1: ', taskIdsArray);
  taskIdsArray.splice(destination.index, 0, taskId);
  console.log('taskIdsArray splice 2: ', taskIdsArray);
  const newColumnArray = R.map(
    R.when(R.propEq('columnId', columnId), R.assoc('taskIds', taskIdsArray)),
    columns
  );
  console.log('newColumnArray: ', newColumnArray);
  console.log('======================================');
  return newColumnArray;
}
export const moveTask = (columns, source, destination, draggableId) => {
  const sourceColumn = parseInt(source.droppableId.substring(9, source.droppableId.length));
  const destinationColumn = parseInt(destination.droppableId.substring(9, destination.droppableId.length));
  const taskId = parseInt(draggableId.substring(5, draggableId.length));
  //Remove the task from one column and add it to another
  // Removing
  const sourceColumnTaskIdsArray = R.find(R.propEq('columnId', sourceColumn))(columns).taskIds;
  sourceColumnTaskIdsArray.splice(source.index, 1);
  const temp = R.map(
    R.when(R.propEq('columnId', sourceColumn), R.assoc('taskIds', sourceColumnTaskIdsArray)),
    columns
  )
  // Adding
  const destinationColumnTaskIdsArray = R.find(R.propEq('columnId', destinationColumn))(columns).taskIds;
  destinationColumnTaskIdsArray.splice(destination.index, 0, taskId);
  const newColumnArray = R.map(
    R.when(R.propEq('columnId', destinationColumn), R.assoc('taskIds', destinationColumnTaskIdsArray)),
    temp
  )
  return newColumnArray;
}