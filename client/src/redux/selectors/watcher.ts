import { RootState } from "../store";

export const selectScore = (state: RootState): number => state.watcher.score;

export const selectBaseAngle = (state: RootState): number =>
  state.watcher.baseAngle;

export const selectSafeRange = (state: RootState): number =>
  state.watcher.safeRange;

export const selectLastReportedAngle = (state: RootState): number =>
  state.watcher.lastReportedAngle;

export const selectIsFailingCheck = (state: RootState): boolean =>
  state.watcher.isFailingCheck;
