document.addEventListener('DOMContentLoaded', () => {
  loadReport();
  loadSettings();

  const saveButton = document.getElementById('save-settings');
  if (saveButton) {
    saveButton.addEventListener('click', saveSettings);
  } else {
    console.error('Save button not found!');
  }
});

// Load the time report
function loadReport() {
  chrome.storage.local.get(['tabTimes'], (result) => {
    const tabTimes = result.tabTimes || {};
    const timeList = document.getElementById('time-list');
    if (timeList) {
      timeList.innerHTML = '';

      for (let domain in tabTimes) {
        const li = document.createElement('li');
        li.textContent = `${domain}: ${Math.floor(tabTimes[domain] / 60000)} minutes`;
        timeList.appendChild(li);
      }
    } else {
      console.error('Time list element not found!');
    }
  });
}

// Load settings from storage
function loadSettings() {
  chrome.storage.local.get(['timeLimit'], (result) => {
    const timeLimit = result.timeLimit;
    const timeLimitInput = document.getElementById('time-limit');
    if (timeLimitInput) {
      timeLimitInput.value = timeLimit || '';
    } else {
      console.error('Time limit input element not found!');
    }
  });
}

// Save settings to storage
function saveSettings() {
  const timeLimitInput = document.getElementById('time-limit');
  if (timeLimitInput) {
    const timeLimit = parseInt(timeLimitInput.value, 10);
    if (!isNaN(timeLimit) && timeLimit >= 0) {
      chrome.storage.local.set({ timeLimit }, () => {
        alert('Settings saved!');
      });
    } else {
      alert('Please enter a valid non-negative number for the time limit.');
    }
  } else {
    console.error('Time limit input element not found!');
  }
}
