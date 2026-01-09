# Meme Generator - Full Stack App

A modern meme generator built with Next.js, React, TypeScript, and InstantDB. Create memes, share them with the community, and upvote your favorites!

## Features

- 🎨 **Create Memes**: Use the canvas editor to add text overlays to images
- 📤 **Upload Images**: Upload your own images or choose from templates
- 💾 **Save & Share**: Save memes to your account and share with the community
- 👍 **Upvote System**: Upvote memes you like
- 🔐 **Magic Link Auth**: Passwordless authentication with 6-digit verification codes
- ⚡ **Real-time Updates**: See new memes and upvotes in real-time
- 📱 **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **Database**: InstantDB (real-time, serverless)
- **Authentication**: InstantDB Magic Link Auth
- **Canvas**: HTML5 Canvas API for meme creation

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── create/            # Meme creator page
│   ├── feed/              # Public meme feed
│   ├── my-memes/          # User's own memes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Auth.tsx           # Authentication component
│   ├── MemeCanvas.tsx     # Canvas editor
│   ├── MemeCard.tsx       # Meme display card
│   ├── MemeToolbar.tsx    # Editor toolbar
│   ├── Navigation.tsx     # Navigation bar
│   ├── TemplateGallery.tsx # Template selector
│   └── ImageUpload.tsx    # Image upload component
├── lib/                   # Library code
│   ├── db.ts              # InstantDB configuration
│   └── rules.ts           # Database permissions
├── styles/                # Global styles
│   └── globals.css        # CSS styles
└── public/                # Static assets
    └── assets/            # Meme templates

```

## Database Schema

### Memes
- `imageData`: Base64 encoded image
- `topText`: Top text overlay
- `bottomText`: Bottom text overlay
- `fontSize`: Font size for text
- `textColor`: Color of text
- `userId`: Creator's user ID
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Upvotes
- `memeId`: Reference to meme
- `userId`: User who upvoted
- `createdAt`: Upvote timestamp

## Features in Detail

### Meme Creation
- Upload custom images or select from templates
- Add top and bottom text with customizable:
  - Font size (20-240px)
  - Text color
- Real-time canvas preview
- Download memes as PNG

### Authentication
- Passwordless magic link authentication
- 6-digit verification code sent to email
- Secure session management
- Automatic sign-in across devices

### Social Features
- Browse all user-created memes
- Upvote/unvote memes
- Real-time upvote counts
- View and manage your own memes

## Development

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## License

MIT

## Acknowledgments

- InstantDB for the real-time database
- Next.js for the framework
- Impact font for classic meme text style
