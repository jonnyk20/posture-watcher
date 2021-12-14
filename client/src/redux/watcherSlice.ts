import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  score: number;
  offsetThreshold: number;
  baseAngle: number;
}

const MAX_SCORE = 100;
const SCORE_LOSS_RATE = 5;

const initialState: UiState = {
  score: MAX_SCORE,
  offsetThreshold: 10,
  baseAngle: 90,
};

export const watcherSlice = createSlice({
  initialState,
  name: "watcher",
  reducers: {
    checkPosture: (state, action: PayloadAction<number>) => {
      const scoreChange =
        action.payload > state.offsetThreshold
          ? -SCORE_LOSS_RATE
          : SCORE_LOSS_RATE;

      state.score = Math.max(0, Math.min(MAX_SCORE, state.score + scoreChange));
    },
  },
});

export const { checkPosture } = watcherSlice.actions;

export default watcherSlice.reducer;
