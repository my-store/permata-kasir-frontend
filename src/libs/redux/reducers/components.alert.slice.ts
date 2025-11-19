import type { ActionInterface } from '../store';
import { createSlice } from '@reduxjs/toolkit';

interface DefaultAlertInterface {
  opened: boolean;
  type: string;
  title: string;
  body: string;
}

const DefaultAlertState: DefaultAlertInterface = {
  opened: false,
  type: '',
  title: '',
  body: '',
};

function OpenAlertHandler(
  state: DefaultAlertInterface,
  actions: ActionInterface,
) {
  state.opened = true;
  state.type = actions.payload.type;
  state.title = actions.payload.title;
  state.body = actions.payload.body;
}

function RemoveAlertHandler(state: DefaultAlertInterface) {
  state.opened = false;
  state.type = '';
  state.title = '';
  state.body = '';
}

const AlertSlice = createSlice({
  name: 'component.alert',
  initialState: DefaultAlertState,
  reducers: {
    openAlert: OpenAlertHandler,
    removeAlert: RemoveAlertHandler,
  },
});

export const { openAlert, removeAlert } = AlertSlice.actions;
export default AlertSlice.reducer;
