import React, {
  createContext,
  useContext,
  ReactElement,
  useState,
  useEffect,
  useRef,
} from "react";
import * as posedetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";

import { drawKeypoints, drawSkeleton, formatKeypoint, wait } from "./utils";
import { DimensionsType } from "./constants/params";

type WatcherContextType = {
  videoRef: React.RefObject<HTMLVideoElement>;
  outputRef: React.RefObject<HTMLCanvasElement>;
  canvasContainerRef: React.RefObject<HTMLDivElement>;
  setupWatcher: (stream: MediaStream) => void;
};

export const defaultContextValue: WatcherContextType = {
  videoRef: React.createRef<HTMLVideoElement>(),
  outputRef: React.createRef<HTMLCanvasElement>(),
  canvasContainerRef: React.createRef<HTMLDivElement>(),
  setupWatcher: () => {},
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

  const [detector, setDetector] = useState<posedetection.PoseDetector | null>(
    null
  );

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
    canvasContainer.style.width = `${videoWidth}px`;
    canvasContainer.style.height = `${videoWidth}px`;

    setVideoDimensions({
      width: videoWidth,
      height: videoHeight,
    });

    // Because the image from camera is mirrored, need to flip horizontally.
    // canvasContext.translate(video.videoWidth, 0);
    // canvasContext.scale(-1, 1);

    const detector = await posedetection.createDetector(
      posedetection.SupportedModels.MoveNet,
      {
        modelType: posedetection.movenet.modelType.SINGLEPOSE_THUNDER,
      }
    );

    setDetector(detector);
  };

  useEffect(() => {
    const renderResult = async () => {
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

      await wait(500);

      const { width, height } = videoDimensions;

      canvasContext.drawImage(video, 0, 0, width, height);

      // The null check makes sure the UI is not in the middle of changing to a
      // different model. If during model change, the result is from an old model,
      // which shouldn't be rendered.
      if (poses && poses.length > 0) {
        const pose = poses[0];
        const scale = width / video.videoWidth;

        if (pose.keypoints != null) {
          drawKeypoints(
            pose.keypoints.map(formatKeypoint),
            0.1,
            canvasContext,
            scale
          );
          drawSkeleton(
            pose.keypoints.map(formatKeypoint),
            pose.id || 0,
            canvasContext,
            scale
          );
        }
      }
    };

    if (detector) {
      const renderPrediction = async () => {
        await renderResult();
        requestAnimationFrame(renderPrediction);
      };

      renderPrediction();
    } else {
    }
  }, [detector]);

  const contextValue: WatcherContextType = {
    videoRef,
    outputRef,
    canvasContainerRef,
    setupWatcher,
  };

  return (
    <WatcherContext.Provider value={contextValue}>
      {children}
    </WatcherContext.Provider>
  );
};

export const useWatcherContext = (): WatcherContextType =>
  useContext(WatcherContext);
