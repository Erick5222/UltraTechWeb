/** Interval between automatic showcase rotations while the user is idle. */
export const AUTO_ROTATION_INTERVAL_MS = 10_000;

/** Inactivity period after user interaction before auto-rotation resumes. */
export const USER_IDLE_TIMEOUT_MS = 30_000;

/** Delay before retrying auto-rotation when a transition is still in progress. */
export const AUTO_ROTATION_RETRY_MS = 400;

/** DOM events that indicate the user is interacting with a case study demo. */
export const CASE_STUDY_INTERACTION_EVENTS = [
  'click',
  'mousedown',
  'pointerdown',
  'touchstart',
  'keydown',
  'input',
  'change',
  'focusin',
  'selectstart',
  'dragenter',
  'dragover',
  'drop',
  'wheel',
  'touchmove',
  'scroll',
] as const;
