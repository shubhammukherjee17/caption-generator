# Instagram Caption Generator 📸✨

An AI-powered Instagram caption generator built with Next.js, TypeScript, and Google Gemini that creates engaging captions for your Instagram posts, stories, and reels. Get multiple caption styles with hashtags and emojis!

## Features

🎆 **Instagram-Focused** - Specialized captions for Posts, Stories, and Reels
🎨 **5 Caption Styles** - Casual, Professional, Trendy, Aesthetic, and Minimal options
🌸 **Aesthetic Captions** - Dreamy, poetic, artistic captions for creative content
😍 **Emoji Integration** - Emojis naturally woven into text + separate emoji-only versions
🔍 **Smart Hashtags** - AI-generated relevant hashtags for better reach
🚀 **Google Gemini AI** - Advanced vision AI for contextual understanding
📋 **Copy-Ready** - One-click copying with proper formatting
📱 **Instagram Preview** - See how your captions look on Instagram
🖱️ **Drag & Drop** - Easy image upload with visual feedback

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI/ML**: Google Gemini 1.5 Flash (Vision)
- **Image Processing**: Sharp
- **UI Components**: Lucide React icons
- **File Upload**: React Dropzone

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd image-caption-generator
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

To get a Google Gemini API key (FREE):
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key to your `.env.local` file

**Note**: Gemini has a generous free tier perfect for this app!

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Choose Content Type**: Select Post, Story, or Reel for optimized captions
2. **Upload an Image**: Drag and drop or click to select from your device
3. **Wait for AI Magic**: Gemini analyzes your image (usually 3-10 seconds)
4. **Get 5 Caption Styles**: Casual, Professional, Trendy, Aesthetic, and Minimal
5. **Copy Text or Emojis**: Choose text captions (with emojis) or emoji-only versions
6. **Post to Instagram**: Paste directly to Instagram with hashtags included!

### Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- BMP (.bmp)

**File Size Limit**: 10MB per image

## How It Works

### Instagram Content Types

**Posts** - Engaging feed content with hashtags (50-150 chars)
**Stories** - Quick, casual overlay text (15-40 chars)
**Reels** - Hook-driven, viral-worthy captions with CTAs (80-200 chars)

### 5 Caption Styles

😎 **Casual** - Fun, relatable, conversational with natural emojis
💼 **Professional** - Polished, brand-friendly, informative with subtle emojis
🔥 **Trendy** - Current slang, viral phrases, Gen-Z style with trendy emojis
🌸 **Aesthetic** - Dreamy, poetic, artistic language with aesthetic emojis
✨ **Minimal** - Clean, simple, impactful with minimal emojis

### AI Caption Generation

The app uses **Google Gemini 1.5 Flash** with vision capabilities to:

1. **Analyze Image Content** - Understands objects, scenes, emotions, and context
2. **Generate 5 Style Variations** - Creates diverse caption approaches for each image
3. **Natural Emoji Integration** - Weaves emojis seamlessly into text captions
4. **Emoji-Only Versions** - Provides separate emoji-only captions for versatility
5. **Smart Hashtag Suggestions** - Relevant, trending hashtags for better reach
6. **Platform Optimization** - Tailored for each Instagram content type

## Project Structure

```
src/
├── app/
│   ├── api/generate-caption/
│   │   └── route.ts          # API endpoint for caption generation
│   ├── globals.css           # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main application page
├── components/
│   ├── ImageUploader.tsx    # Image upload component with drag-and-drop
│   └── CaptionDisplay.tsx   # Caption results display component
└── types/                   # TypeScript type definitions
```

## Customization

### Adding More Emojis

Edit the `emojiMap` object in `src/app/api/generate-caption/route.ts` to add more word-to-emoji mappings:

```typescript
const emojiMap: Record<string, string> = {
  // Add your custom mappings
  'mountain': '🏔️',
  'beach': '🏖️',
  // ... existing mappings
};
```

### Using Different AI Models

You can replace the BLIP model with other Hugging Face models:

```typescript
const result = await hf.imageToText({
  data: processedImage,
  model: 'nlpconnect/vit-gpt2-image-captioning' // Alternative model
});
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
