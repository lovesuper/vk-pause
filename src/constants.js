var STATE = { playing: { value: "playing" }, paused: { value: "paused" } }

var SELECTORS = {
  playstop: { value: ".top_audio_player" },
  play: { value: ".top_audio_player_play" },
  next: { value: ".top_audio_player_next" },
  title: { value: ".top_audio_player_title_wrap" }
}

var HOTKEY = {
  main: { value: "playstop" },
  localmain: { value: "localplaystop" }
}

var COMMAND = {
  setToPlay: { value: "play" },
  setToPause: { value: "pause" },
  setToNext: { value: "next" },
  setToOppositeState: { value: "oppositeState" }
}

var URL = {
  vk: { value: "*://vk.com/*" }
}

var TRASH_MUTATOR_FLAG = "top_audio_player_title";
var PLAYING_FLAG = "top_audio_player_playing";
var SSL_VK_URL = "https://vk.com";
var DEFAULT_INTERVAL_MILLS = 250;
var DEFAULT_TITLE = "Нажмите, чтобы начать использование";

