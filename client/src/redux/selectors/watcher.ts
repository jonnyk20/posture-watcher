import { RootState } from "../store";

export const selectScore = (state: RootState): number => state.watcher.score;

export const selectBaseAngle = (state: RootState): number =>
  state.watcher.baseAngle;

export const selectOffsetThreshold = (state: RootState): number =>
  state.watcher.offsetThreshold;
