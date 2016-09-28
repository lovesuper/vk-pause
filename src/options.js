var INTERVAL_MILLS_MIN_TRESHOLD = 200;
var DEFATUL_INTERVAL_MILLS = 250;

function save_options() {
  var intervalMills = document.getElementById('intervalMills').value;
  if (intervalMills < INTERVAL_MILLS_MIN_TRESHOLD) { return; }

  chrome.storage.local.set({
    "intervalMills": intervalMills
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Сохранено!';
    setTimeout(function() { status.textContent = ''; }, 1000);
  });
}

function restore_options() {
  chrome.storage.local.get("intervalMills", function(items) {
    if (items.intervalMills) {
      document.getElementById('intervalMills').value = items.intervalMills;
    } else {
      document.getElementById('intervalMills').value = DEFATUL_INTERVAL_MILLS;
    }
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

