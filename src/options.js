function save_options() {
  var intervalMills = document.getElementById('intervalMills').value;
  if (intervalMills < 100) {
    return;
  }

  chrome.storage.local.set({
    "intervalMills": intervalMills
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Сохранено!';
    setTimeout(function() { status.textContent = ''; }, 750);
  });
}

function restore_options() {
  chrome.storage.local.get("intervalMills", function(items) {
    if (items.intervalMills) {
      document.getElementById('intervalMills').value = items.intervalMills;
    } else {
      document.getElementById('intervalMills').value = 250;
    }
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
