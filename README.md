# Image Caption Generator 📸✨

A modern, AI-powered Instagram caption generator with a clean, professional interface inspired by QR Builders. Built with Next.js, TypeScript, and Google Gemini AI to create engaging captions for your Instagram posts, stories, and reels.

🌐 **Live Demo**: [Caption Generator](https://caption-generator-shubham.vercel.app/)

## ✨ Features

🤖 **Advanced AI Vision** - Powered by Google Gemini 1.5 Flash for intelligent image analysis
🎯 **Multiple Caption Styles** - 9 unique styles: Casual, Professional, Trendy, Minimal, Aesthetic, Bold, Poetic, One-line, and One-word
📱 **Instagram-Optimized** - Specialized captions for Posts, Stories, and Reels
🎨 **Clean Modern UI** - Professional white theme with subtle gradients and shadows
📋 **Mobile-Friendly Copy** - Enhanced clipboard functionality that works on all devices
🚀 **Real-time Generation** - Instant caption creation with smooth loading animations
💎 **Smart Emoji Integration** - Context-aware emojis and emoji-only versions
🔄 **Responsive Design** - Perfect experience on desktop, tablet, and mobile
⚡ **Zero Setup Required** - No signups, no fees - just upload and generate!
🎪 **Interactive Elements** - Smooth scrolling, hover effects, and polished transitions

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
git clone https://github.com/shubhammukherjee17/caption-generator.git
cd caption-generator
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
3. **AI Processing**: Gemini analyzes your image content, mood, and context
4. **Get 9 Caption Styles**: From casual to poetic, including one-word options
5. **Mobile-Friendly Copy**: Enhanced clipboard that works on all devices
6. **Ready to Post**: Paste directly to Instagram with hashtags and emojis!

### Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- BMP (.bmp)

**File Size Limit**: 10MB per image

## 🎨 UI Design

The application features a modern, clean interface inspired by professional SaaS platforms:

- **Clean White Theme**: Professional appearance with subtle gradients
- **Card-Based Layout**: Organized content in elegant white cards with soft shadows
- **Typography**: Inter font for modern, readable text hierarchy
- **Interactive Elements**: Smooth hover effects, scaling animations, and transitions
- **Mobile-First**: Responsive design that works perfectly on all screen sizes
- **Accessibility**: Touch-friendly buttons and proper contrast ratios
- **Loading States**: Beautiful loading animations and progress indicators

## How It Works

### Instagram Content Types

**Posts** - Engaging feed content with hashtags (50-150 chars)
**Stories** - Quick, casual overlay text (15-40 chars)
**Reels** - Hook-driven, viral-worthy captions with CTAs (80-200 chars)

### 9 Caption Styles

😎 **Casual** - Fun, relatable, conversational with natural emojis
💼 **Professional** - Polished, brand-friendly, informative with subtle emojis
🔥 **Trendy** - Current slang, viral phrases, Gen-Z style with trendy emojis
🌸 **Aesthetic** - Dreamy, poetic, artistic language with aesthetic emojis
✨ **Minimal** - Clean, simple, impactful with minimal emojis
👑 **Bold** - Confident, powerful, attention-grabbing with strong emojis
🌙 **Poetic** - Lyrical, artistic, metaphorical language with ethereal emojis
📝 **One Line** - Single impactful sentence that captures the essence
💎 **One Word** - Powerful single word that defines the moment

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
│   │   └── route.ts          # Google Gemini API integration
│   ├── globals.css           # Global Tailwind CSS styles
│   ├── layout.tsx           # Root layout with Inter font
│   └── page.tsx             # Main application page with scrolling navigation
├── components/
│   ├── ContentTypeSelector.tsx # Content type selection (Post/Story/Reel)
│   ├── ImageUploader.tsx    # Drag-and-drop image upload with loading states
│   └── CaptionDisplay.tsx   # Caption results with mobile-friendly copy
└── types/                   # TypeScript interfaces and types
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

## 🚀 Deployment

### Deploy on Vercel (Recommended)

1. **Connect Repository**: Import your GitHub repository on [Vercel](https://vercel.com/new)
2. **Add Environment Variable**: Set `GEMINI_API_KEY` in project settings
3. **Deploy**: Vercel will automatically build and deploy your app

### Other Deployment Options

- **Netlify**: Use the build command `npm run build`
- **Railway**: Connect GitHub repo and deploy with auto-scaling
- **Docker**: Use the included Dockerfile for containerized deployment

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Ideas for Contributions

- 🎨 Additional UI themes or color schemes
- 🔍 More caption styles (e.g., Funny, Motivational, Educational)
- 🌍 Internationalization (i18n) support
- 📊 Analytics and usage tracking
- ⚡ Performance optimizations
- 🧪 Testing improvements

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- **AI Technology**: Google Gemini 1.5 Flash
- **UI Inspiration**: QR Builders design philosophy
- **Developer**: [Shubham Mukherjee](https://github.com/shubhammukherjee17)
- **Icons**: Lucide React
- **Framework**: Next.js team

---

⭐ **Star this repo** if you found it helpful!

💬 **Questions?** Open an issue or reach out on GitHub.
