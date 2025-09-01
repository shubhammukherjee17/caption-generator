# Instagram Caption Generator - Quick Setup 📸✨

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set up Google Gemini API (Required for AI captions)
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" (it's FREE!)
4. Copy the key and add it to `.env.local`:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### Step 3: Run the Application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 🎯 Quick Test

1. **Choose content type**: Select Post, Story, or Reel
2. **Upload an image** by dragging and dropping or clicking the upload area
3. **Wait 3-10 seconds** for AI processing
4. **Get 4 caption styles**: Casual, Professional, Trendy, and Minimal
5. **Copy & use**: Click any caption to copy with hashtags included!

## ⚠️ Important Notes

- **API Key Required**: Without a Gemini API key, you'll get fallback captions
- **Free Tier**: Gemini offers generous free usage - perfect for this app
- **File Limits**: Maximum 10MB per image
- **Supported Formats**: JPG, PNG, GIF, WebP, BMP
- **Content Types**: Each type generates different caption styles

## 🛠️ Troubleshooting

**No AI captions?**
- Check that your Gemini API key is correctly set in `.env.local`
- Ensure you have a stable internet connection
- Verify your API key has proper permissions

**Build errors?**
- Run `npm install` to ensure all dependencies are installed
- Check that you're using Node.js 18 or later

**Upload not working?**
- Make sure your image is under 10MB
- Try a different image format (JPG/PNG work best)

## 🎨 Customization

### Modify Caption Prompts
Edit `generateInstagramPrompt()` in `src/app/api/generate-caption/route.ts` to customize caption styles:

```typescript
case 'post':
  return `${basePrompt} Create 4 different Instagram POST captions:
  1. CASUAL - Your custom style...
  // ... customize other styles
```

### Add New Content Types
Extend the `InstagramContentType` and add new prompt cases:

```typescript
type InstagramContentType = 'post' | 'story' | 'reel' | 'carousel';
```

## 📦 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add your `GEMINI_API_KEY` to Vercel environment variables
4. Deploy!

Your Instagram Caption Generator will be live at `your-app.vercel.app`

---

Need help? Check the main [README.md](README.md) for detailed documentation.
