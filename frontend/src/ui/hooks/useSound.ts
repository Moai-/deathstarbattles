import { useState } from 'react';
import { gameBus, GameEvents } from 'src/util';

export const useSound = () => {
  const [muted, setMuted] = useState(false);

  const setMute = (mute: boolean) => {
    setMuted(mute);
    gameBus.emit(GameEvents.SET_VOLUME, { mute });
  };

  return {
    setMute,
    muted,
  };
};
