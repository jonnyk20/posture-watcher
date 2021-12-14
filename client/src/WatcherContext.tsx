import React, {
  createContext,
  useContext,
  ReactElement,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import * as posedetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";

import {
  drawKeypoints,
  drawWatcherSegment,
  formatKeypoint,
  getAngle,
  getWatcherKeypoints,
  isRightFacingPose,
} from "./utils";
import { DimensionsType } from "./constants/params";
import { useAppDispatch, useAppSelector } from "./hooks";
import { checkPosture } from "./redux/watcherSlice";
import {
  selectBaseAngle,
  selectOffsetThreshold,
} from "./redux/selectors/watcher";

type WatcherContextType = {
  videoRef: React.RefObject<HTMLVideoElement>;
  outputRef: React.RefObject<HTMLCanvasElement>;
  canvasContainerRef: React.RefObject<HTMLDivElement>;
  setupWatcher: (stream: MediaStream) => void;
  startDetection: () => void;
  stopDetection: () => void;
  isLoadingDetector: boolean;
};

export const defaultContextValue: WatcherContextType = {
  videoRef: React.createRef<HTMLVideoElement>(),
  outputRef: React.createRef<HTMLCanvasElement>(),
  canvasContainerRef: React.createRef<HTMLDivElement>(),
  setupWatcher: () => {},
  startDetection: () => {},
  stopDetection: () => {},
  isLoadingDetector: false,
};

export const WatcherContext = createContext(defaultContextValue);

WatcherContext.displayName = "Workflows.WatcherContext";

export const WatcherProvider: React.FC = ({ children }): ReactElement => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const outputRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [videoDimensions, setVideoDimensions] = useState<DimensionsType>({
    width: 0,
    height: 0,
  });
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(0);
  const [lastRenderTime, setLastRenderTime] = useState(0);

  const [detector, setDetector] = useState<posedetection.PoseDetector | null>(
    null
  );
  const [isLoadingDetector, setIsLoadingDetector] = useState(false);
  const baseAngle = useAppSelector(selectBaseAngle);
  const offsetThreshold = useAppSelector(selectOffsetThreshold);
  const dispatch = useAppDispatch();

  const renderResult = useCallback(async () => {
    const video = videoRef.current;
    const canvas = outputRef.current;
    const canvasContext = canvas?.getContext("2d");

    if (!video || !canvas || !detector || !canvasContext) {
      return;
    }

    if (video.readyState < 2) {
      await new Promise((resolve) => {
        video.onloadeddata = () => {
          resolve(video);
        };
      });
    }

    let poses = null;

    // Detector can be null if initialization failed (for example when loading
    // from a URL that does not exist).
    if (detector != null) {
      // Detectors can throw errors, for example when using custom URLs that
      // contain a model that doesn't provide the expected output.
      try {
        poses = await detector.estimatePoses(video, {
          maxPoses: 1,
          flipHorizontal: false,
        });
      } catch (error) {
        detector.dispose();
        setDetector(null);
        alert(error);
      }
    }

    const { width, height } = videoDimensions;

    canvasContext.drawImage(video, 0, 0, width, height);

    // The null check makes sure the UI is not in the middle of changing to a
    // different model. If during model change, the result is from an old model,
    // which shouldn't be rendered.
    if (poses && poses.length > 0) {
      const pose = poses[0];
      const scale = width / video.videoWidth;
      const formattedKeypoints = pose.keypoints.map(formatKeypoint);

      if (pose.keypoints != null) {
        const isRightFacing = isRightFacingPose(formattedKeypoints);
        const watcherKeypoints = getWatcherKeypoints(
          formattedKeypoints,
          isRightFacing
        );
        // drawSkeleton(formattedKeypoints, pose.id || 0, canvasContext, scale);
        const angle = getAngle(watcherKeypoints[1], watcherKeypoints[0]);

        const offset = Math.abs(angle - baseAngle);
        const color = offset > offsetThreshold ? "red" : "green";

        dispatch(checkPosture(offset));

        drawKeypoints(watcherKeypoints, 0.13, canvasContext, scale);

        drawWatcherSegment(watcherKeypoints, canvasContext, color);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detector, offsetThreshold, baseAngle]);

  const CHECK_INTERVAL_TIME = 1000;

  useEffect(() => {
    const currentTime = Date.now();
    const hasElapsedIntervalTime =
      currentTime - lastRenderTime > CHECK_INTERVAL_TIME;

    if (hasElapsedIntervalTime && detector && !isChecking) {
      setIsChecking(true);

      const renderResultAsync = async () => {
        await renderResult();
        setIsChecking(false);
        setLastRenderTime(Date.now());
      };

      renderResultAsync();
    } else {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detector, isChecking, lastCheckTime, renderResult]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastCheckTime(Date.now());
    }, CHECK_INTERVAL_TIME);

    return () => clearInterval(interval);
  }, []);

  const startDetection = async () => {
    setIsLoadingDetector(true);
    const detector = await posedetection.createDetector(
      posedetection.SupportedModels.MoveNet,
      {
        modelType: posedetection.movenet.modelType.SINGLEPOSE_THUNDER,
      }
    );
    setIsLoadingDetector(false);
    setDetector(detector);
  };

  const stopDetection = () => {
    detector?.dispose();
    setDetector(null);
  };

  const setupWatcher = async (stream: MediaStream) => {
    const video = videoRef.current;
    const canvas = outputRef.current;
    const canvasContainer = canvasContainerRef.current;
    const canvasContext = canvas?.getContext("2d");

    if (!video || !canvas || !canvasContainer || !canvasContext) {
      return;
    }
    video.srcObject = stream;
    await new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });

    video.play();

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Must set below two lines, otherwise video element doesn't show.
    video.width = videoWidth;
    video.height = videoHeight;

    canvas.width = videoWidth;
    canvas.height = videoHeight;
    // canvasContainer.style.width = `${videoWidth}px`;
    // canvasContainer.style.height = `${videoHeight}px`;

    setVideoDimensions({
      width: videoWidth,
      height: videoHeight,
    });

    startDetection();
  };

  const contextValue: WatcherContextType = {
    videoRef,
    outputRef,
    canvasContainerRef,
    setupWatcher,
    startDetection,
    stopDetection,
    isLoadingDetector,
  };

  return (
    <WatcherContext.Provider value={contextValue}>
      {children}
    </WatcherContext.Provider>
  );
};

export const useWatcherContext = (): WatcherContextType =>
  useContext(WatcherContext);
