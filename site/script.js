function handleKeyPress(event) {
    if (event.keyCode === 13) {
        searchItems();
    }
}

function searchItems() {
    const keyword = document.getElementById('searchInput').value;
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    fetch(`/search?keyword=${encodeURIComponent(keyword)}`)
    .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const result = document.createElement('div');
                result.className = 'result';
                result.innerHTML = `
                    <a href="${item.url}${item.pathname}" target="_blank">${item.title}</a>
                    <div class="url">${item.url}${item.pathname}</div>
                    <div class="description">${item.description}</div>
                `;
                resultsContainer.appendChild(result);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}