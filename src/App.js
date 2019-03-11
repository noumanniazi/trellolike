import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './App.css';
import TaskContainer from './Components/TaskContainer/TasksContainer';
import { Modal, Input, Button } from 'antd';
import { connect } from 'react-redux';
import { addColumn, reorderColumn, reorderColumnTasks } from './Actions';
import * as R from 'ramda';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';


class App extends Component {
  state = {
    visible: false,
    newContainerName: '',
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
    //Fire an action to add new column/ Task Container
    /*
    Tasks: state.Tasks,
    ColumnOrder: state.ColumnOrder,
    Columns: state.Columns
    */
    //find if column is not empty or doesnt exist before

    const largest = R.reduce(R.max, -Infinity, this.props.ColumnOrder) + 1;
    this.props.addColumn(
      R.equals(largest, -Infinity)
        ? 1
        : largest,
      this.state.newContainerName);
    this.setState({
      newContainerName: ''
    });

  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
      newContainerName: '',
    });
  }
  handleAddTaskContainer = () => {
    this.setState({
      visible: true
    })
  }
  handleInputChange = (e) => {
    this.setState({
      newContainerName: e.target.value
    })
  }

  /////////////////////////////////////
  onDragEnd = result => {
    const { destination, source, draggableId } = result;
    console.log('source', source);
    console.log('dest', destination);
    console.log('draggableid', draggableId);
    //In case whole container is moved
    if (source.droppableId === "TasksContainersWrapper" && destination.droppableId === "TasksContainersWrapper") {
      console.log('fired container moved');
      if (!destination) {
        return;
      }
      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return;
      }
      const newColumnOrder = Array.from(this.props.ColumnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, parseInt(draggableId.substring(7, draggableId.length)));
      //replace ColumnOrder with newColumnOrder
      this.props.reorderColumn(newColumnOrder);
    }
    //In case items inside the containers are moved
    if (R.includes('tasklist', source.droppableId) || R.includes('tasklist', destination.droppableId)) {
      if (!destination) {
        return;
      }
      //incase drop is in same container and at same place
      if (source.droppableId === destination.droppableId && source.index === destination.index) {
        return;
      }
      //if drop is in same container but different location
      //HERE WE GOOOO..!
      else if (source.droppableId === destination.droppableId) {
        const columnId = parseInt(source.droppableId.substring(9, source.droppableId.length));
        const taskId = parseInt(draggableId.substring(5, draggableId.length));
        //reorder tasks in given columnId
        const taskIdsArray = R.find(R.propEq('columnId', columnId))(this.props.Columns).taskIds;
        taskIdsArray.splice(source.index, 1);
        taskIdsArray.splice(destination.index, 0, taskId);
        const newColumnArray = R.map(
          R.when(R.propEq('columnId', columnId), R.assoc('taskIds', taskIdsArray)),
          this.props.Columns
        );
        //action to update data in store
        this.props.reorderColumnTasks(newColumnArray);
      }
      //source and dest containers of tasks are different
      else if(source.droppableId !== destination.droppableId){
        console.log('between columns drag fired====================')
        const sourceColumn = parseInt(source.droppableId.substring(9, source.droppableId.length));
        const destinationColumn = parseInt(destination.droppableId.substring(9, destination.droppableId.length));
        const taskId = parseInt(draggableId.substring(5, draggableId.length));
        //Remove the task from one column and add it to another
        // Removing
        const sourceColumnTaskIdsArray = R.find(R.propEq('columnId', sourceColumn))(this.props.Columns).taskIds;
        sourceColumnTaskIdsArray.splice(source.index, 1);
        const temp = R.map(
          R.when(R.propEq('columnId', sourceColumn), R.assoc('taskIds', sourceColumnTaskIdsArray)),
          this.props.Columns
        )
        // Adding
        const destinationColumnTaskIdsArray = R.find(R.propEq('columnId', destinationColumn))(this.props.Columns).taskIds;
        destinationColumnTaskIdsArray.splice(destination.index, 0, taskId);
        const newColumnArray = R.map(
          R.when(R.propEq('columnId', destinationColumn), R.assoc('taskIds', destinationColumnTaskIdsArray)),
          temp
        )
        // Update store with new Columns
        console.log('new Column Array:====================', newColumnArray);
        this.props.reorderColumnTasks(newColumnArray);
      }
    }
  }
  ////////////////////////////////////

  render() {
    return (
      <div className="parent-container">
        <button className="add-container-btn" onClick={this.handleAddTaskContainer}><i className="fa fa-plus-square-o" aria-hidden="true"></i></button>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable direction="horizontal" droppableId={'TasksContainersWrapper'} Type={'container'}>
            {/* making Task Container Wrapper droppable so we can we TaskContainers around */}
            {provided => (
              <div className="task-containers-wrapper" ref={provided.innerRef} {...provided.droppableProps}>
                {this.props.ColumnOrder.map((columnIds, index) => {
                  const column = R.find(R.propEq('columnId', columnIds))(this.props.Columns);
                  return (<TaskContainer key={column.columnId} columnId={column.columnId} title={column.columnTitle} taskIds={column.taskIds} createTask={this.createTask} index={index} />);
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

        </DragDropContext>


        {/*==================== MODAL Code ===========================*/}
        <div>
          <Modal
            title="Task Container"
            visible={this.state.visible}
            onCancel={this.handleCancel}
            footer={[
              <Button key="Cancel" onClick={this.handleCancel}>Cancel</Button>,
              <Button key="Create" type="primary" onClick={this.handleOk}>
                Create
            </Button>,
            ]}
          >
            <p>Task Container Name</p>
            <Input onChange={this.handleInputChange} value={this.state.newContainerName} />
          </Modal>
        </div>
      </div>
    );
  }
}
//   render() {
//     return (
//       <DragDropContext onDragEnd={this.onDragEnd}>
//         <div className="wrapper">
//           {data.columnOrder.map(colId => {
//             //individual column data is here
//             const column = data.columns[colId];
//             return (
//               <TaskContainer key={column.id} id={column.id} title={column.title} tasks={column.tasksIds}/>
//             );
//           })}
//         </div>
//       </DragDropContext>
//     );
//   }
// }
function mapStateToProps(state) {

  console.log('app map state to props', state);
  return {
    Tasks: state.Tasks,
    ColumnOrder: state.ColumnOrder,
    Columns: state.Columns
  };
}
export default connect(mapStateToProps, { addColumn, reorderColumn, reorderColumnTasks })(App);
