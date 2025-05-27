/* eslint-disable @typescript-eslint/no-explicit-any */

export const toggleFullscreen = () => {
  const container = document.getElementById('game-container');
  if (!container) return;

  if (!document.fullscreenElement) {
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if ((container as any).webkitRequestFullscreen) {
      (container as any).webkitRequestFullscreen();
    } else if ((container as any).msRequestFullscreen) {
      (container as any).msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  }
};
