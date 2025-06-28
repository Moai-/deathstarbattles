/* eslint-disable @typescript-eslint/no-explicit-any */
// Disable explicit any because of possible vendor specific fullscreen implementations

export const toggleFullscreen = (toggle?: boolean) => {
  const container = document.getElementById('game-container');
  if (!container) return;

  if (toggle === undefined) {
    if (!document.fullscreenElement) {
      enterFullscreen(container);
    } else {
      exitFullscreen();
    }
  }

  if (toggle === true) {
    enterFullscreen(container);
  } else {
    exitFullscreen();
  }
};

const enterFullscreen = (container: HTMLElement) => {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if ((container as any).webkitRequestFullscreen) {
    (container as any).webkitRequestFullscreen();
  } else if ((container as any).msRequestFullscreen) {
    (container as any).msRequestFullscreen();
  }
};

const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if ((document as any).webkitExitFullscreen) {
    (document as any).webkitExitFullscreen();
  } else if ((document as any).msExitFullscreen) {
    (document as any).msExitFullscreen();
  }
};
