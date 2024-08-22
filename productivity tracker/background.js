let activeTabId = null;
let activeTabStartTime = null;
let tabTimes = {};

// Listen for tab updates
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log('Tab activated:', activeInfo.tabId);
  if (activeTabId) {
    updateActiveTabTime();
  }
  
  activeTabId = activeInfo.tabId;
  activeTabStartTime = new Date().getTime();
});

// Update time on current tab
function updateActiveTabTime() {
  if (activeTabId && activeTabStartTime) {
    const currentTime = new Date().getTime();
    const timeSpent = currentTime - activeTabStartTime;
    console.log(`Time spent on tab ${activeTabId}: ${timeSpent} ms`);

    chrome.tabs.get(activeTabId, (tab) => {
      try {
        const domain = new URL(tab.url).hostname;
        tabTimes[domain] = (tabTimes[domain] || 0) + timeSpent;
        console.log(`Updating time for ${domain}: ${tabTimes[domain]} ms`);
        saveData();
      } catch (error) {
        console.error('Error parsing URL:', tab.url, error);
      }
    });
  }
}

// Save data to local storage
function saveData() {
  chrome.storage.local.set({ tabTimes }, () => {
    console.log('Data saved:', tabTimes);
  });
}

// Load data from storage on startup
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(['tabTimes'], (result) => {
    tabTimes = result.tabTimes || {};
    console.log('Data loaded:', tabTimes);
  });
});

// Update time on window focus change
chrome.windows.onFocusChanged.addListener(() => {
  if (activeTabId) {
    updateActiveTabTime();
    activeTabStartTime = new Date().getTime();
  }
});

// Check if a tab exceeds the time limit
function checkTimeLimit() {
  chrome.storage.local.get(['timeLimit'], (result) => {
    const timeLimit = result.timeLimit || 0;
    if (timeLimit > 0) {
      for (let domain in tabTimes) {
        const timeSpent = Math.floor(tabTimes[domain] / 60000);
        if (timeSpent > timeLimit) {
          chrome.notifications.create('', {
            title: 'Time Limit Exceeded',
            message: `You have spent ${timeSpent} minutes on ${domain}`,
            type: 'basic'
          });
        }
      }
    }
  });
}

// Check time limits every minute
setInterval(checkTimeLimit, 60000);
