import type { ActionInterface } from '../store';
import { createSlice } from '@reduxjs/toolkit';

interface DefaulState {
  isReady: boolean;
  isLoading: boolean;
}

const DefaultRootState: DefaulState = {
  isReady: false,
  isLoading: true,
};

function OpenLoading(state: DefaulState) {
  state.isLoading = true;
}

function RemoveLoading(state: DefaulState) {
  state.isLoading = false;
}

function SetReady(state: DefaulState, action: ActionInterface) {
  state.isReady = action.payload;
}

const RootSlice = createSlice({
  name: 'root',
  initialState: DefaultRootState,
  reducers: {
    rootOpenLoading: OpenLoading,
    rootRemoveLoading: RemoveLoading,
    rootSetReady: SetReady,
  },
});

export const { rootOpenLoading, rootRemoveLoading, rootSetReady } =
  RootSlice.actions;
export default RootSlice.reducer;
