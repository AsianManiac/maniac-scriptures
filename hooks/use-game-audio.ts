import { useAudioPlayer } from "expo-audio";

// Define sources
const SOUNDS = {
  pop: require("@/assets/game/sounds/error.mp3"),
  success: require("@/assets/game/sounds/pop.mp3"),
  error: require("@/assets/game/sounds/slice.mp3"),
  whoosh: require("@/assets/game/sounds/success.mp3"),
  slice: require("@/assets/game/sounds/whoosh.mp3"),
};

export const useGameAudio = () => {
  // Initialize players
  const popPlayer = useAudioPlayer(SOUNDS.pop);
  const successPlayer = useAudioPlayer(SOUNDS.success);
  const errorPlayer = useAudioPlayer(SOUNDS.error);
  const whooshPlayer = useAudioPlayer(SOUNDS.whoosh);
  const slicePlayer = useAudioPlayer(SOUNDS.slice);

  const play = (soundName: keyof typeof SOUNDS) => {
    let player;
    switch (soundName) {
      case "pop":
        player = popPlayer;
        break;
      case "success":
        player = successPlayer;
        break;
      case "error":
        player = errorPlayer;
        break;
      case "whoosh":
        player = whooshPlayer;
        break;
      case "slice":
        player = slicePlayer;
        break;
    }

    if (player) {
      player.seekTo(0);
      player.play();
    }
  };

  return { play };
};
