let notificationQueue = [];
let isNotificationVisible = false;

function searchItems() {
  const keyword = document.getElementById('searchInput').value;
  const size = 30;

  fetch(`/search?keyword=${encodeURIComponent(keyword)}&size=${size}`)
    .then((response) => response.json())
    .then((results) => {
      displayResults(results);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    searchItems();
  }
}

function displayResults(results) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';

  if (results.length === 0) {
    resultsContainer.innerHTML = '<p>No results found.</p>';
    return;
  }

  const resultList = document.createElement('div');
  resultList.id = 'results';

  results.forEach((result) => {
    const listItem = document.createElement('div');
    listItem.classList.add('tile');
    listItem.innerHTML = `
      <h3><a href="${result.url}" target="_blank">${result.title}</a></h3>
      <p class="url">${result.url}</p>
      <p class="path">${result.pathname}</p>
      <p class="description">${result.description || 'No description available.'}</p>
    `;
    resultList.appendChild(listItem);
  });

  resultsContainer.appendChild(resultList);
}

function showNotification(latestItem) {
  if (latestItem && latestItem.title) {
    notificationQueue.push(latestItem);
    processNotificationQueue();
  }
}

function processNotificationQueue() {
  if (!isNotificationVisible && notificationQueue.length > 0) {
    const latestItem = notificationQueue.shift();
    const notificationContent = document.getElementById('notificationContent');
    notificationContent.innerHTML = `
      <h4>Recently added:</h4>
      <p><a href="${latestItem.url}" target="_blank">${latestItem.title}</a></p>
      <p>URL: ${latestItem.url}</p>
      <p>Path: ${latestItem.pathname}</p>
    `;

    const notification = document.getElementById('notification');
    notification.classList.add('show');
    isNotificationVisible = true;

    setTimeout(() => {
      hideNotification();
      setTimeout(() => {
        processNotificationQueue();
      }, 500);
    }, 4500);
  }
}

function hideNotification() {
  const notification = document.getElementById('notification');
  notification.classList.remove('show');
  isNotificationVisible = false;
}

function pollLatestItem() {
  fetch('/latest')
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error fetching latest item');
      }
    })
    .then((latestItem) => {
      showNotification(latestItem);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

setInterval(pollLatestItem, 4500);