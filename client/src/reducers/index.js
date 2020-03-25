import currentPage from './currentPage';
import {combineReducers} from 'redux';

const allReducers = combineReducers({
    currentPage: currentPage
})

export default allReducers;

