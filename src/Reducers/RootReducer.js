import { Tasks } from './Tasks';
import { Columns } from './Columns';
import { ColumnOrder } from './ColumnOrder';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  Tasks,
  ColumnOrder,
  Columns
})
export default rootReducer;