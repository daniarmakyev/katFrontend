import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  isAnyModalOpen: boolean;
}

const initialState: UIState = {
  isAnyModalOpen: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setModalOpen: (state, action) => {
      state.isAnyModalOpen = action.payload;
    }
  }
});

export const { setModalOpen } = uiSlice.actions;
export default uiSlice.reducer;