import { createSlice } from '@reduxjs/toolkit';

interface DefaultSocketStateInterface {
  connected: boolean;
}

const DefaultSocketState: DefaultSocketStateInterface = {
  connected: true,
};

function ReconnectHandler(state: DefaultSocketStateInterface) {
  state.connected = true;
}

function DisconnectedHandler(state: DefaultSocketStateInterface) {
  state.connected = false;
}

const SocketSlice = createSlice({
  name: 'persediaan',
  initialState: DefaultSocketState,
  reducers: {
    reconnect: ReconnectHandler,
    disconnected: DisconnectedHandler,
  },
});

export const { reconnect, disconnected } = SocketSlice.actions;
export default SocketSlice.reducer;
