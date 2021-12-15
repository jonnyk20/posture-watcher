import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_BASE_ANGLE, DEFAULT_SAFE_RANGE } from "../constants/params";

export interface UiState {
  score: number;
  safeRange: number;
  baseAngle: number;
  isFailingCheck: boolean;
  lastReportedAngle: number;
}

const MAX_SCORE = 100;
const SCORE_LOSS_RATE = 5;

const initialState: UiState = {
  score: MAX_SCORE,
  safeRange: DEFAULT_SAFE_RANGE,
  baseAngle: DEFAULT_BASE_ANGLE,
  isFailingCheck: false,
  lastReportedAngle: DEFAULT_BASE_ANGLE,
};

export const watcherSlice = createSlice({
  initialState,
  name: "watcher",
  reducers: {
    checkPosture: (state, action: PayloadAction<number>) => {
      const angle = action.payload;

      state.lastReportedAngle = angle;

      const offset = Math.abs(angle - state.baseAngle);

      const scoreChange =
        offset > state.safeRange / 2 ? -SCORE_LOSS_RATE : SCORE_LOSS_RATE;

      const updatedScore = Math.max(
        0,
        Math.min(MAX_SCORE, state.score + scoreChange)
      );
      state.isFailingCheck = updatedScore < state.score;
      state.score = updatedScore;
    },
    setBaseAngle: (state, action: PayloadAction<number>) => {
      state.baseAngle = action.payload;
    },
    setOffsetThreshold: (state, action: PayloadAction<number>) => {
      state.safeRange = action.payload;
    },
  },
});

export const { checkPosture, setBaseAngle, setOffsetThreshold } =
  watcherSlice.actions;

export default watcherSlice.reducer;
