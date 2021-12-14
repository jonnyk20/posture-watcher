/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import * as posedetection from "@tensorflow-models/pose-detection";

const color = "aqua";
const lineWidth = 2;

export const tryResNetButtonName = "tryResNetButton";
export const tryResNetButtonText = "[New] Try ResNet50";

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isMobile() {
  return isAndroid() || isiOS();
}

export type CoordinatesTypes = {
  x: number;
  y: number;
};

export type FormattedKeypoint = posedetection.Keypoint & {
  position: CoordinatesTypes;
  score: number;
};

export const formatKeypoint = (
  kp: posedetection.Keypoint
): FormattedKeypoint => ({
  ...kp,
  position: {
    x: kp.x,
    y: kp.y,
  },
  score: kp.score || 0,
});

function toTuple({ y, x }: CoordinatesTypes): [number, number] {
  return [y, x];
}

export function drawPoint(
  ctx: CanvasRenderingContext2D,
  y: number,
  x: number,
  r: number,
  color: string
) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

/**
 * Draws a line on a canvas, i.e. a joint
 */
export function drawSegment(
  [ay, ax]: [number, number],
  [by, bx]: [number, number],
  color: string,
  scale: number,
  ctx: CanvasRenderingContext2D
) {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function eitherPointDoesntMeetConfidence(
  a: number,
  b: number,
  minConfidence: number
) {
  return a < minConfidence || b < minConfidence;
}

const connectedPartNames: Array<[string, string]> = [
  ["leftHip", "leftShoulder"],
  ["leftElbow", "leftShoulder"],
  ["leftElbow", "leftWrist"],
  ["leftHip", "leftKnee"],
  ["leftKnee", "leftAnkle"],
  ["rightHip", "rightShoulder"],
  ["rightElbow", "rightShoulder"],
  ["rightElbow", "rightWrist"],
  ["rightHip", "rightKnee"],
  ["rightKnee", "rightAnkle"],
  ["leftShoulder", "rightShoulder"],
  ["leftHip", "rightHip"],
];
export const partNames: string[] = [
  "nose", // 0
  "leftEye",
  "rightEye",
  "leftEar",
  "rightEar",
  "leftShoulder", // 5
  "rightShoulder",
  "leftElbow",
  "rightElbow",
  "leftWrist",
  "rightWrist", // 10
  "leftHip",
  "rightHip",
  "leftKnee",
  "rightKnee",
  "leftAnkle", // 15
  "rightAnkle",
];

export const partIds = partNames.reduce((result, jointName, i) => {
  result[jointName] = i;
  return result;
}, {} as { [key: string]: number });

export const connectedPartIndices = connectedPartNames.map(
  ([jointNameA, jointNameB]) => [partIds[jointNameA], partIds[jointNameB]]
);

export function getAdjacentKeyPoints(
  keypoints: FormattedKeypoint[],
  minConfidence: number
) {
  return connectedPartIndices.reduce((result, [leftJoint, rightJoint]) => {
    if (
      eitherPointDoesntMeetConfidence(
        keypoints[leftJoint].score as number,
        keypoints[rightJoint].score as number,
        minConfidence
      )
    ) {
      return result;
    }

    result.push([keypoints[leftJoint], keypoints[rightJoint]]);

    return result;
  }, [] as Array<[FormattedKeypoint, FormattedKeypoint]>);
}

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
export function drawSkeleton(
  keypoints: FormattedKeypoint[],
  minConfidence: number,
  ctx: CanvasRenderingContext2D,
  scale = 1
) {
  const adjacentKeyPoints = getAdjacentKeyPoints(keypoints, minConfidence);

  adjacentKeyPoints.forEach((keypoints) => {
    drawSegment(
      toTuple(keypoints[0].position),
      toTuple(keypoints[1].position),
      color,
      scale,
      ctx
    );
  });
}

/**
 * Draws the main line used to track posture
 */
export function drawWatcherSegment(
  keypoints: [FormattedKeypoint, FormattedKeypoint],
  ctx: CanvasRenderingContext2D,
  color: string,
  scale = 1
) {
  drawSegment(
    toTuple(keypoints[0].position),
    toTuple(keypoints[1].position),
    color,
    scale,
    ctx
  );
}

const LEFT_SHOULDER_INDEX = 5;
const RIGHT_SHOULDER_INDEX = 6;
const LEFT_EAR_INDEX = 3;
const RIGHT_EAR_INDEX = 4;

/**
 * Get watcher keypoints (shoulder and ear) based on pose direction
 */
export const getWatcherKeypoints = (
  keypoints: FormattedKeypoint[],
  isRightFacingPose: boolean
): [FormattedKeypoint, FormattedKeypoint] => {
  const earIndex = isRightFacingPose ? RIGHT_EAR_INDEX : LEFT_EAR_INDEX;
  const shoulderIndex = isRightFacingPose
    ? RIGHT_SHOULDER_INDEX
    : LEFT_SHOULDER_INDEX;

  return [keypoints[earIndex], keypoints[shoulderIndex]];
};

/**
 * Draw pose keypoints onto a canvas
 */
export function drawKeypoints(
  keypoints: FormattedKeypoint[],
  minConfidence: number,
  ctx: CanvasRenderingContext2D,
  scale = 1
) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const { y, x } = keypoint.position;
    drawPoint(ctx, y * scale, x * scale, 3, color);
  }
}

export const wait = (milliseconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const isDev = () => process.env.NODE_ENV !== "production";

const NOSE_INDEX = 0;

export const isRightFacingPose = (keypoints: FormattedKeypoint[]): boolean => {
  let isRightFacingPose = false;

  // Nose is farther right than shoulders
  if (
    keypoints[NOSE_INDEX].position.x >
    keypoints[RIGHT_SHOULDER_INDEX].position.x
  ) {
    isRightFacingPose = true;
  }

  return isRightFacingPose;
};

export const getAngle = (a: FormattedKeypoint, b: FormattedKeypoint) =>
  (Math.atan2(a.y - b.y, a.x - b.x) * 180) / Math.PI;
