// Canvas and context
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');

// State
let currentImage = null;
let topText = '';
let bottomText = '';
let fontSize = 40;
let textColor = '#FFFFFF';
let selectedTemplate = null;

// Template images - will be loaded from templates.json
let templateImages = [];

// Initialize: Load templates from assets folder
async function loadTemplates() {
    const gallery = document.getElementById('templateGallery');
    
    if (!gallery) return;
    
    gallery.innerHTML = '<p style="color: rgba(255,255,255,0.5); font-size: 0.9em; text-align: center; padding: 20px;">Loading templates...</p>';
    
    // Try to load from templates.json
    try {
        const response = await fetch('assets/templates.json');
        if (response.ok) {
            const data = await response.json();
            templateImages = data.templates || [];
            console.log('Loaded templates:', templateImages);
        } else {
            console.error('Failed to load templates.json:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Could not load templates.json:', error);
        // Fallback: try to load templates.json with absolute path
        try {
            const response = await fetch('./assets/templates.json');
            if (response.ok) {
                const data = await response.json();
                templateImages = data.templates || [];
                console.log('Loaded templates (fallback):', templateImages);
            }
        } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
        }
    }
    
    // Display templates
    displayTemplates(gallery);
}

// Display templates in the gallery
function displayTemplates(gallery) {
    gallery.innerHTML = '';
    
    if (templateImages.length === 0) {
        gallery.innerHTML = '<p style="color: rgba(255,255,255,0.5); font-size: 0.9em; text-align: center; padding: 20px;">No templates found. Add images to the assets folder and update assets/templates.json with their filenames.</p>';
        return;
    }
    
    console.log('Displaying', templateImages.length, 'templates');
    
    templateImages.forEach((imageName, index) => {
        const templateItem = document.createElement('div');
        templateItem.className = 'template-item';
        templateItem.dataset.template = imageName;
        
        const img = document.createElement('img');
        // Try multiple path variations
        img.src = `assets/${imageName}`;
        img.alt = `Template ${index + 1}`;
        img.loading = 'lazy';
        
        img.onerror = function() {
            console.error('Failed to load image:', imageName, 'from path:', img.src);
            // Try alternative path
            if (!img.src.includes('./')) {
                img.src = `./assets/${imageName}`;
            } else {
                templateItem.style.display = 'none';
            }
        };
        
        img.onload = function() {
            console.log('Successfully loaded image:', imageName);
            templateItem.addEventListener('click', function() {
                selectTemplate(imageName, templateItem);
            });
        };
        
        templateItem.appendChild(img);
        gallery.appendChild(templateItem);
    });
}

// Select a template
function selectTemplate(imageName, element) {
    // Remove active class from all templates
    document.querySelectorAll('.template-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to selected template
    if (element) {
        element.classList.add('active');
    }
    
    selectedTemplate = imageName;
    loadImageFromUrl(`assets/${imageName}`);
}

// Load image from file upload
document.getElementById('imageUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            // Clear template selection when uploading
            document.querySelectorAll('.template-item').forEach(item => {
                item.classList.remove('active');
            });
            selectedTemplate = null;
            loadImageFromUrl(event.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Load image from URL (file or template)
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

// Initialize templates on page load
loadTemplates();








