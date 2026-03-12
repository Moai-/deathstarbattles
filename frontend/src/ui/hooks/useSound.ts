import { useState } from 'react';
import { gameBus, GameEvents } from 'src/events';

export const useSound = () => {
  const [muted, setMuted] = useState(true);

  const setMute = (mute: boolean) => {
    setMuted(mute);
    gameBus.emit(GameEvents.SET_VOLUME, { mute });
  };

  return {
    setMute,
    muted,
  };
};
