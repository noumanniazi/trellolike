import React, { Component } from 'react';
import './Task.css';
import { Draggable } from 'react-beautiful-dnd';

class Task extends Component {
  state = {}
  render() {
    return (
      <Draggable draggableId={`task-${this.props.taskId}`} index={this.props.index}>
        {(provided) => (
          <div className="task" {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
            <h4>{this.props.taskTitle}</h4>
            <p>{this.props.taskContent}</p>
          </div>
        )}
      </Draggable>
    );
  }
}

export default Task;