/**
 * Shared between CameraRig (which orbits on drag) and NodeGraph (which opens
 * a panel on click) so that releasing a drag over a node does not also count
 * as selecting it.
 */
const DRAG_THRESHOLD_PX = 6;

export const dragState = {
  distance: 0,
  reset() {
    dragState.distance = 0;
  },
  add(dx: number, dy: number) {
    dragState.distance += Math.abs(dx) + Math.abs(dy);
  },
  get wasDrag() {
    return dragState.distance > DRAG_THRESHOLD_PX;
  },
};
