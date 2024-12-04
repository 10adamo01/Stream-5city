const clientId = 'YOUR_CLIENT_ID'; // Wstaw swój Client ID
const clientSecret = 'YOUR_CLIENT_SECRET'; // Wstaw swój Client Secret
const tokenUrl = 'https://id.twitch.tv/oauth2/token';
const apiUrl = 'https://api.twitch.tv/helix/streams';

// Funkcja do pobierania tokenu
async function getAccessToken() {
  const response = await fetch(`${tokenUrl}?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
    method: 'POST',
  });
  const data = await response.json();
  return data.access_token;
}

// Funkcja do pobierania transmisji
async function getLiveStreams(token) {
  const response = await fetch(`${apiUrl}?query=5city`, {
    headers: {
      'Client-ID': clientId,
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.data;
}

// Funkcja renderująca transmisje na stronie
function displayStreams(streams) {
  const container = document.getElementById('streams-container');
  container.innerHTML = ''; // Czyści poprzednią zawartość

  streams.forEach((stream) => {
    const streamCard = document.createElement('div');
    streamCard.classList.add('stream-card');

    streamCard.innerHTML = `
      <img src="${stream.thumbnail_url.replace('{width}', '300').replace('{height}', '200')}" alt="${stream.user_name} Thumbnail">
      <h3>${stream.user_name}</h3>
      <p>${stream.title}</p>
      <p>Viewers: ${stream.viewer_count}</p>
      <a href="https://www.twitch.tv/${stream.user_login}" target="_blank" class="watch-btn">Watch Now</a>
    `;

    container.appendChild(streamCard);
  });
}

// Główna funkcja
(async function () {
  try {
    const token = await getAccessToken();
    const streams = await getLiveStreams(token);
    displayStreams(streams);
  } catch (error) {
    console.error('Error fetching streams:', error);
  }
})();
