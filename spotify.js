const clientId = 'Nunca compartilhe suas credenciais do Spotify publicamente!';
const clientSecret = 'Nunca compartilhe suas credenciais do Spotify publicamente!';
const refreshToken = 'Nunca compartilhe suas credenciais do Spotify publicamente!';

async function getCurrentTrack() {
    try {

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=refresh_token&refresh_token=' + refreshToken
        });

        const data = await response.json();
        const accessToken = data.access_token;


        const trackResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });

        if (trackResponse.status === 200) {
            const trackData = await trackResponse.json();
            updateNowPlaying(trackData);
        } else {
            showNotPlaying();
        }
    } catch (error) {
        console.error('Erro:', error);
        showNotPlaying();
    }
}

function updateNowPlaying(trackData) {
    const container = document.querySelector('.spotify-now-playing');
    const header = document.querySelector('.spotify-header span');
    

    header.textContent = `Atualmente escutando ${trackData.item.name} no Spotify`;
    

    container.innerHTML = `
        <img src="${trackData.item.album.images[0].url}" alt="Album Cover">
        <div class="track-info">
            <h3>${trackData.item.name}</h3>
            <p>${trackData.item.artists[0].name}</p>
        </div>
    `;
}

function showNotPlaying() {
    const container = document.querySelector('.spotify-now-playing');
    const header = document.querySelector('.spotify-header span');
    

    header.textContent = 'Atualmente escutando no Spotify';
    

    container.innerHTML = `
        <div class="spotify-placeholder">
            <p>Nenhuma música tocando no momento</p>
        </div>
    `;
}


setInterval(getCurrentTrack, 30000);
getCurrentTrack(); 