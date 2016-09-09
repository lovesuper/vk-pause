var STATE = {
  playing: { value: "loading" },
  paused: { value: "paused" },
  loading: { value: "loading" }
}

var OLD_VK_SEL = {
  playstop: { value: "#head_play_btn" },
  playingFlag: { value: "playing" },
  pausedFlag: { value: "" },
  playBtn: { value: ".top_audio_player_btn_icon" }
}

var NEW_VK_SEL = {
  playstop: { value: ".top_audio_player" },
  play: { value: ".top_audio_player_play" },
  next: { value: ".top_audio_player_next" },
  playingFlag: { value: "top_audio_player top_audio_player_enabled" },
  pausedFlag: { value: "top_audio_player top_audio_player_enabled top_audio_player_playing" },
  playBtn: { value: ".top_audio_player_playing" }
}

var HOTKEY = {
  main: { value: "playstop" }
}

var COMMAND = {
  setToPlay: { value: "play" },
  setToPause: { value: "pause" },
  setToNext: { value: "next" },
  setToPrev: { value: "prev" }
}

var URL = {
  oldVkUrl: { value: "*://vk.com/*" },
  newVkUrl: { value: "*://new.vk.com/*" }
}

SSL_VK_URL = "https://vk.com";
DOUBLE_CLICK_MILLS = 250;

