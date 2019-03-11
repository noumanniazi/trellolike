const data = {
  tasks: {
    'task-1': {id: 'task-1', title:'task 1 title', content: 'msg1'},
    'task-2': {id: 'task-2', title:'task 2 title',content: 'msg2'},
    'task-3': {id: 'task-3', title:'task 3 title',content: 'msg3'},
    'task-4': {id: 'task-4', title:'task 4 title',content: 'msg4'},
    'task-5': {id: 'task-5', title:'task 5 title',content: 'msg5'},
    'task-6': {id: 'task-6', title:'task 6 title',content: 'msg6'},
  },
  columns: {
    'column-1':{
      id: 'column-1',
      title: 'column 1 Title',
      tasksIds: ['task-1', 'task-2','task-3','task-4']
    },
    'column-2':{
      id: 'column-2',
      title: 'column 2 Title',
      tasksIds: ['task-5','task-6']
    },

  },
  columnOrder: ['column-1', 'column-2']
}

export default data;