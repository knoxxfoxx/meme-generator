// Canvas and context
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');

// State
let currentImage = null;
let topText = '';
let bottomText = '';
let fontSize = 40;
let textColor = '#FFFFFF';

// Load image from file upload
document.getElementById('imageUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            loadImageFromUrl(event.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Load image from file
function loadImageFromUrl(url) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
        currentImage = img;
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;
        drawCanvas();
    };
    img.onerror = function() {
        alert('Failed to load image. Please try another image.');
    };
    img.src = url;
}

// Draw everything on canvas
function drawCanvas() {
    if (!currentImage) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);

    // Configure text style
    ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Draw top text
    if (topText) {
        drawTextWithBorder(topText, canvas.width / 2, 20);
    }

    // Draw bottom text
    if (bottomText) {
        const textMetrics = ctx.measureText(bottomText);
        const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
        drawTextWithBorder(bottomText, canvas.width / 2, canvas.height - textHeight - 20);
    }
}

// Draw text with customizable fill and black stroke (border)
function drawTextWithBorder(text, x, y) {
    // Set text style
    ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Draw black stroke (border) - multiple passes for thicker border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = Math.max(3, fontSize / 10);
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;
    
    // Draw stroke multiple times for thicker, more visible border
    for (let i = 0; i < 3; i++) {
        ctx.strokeText(text, x, y);
    }

    // Draw fill with selected color
    ctx.fillStyle = textColor;
    ctx.fillText(text, x, y);
}

// Update text handlers
document.getElementById('topText').addEventListener('input', function(e) {
    topText = e.target.value;
    drawCanvas();
});

document.getElementById('bottomText').addEventListener('input', function(e) {
    bottomText = e.target.value;
    drawCanvas();
});

// Font size handler
document.getElementById('fontSize').addEventListener('input', function(e) {
    fontSize = parseInt(e.target.value);
    document.getElementById('fontSizeValue').textContent = fontSize;
    drawCanvas();
});

// Text color handler
document.getElementById('textColor').addEventListener('input', function(e) {
    textColor = e.target.value;
    drawCanvas();
});

// Download functionality
document.getElementById('downloadBtn').addEventListener('click', function() {
    if (!currentImage) {
        alert('Please select an image first!');
        return;
    }

    // Convert canvas to blob and download
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'meme.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 'image/png');
});

