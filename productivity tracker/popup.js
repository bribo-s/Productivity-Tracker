document.addEventListener('DOMContentLoaded', () => {
    loadReport();
    loadSettings();
  
    document.getElementById('save-settings').addEventListener('click', saveSettings);
  });
  
  // Load the time report
  function loadReport() {
    chrome.storage.local.get(['tabTimes'], (result) => {
      const tabTimes = result.tabTimes || {};
      const timeList = document.getElementById('time-list');
      timeList.innerHTML = '';
  
      for (let domain in tabTimes) {
        const li = document.createElement('li');
        li.textContent = `${domain}: ${Math.floor(tabTimes[domain] / 60000)} minutes`;
        timeList.appendChild(li);
      }
    });
  }
  
  // Load settings from storage
  function loadSettings() {
    chrome.storage.local.get(['timeLimit'], (result) => {
      document.getElementById('time-limit').value = result.timeLimit || '';
    });
  }
  
  // Save settings to storage
  function saveSettings() {
    const timeLimit = document.getElementById('time-limit').value;
    chrome.storage.local.set({ timeLimit: parseInt(timeLimit, 10) }, () => {
      alert('Settings saved!');
    });
  }
  