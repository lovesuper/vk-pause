function save_options() {
  var intervalMills = document.getElementById('intervalMills').value;
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
    document.getElementById('intervalMills').value = items.intervalMills;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
