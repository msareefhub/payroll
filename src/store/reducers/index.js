// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import common from './common';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, common });

export default reducers;
