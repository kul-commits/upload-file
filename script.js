const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-input');
const previewContainer = document.getElementById('preview-container');
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');

const API_URL = 'http://localhost:5000'; // Your backend API URL

// User authentication functions
registerBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.text();
    alert(data);
});

loginBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (data.token) {
        alert('Logged in successfully!');
        localStorage.setItem('token', data.token); // Store the JWT token
    } else {
        alert(data);
    }
});

// File upload functionality
uploadBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file to upload.');
        return;
    }

    const fileType = file.type;
    const fileURL = URL.createObjectURL(file);
    renderPreview(fileType, fileURL, file.name);

    // Here you would typically upload the file to your server
    // This example does not handle actual uploads to the backend.
});

function renderPreview(fileType, fileURL, fileName) {
    const previewElement = document.createElement('div');
    previewElement.classList.add('file-preview');

    if (fileType.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = fileURL;
        img.alt = fileName;
        img.style.maxWidth = '100%';
        previewElement.appendChild(img);
    } else if (fileType.startsWith('audio/')) {
        const audio = document.createElement('audio');
        audio.src = fileURL;
        audio.controls = true;
        previewElement.appendChild(audio);
    } else if (fileType.startsWith('video/')) {
        const video = document.createElement('video');
        video.src = fileURL;
        video.controls = true;
        previewElement.appendChild(video);
    } else if (fileType === 'application/pdf') {
        const embed = document.createElement('embed');
        embed.src = fileURL;
        embed.style.width = '100%';
        embed.style.height = '400px';
        previewElement.appendChild(embed);
    } else {
        previewElement.textContent = 'Unsupported file type.';
    }

    previewContainer.innerHTML = ''; // Clear previous previews
    previewContainer.appendChild(previewElement);
}
