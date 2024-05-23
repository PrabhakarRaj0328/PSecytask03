
async function startCamera() {
    const video = document.getElementById('video');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error("Error accessing the camera: ", err);
        alert("Error accessing the camera: " + err.message);
    }
}

function capturePhoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const downloadLink = document.getElementById('download');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = 'captured_image.png';
        downloadLink.style.display = 'block';
        downloadLink.textContent = 'Download Photo';
    }, 'image/png');
}

document.addEventListener("DOMContentLoaded", (event) => {

    startCamera();
    const captureButton = document.getElementById('capture');
    captureButton.addEventListener('click', capturePhoto);
});