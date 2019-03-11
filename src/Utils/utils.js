import * as R from 'ramda';
export const rearrangeColumns = (columnOrder, source, destination, draggableId) => {
  const newColumnOrder = Array.from(columnOrder);
  const taskId = parseInt(draggableId.substring(7, draggableId.length));
  newColumnOrder.splice(source.index, 1);
  newColumnOrder.splice(destination.index, 0, taskId);
  return newColumnOrder;
}
export const rearrangeTasks = (columns,source, destination, draggableId) => {
  const columnId = parseInt(source.droppableId.substring(9, source.droppableId.length));
  const taskId = parseInt(draggableId.substring(5, draggableId.length));
  //reorder tasks in given columnId
  const taskIdsArray = R.find(R.propEq('columnId', columnId))(columns).taskIds;
  taskIdsArray.splice(source.index, 1);
  taskIdsArray.splice(destination.index, 0, taskId);
  const newColumnArray = R.map(
    R.when(R.propEq('columnId', columnId), R.assoc('taskIds', taskIdsArray)),
    this.props.Columns
  );
  return newColumnArray;
}
export const moveTask = (columns, source, destination,draggableId) => {
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