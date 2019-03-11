import React, { Component } from 'react';
import Task from '../Task/Task';
import * as R from 'ramda';
import { Droppable } from 'react-beautiful-dnd';

class TaskList extends Component {
  state = {}
  render() {
    return (
      <Droppable droppableId={'tasklist'}>
        {provided => (
          <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
            {
              this.props.taskIds.map((taskId, index) => {
                //get data of current task from tasks object
                const taskData = R.find(R.propEq('taskId', taskId))(this.props.Tasks);
                return (
                  <Task key={taskData.taskId} taskId={taskData.taskId} taskTitle={taskData.taskTitle} taskContent={taskData.taskContent} index={index} />
                );
              }
              )

            }
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }
}
export default TaskList;