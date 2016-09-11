var STATE = {
  playing: { value: "playing" },
  paused: { value: "paused" },
  loading: { value: "loading" }
}

var SELECTORS = {
  playstop: { value: ".top_audio_player" },
  play: { value: ".top_audio_player_play" },
  next: { value: ".top_audio_player_next" }
}

var HOTKEY = {
  main: { value: "playstop" },
  localmain: { value: "localplaystop" }
}

var COMMAND = {
  setToPlay: { value: "play" },
  setToPause: { value: "pause" },
  setToNext: { value: "next" },
  setToPrev: { value: "prev" }
}

var URL = {
  vk: { value: "*://vk.com/*" }
}

SSL_VK_URL = "https://vk.com";
DEFAULT_INTERVAL_MILLS = 250;

