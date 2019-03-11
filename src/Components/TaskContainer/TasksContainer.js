import React, { Component } from 'react';
import './TasksContainer.css';
import data from '../../data';
import Task from '../Task/Task';
import { Modal, Button, Input } from 'antd';
import { connect } from 'react-redux';
import * as R from 'ramda';
import { addTask } from '../../Actions';
import { Draggable, Droppable } from 'react-beautiful-dnd';

class TaskContainer extends Component {
  state = {
    addTaskModalVisible: false,
    newTaskName: '',
    newTaskDesc: '',
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      addTaskModalVisible: false,
      newTaskName: '',
      newTaskDesc: '',
    });
  }
  handleAddTaskModal = () => {
    this.setState({
      addTaskModalVisible: true
    })
  }
  handleInputChange = (e) => {
    if (e.target.name === "title") {
      this.setState({
        newTaskName: e.target.value
      })
    }
    else if (e.target.name === "desc") {
      this.setState({
        newTaskDesc: e.target.value
      })
    }

  }

  handleAddTask = (columnId) => {
    console.log('add task', columnId);
    console.log('add task state', this.state);

    // Find largest task id to assign new id with +1, add to Tasks, add task to its column
    console.log('Task Container largest tast', this.props.Tasks)
    let taskIdsArray = []; //initializing as empty
    let addToArray = (task) => taskIdsArray.push(task.taskId);
    R.map(addToArray, this.props.Tasks);
    console.log('tasskIdsArrayyy==================',taskIdsArray);
    const largest = R.reduce(R.max, -Infinity, taskIdsArray) + 1;
    this.props.addTask(
      R.equals(largest, -Infinity)
        ? 1
        : largest,
      this.state.newTaskName, this.state.newTaskDesc, columnId);
    this.setState({
      addTaskModalVisible: false,
      newTaskName: '',
      newTaskDesc: ''
    });
  }
  tasks = (taskData) => {
    console.log(taskData);
    return (
      <Task key={taskData.id} title={taskData.title} content={taskData.content} />
    );
  }
  render() {
    return (
      <div className="tasks-container-with-modal">
      <Draggable key={`column-${this.props.columnId}`} draggableId={`column-${this.props.columnId}`} index= {this.props.index}>
      {(provided)=>(
      <div className="tasks-container" {...provided.draggableProps}  ref={provided.innerRef}>
        <h3 {...provided.dragHandleProps}>{this.props.title}</h3>
        <Droppable droppableId={`tasklist-${this.props.columnId}`} type="items">
        {provided=> (
        <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
          {
            this.props.taskIds.map((taskId, index) => {
              //get data of current task from tasks object
              const taskData = R.find(R.propEq('taskId', taskId))(this.props.Tasks);
              return (
                <Task key={taskData.taskId} taskId = {taskData.taskId} taskTitle={taskData.taskTitle} taskContent={taskData.taskContent} index={index} />
              );
            }
            )
          }
          {provided.placeholder}
          <button className="add-task-btn" onClick={this.handleAddTaskModal}><i className="fa fa-plus-square-o" aria-hidden="true"></i></button>
        </div>
        )}
        </Droppable>
        </div>
      )}
        </Draggable>
        {/*=================== MODAL Codel =============== */}
        <div>
          <Modal
            title="Task Container"
            visible={this.state.addTaskModalVisible}
            onCancel={this.handleCancel}
            footer={[
              <Button key="Cancel" onClick={this.handleCancel}>Cancel</Button>,
              <Button key="Create" type="primary" onClick={() => { this.handleAddTask(this.props.columnId) }}>
                Create
            </Button>,
            ]}
          >
            <p>Task Title</p>
            <Input onChange={this.handleInputChange} name="title" value={this.state.newTaskName} />
            <p>Task Desc </p>
            <Input onChange={this.handleInputChange} name="desc" value={this.state.newTaskDesc} />
          </Modal>
        </div>
      </div>
    );
    // return (
    //   <div className="tasks-container">
    //     <h3>{this.props.title}</h3>
    //     {/* 
    //       this.props.id is column id
    //     */}
    //     <Droppable droppableId={this.props.id}>
    //       {provided =>(
    //       <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
    //         {
    //           this.props.tasks.map((taskid, index) => {
    //             //get data of current task from tasks object
    //             const taskData = data.tasks[taskid];
    //             return (
    //               <Task key={taskData.id} id = {taskData.id} title={taskData.title} content={taskData.content} index={index} />
    //             );
    //           }
    //           )
    //         }
    //         {provided.placeholder}
    //       </div>
    //       )
    //       }
    //     </Droppable>
    //   </div>
    // );
  }
}
function mapStateToProps(state) {
  console.log('Tasks Container map state to props', state);
  return {
    Tasks: state.Tasks,
    ColumnOrder: state.ColumnOrder,
    Columns: state.Columns
  }
}
export default connect(mapStateToProps, { addTask })(TaskContainer);