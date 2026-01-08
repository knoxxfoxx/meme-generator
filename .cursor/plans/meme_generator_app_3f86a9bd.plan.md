---
name: Meme Generator App
overview: Create a meme generator web application using vanilla HTML/CSS/JavaScript that allows users to select images (upload or gallery), add customizable text overlays with white text and black borders, resize text, and download the final meme.
todos: []
---

# Meme Generator Implementation Plan

## Overview

Build a single-page meme generator application using vanilla HTML/CSS/JavaScript. The app will allow users to select images (upload or from a gallery), add text overlays with customizable sizing, and download the final meme.

## Architecture

```
User Interface
├── Image Selection Panel
│   ├── Upload Button
│   └── Gallery Template Selector
├── Canvas Area (Image + Text Overlays)
├── Text Controls Panel
│   ├── Text Input Fields
│   ├── Font Size Slider
│   └── Position Controls
└── Download Button
```

## File Structure

- `index.html` - Main HTML structure
- `styles.css` - All styling
- `script.js` - Core application logic
- `gallery/` - Directory for meme template images (optional)

## Implementation Details

### 1. HTML Structure (`index.html`)

- Header with title
- Image selection section:
  - File upload input
  - Gallery grid with popular meme templates
- Canvas container for displaying image with text overlays
- Text controls panel:
  - Input fields for top and bottom text (standard meme format)
  - Font size slider
  - Optional: position adjustment controls
- Download button

### 2. CSS Styling (`styles.css`)

- Modern, clean UI design
- Responsive layout
- Canvas styling with border/shadow
- Control panel styling
- Gallery grid layout
- Button hover effects

### 3. JavaScript Functionality (`script.js`)

**Core Features:**

- **Image Loading:**
  - Handle file upload via FileReader API
  - Load gallery images on click
  - Display selected image on canvas

- **Text Overlay System:**
  - Render text on canvas using Canvas API
  - Implement white text with black stroke (outline) using `fillStyle` and `strokeStyle`
  - Support top and bottom text positioning (standard meme format)
  - Make text draggable for positioning (optional enhancement)

- **Text Controls:**
  - Font size slider (range input)
  - Real-time text update on canvas
  - Text input fields for editing

- **Download Functionality:**
  - Convert canvas to image blob
  - Trigger download using `download` attribute on anchor element
  - Format: PNG or JPG

**Technical Approach:**

- Use HTML5 Canvas API for rendering
- `fillText()` with white fill
- `strokeText()` with black stroke for border effect
- `toBlob()` or `toDataURL()` for export
- Event listeners for all interactive elements

## Key Functions

1. `loadImage(src)` - Load image from file or URL
2. `drawCanvas()` - Render image and text overlays
3. `updateText()` - Update text content and redraw
4. `updateFontSize()` - Adjust text size and redraw
5. `downloadMeme()` - Export canvas as image file

## Gallery Templates

Include popular meme templates (Drake, Distracted Boyfriend, etc.) or provide placeholder images that users can replace.

## Styling Details

- Text: White fill (`#FFFFFF`) with black stroke (`#000000`, ~3-4px width)
- Font: Impact or Arial Black (classic meme fonts)
- Canvas: Maintain aspect ratio, max-width responsive