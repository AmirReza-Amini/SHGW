// import external modules
import { combineReducers } from "redux";
// import internal(own) modules
import todoReducer from "./todo/";
import customizer from "./customizer/";
import voyageReducer from './common/voyage/voyageReducer';
import equipmentReducer from './common/equipment/equipmentReducer';
import operatorReducer from './common/operator/operatorReducer';
import { reducer as toastrReducer } from "react-redux-toastr";

const rootReducer = combineReducers({

   todoApp: todoReducer,
   toastr: toastrReducer, 
   customizer: customizer,
   voyage:voyageReducer,
   equipment:equipmentReducer,
   operator:operatorReducer
});

export default rootReducer;