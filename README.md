# Instagram Caption Generator 📸✨

An AI-powered Instagram caption generator built with Next.js, TypeScript, and Google Gemini that creates engaging captions for your Instagram posts, stories, and reels. Get multiple caption styles with hashtags and emojis!

## Features

🔥 **Real-Time Image Analysis** - AI analyzes your exact image content, mood, and style
🎆 **Instagram-Focused** - Specialized captions for Posts, Stories, and Reels
🎨 **5 Dynamic Caption Styles** - Adapts Casual, Professional, Trendy, Aesthetic, and Minimal to your image
💋 **Context-Aware Captions** - Sexy/hot images get bold captions, aesthetic images get dreamy ones
😍 **Smart Emoji Matching** - Emojis that actually relate to your image content
🔍 **Category Detection** - Automatically detects: fashion, fitness, aesthetic, romantic, bold, etc.
🚀 **Google Gemini Vision** - Advanced AI that truly "sees" and understands your images
📋 **Copy-Ready Formats** - Both text+emoji captions and emoji-only versions
📱 **Instagram Preview** - See exactly how captions look on Instagram
🖱️ **Instant Upload** - Drag, drop, and get real-time analysis

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

### Real-Time AI Analysis

The app uses **Google Gemini 1.5 Flash** with advanced vision to:

1. **Deep Image Analysis** - Identifies subjects, mood, lighting, colors, and emotions
2. **Context Detection** - Recognizes: sexy/hot, aesthetic, fitness, fashion, romance, boldness, etc.
3. **Style Adaptation** - All 5 caption styles adapt to match your specific image vibe
4. **Smart Emoji Selection** - Chooses emojis that directly relate to image content
5. **Category-Specific Language** - Uses appropriate language for each detected category:
   - **Confident/Sexy**: Bold, alluring, fire language (🔥💋😘)
   - **Aesthetic**: Dreamy, poetic, artistic language (🌸✨🌙)
   - **Fitness**: Motivational, strong, empowering language (💪🏆⚡)
   - **Fashion**: Trendy, stylish, chic language (💅👑👠)
   - **Romantic**: Love, sweet, heartfelt language (💖🌹🥰)
6. **Energy Matching** - High-energy images get exciting captions, calm images get peaceful ones

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
