import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './App.css';
import TaskContainer from './Components/TaskContainer/TasksContainer';
import { Modal, Input, Button } from 'antd';
import NavigationBar from './Components/NavigationBar/NavigationBar';
import { connect } from 'react-redux';
import { addColumn, reorderColumn, reorderColumnTasks } from './Actions';
import { rearrangeColumns, rearrangeTasks, moveTask } from './Utils/utils';
import * as R from 'ramda';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

class App extends Component {
  state = {
    visible: false,
    newContainerName: '',
  }
  handleOk = (e) => {
    if(this.state.newContainerName===''){
      alert("Please enter name of the Container.");
      return;
    }
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
      newContainerName: '',
      visible: false,
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
    if (!destination) {
      return;
    }
    //In case whole container is moved
    if (source.droppableId === "TasksContainersWrapper" && destination.droppableId === "TasksContainersWrapper") {
      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return;
      }
      //replace ColumnOrder with newColumnOrder
      this.props.reorderColumn(rearrangeColumns(this.props.ColumnOrder, source, destination, draggableId));
    }
    //In case items inside the containers are moved
    if (R.includes('tasklist', source.droppableId) || R.includes('tasklist', destination.droppableId)) {
      //incase drop is in same container and at same place
      if (source.droppableId === destination.droppableId && source.index === destination.index) {
        return;
      }
      //if drop is in same container but different location
      //HERE WE GOOOO..!
      else if (source.droppableId === destination.droppableId) {
        //action to update data in store
        this.props.reorderColumnTasks(rearrangeTasks(this.props.Columns, source, destination, draggableId));
      }
      //source and dest containers of tasks are different
      else if (source.droppableId !== destination.droppableId) {
        // Update store with new Columns
        this.props.reorderColumnTasks(moveTask(this.props.Columns, source, destination, draggableId));
      }
    }
  }
  render() {
    return (
      <div>
        <NavigationBar />
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
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    Tasks: state.Tasks,
    ColumnOrder: state.ColumnOrder,
    Columns: state.Columns
  };
}
export default connect(mapStateToProps, { addColumn, reorderColumn, reorderColumnTasks })(App);
