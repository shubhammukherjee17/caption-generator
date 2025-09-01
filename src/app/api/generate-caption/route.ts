import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import sharp from 'sharp';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

type InstagramContentType = 'post' | 'story' | 'reel';

interface InstagramCaption {
  type: 'casual' | 'professional' | 'trendy' | 'minimal';
  text: string;
  hashtags: string[];
  emojis: string;
}

function generateInstagramPrompt(contentType: InstagramContentType): string {
  const basePrompt = `Analyze this image and generate Instagram captions. Focus on what's actually visible in the image.`;
  
  switch (contentType) {
    case 'post':
      return `${basePrompt} Create 4 different Instagram POST captions:
      1. CASUAL - Fun, relatable, conversational tone
      2. PROFESSIONAL - Polished, brand-friendly, informative
      3. TRENDY - Using current slang, trending phrases, Gen-Z style
      4. MINIMAL - Short, aesthetic, clean with minimal text
      
      For each caption:
      - Make it engaging and authentic
      - Include relevant emojis naturally in the text
      - Suggest 5-8 relevant hashtags
      - Keep captions between 50-150 characters
      - Make it specific to what's in the image
      
      Return in JSON format:
      {
        "captions": [
          {
            "type": "casual",
            "text": "caption text with emojis",
            "hashtags": ["hashtag1", "hashtag2"...],
            "emojis": "🎨✨📸"
          }
        ]
      }`;
      
    case 'story':
      return `${basePrompt} Create 4 different Instagram STORY captions:
      1. CASUAL - Short, spontaneous, authentic
      2. PROFESSIONAL - Brief but polished
      3. TRENDY - Current vibes, relatable
      4. MINIMAL - Very short, aesthetic
      
      For each caption:
      - Keep it SHORT (20-50 characters)
      - Perfect for story overlay text
      - Include 2-4 relevant emojis
      - Focus on the moment/feeling
      - Make it specific to what's in the image
      
      Return in JSON format:
      {
        "captions": [
          {
            "type": "casual",
            "text": "short story text",
            "hashtags": [],
            "emojis": "🎨✨"
          }
        ]
      }`;
      
    case 'reel':
      return `${basePrompt} Create 4 different Instagram REEL captions:
      1. CASUAL - Hook + engaging question or statement
      2. PROFESSIONAL - Value-driven, educational hook
      3. TRENDY - Viral-worthy, shareable content
      4. MINIMAL - Clean, aesthetic with strong hook
      
      For each caption:
      - Start with a STRONG hook
      - Include call-to-action
      - Use trending hashtags
      - 100-200 characters optimal
      - Encourage engagement
      - Make it specific to what's in the image
      
      Return in JSON format:
      {
        "captions": [
          {
            "type": "casual",
            "text": "hook + caption with emojis",
            "hashtags": ["hashtag1", "hashtag2"...],
            "emojis": "🎨✨📸"
          }
        ]
      }`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const contentType = (formData.get('contentType') as InstagramContentType) || 'post';
    
    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer and process with sharp
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Process image for Gemini (optimize size but maintain quality)
    const processedImage = await sharp(buffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    let captions: InstagramCaption[] = [];
    
    try {
      // Use Gemini Vision API
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = generateInstagramPrompt(contentType);
      
      const imageParts = [
        {
          inlineData: {
            data: processedImage.toString('base64'),
            mimeType: 'image/jpeg',
          },
        },
      ];

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      try {
        const parsed = JSON.parse(text);
        captions = parsed.captions || [];
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', parseError);
        // Fallback captions
        captions = generateFallbackCaptions(contentType);
      }
      
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      // Generate fallback captions
      captions = generateFallbackCaptions(contentType);
    }

    return NextResponse.json({
      captions,
      contentType,
      imageInfo: {
        size: file.size,
        type: file.type,
        name: file.name
      }
    });

  } catch (error) {
    console.error('Caption generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate caption' },
      { status: 500 }
    );
  }
}

function generateFallbackCaptions(contentType: InstagramContentType): InstagramCaption[] {
  const fallbacks = {
    post: [
      {
        type: 'casual' as const,
        text: "Just captured this moment ✨ What do you think?",
        hashtags: ['photography', 'moment', 'vibes', 'instagram'],
        emojis: '📸✨🎨'
      },
      {
        type: 'professional' as const,
        text: "Sharing this beautiful capture with you today.",
        hashtags: ['content', 'creative', 'inspiration', 'art'],
        emojis: '🎯📱💡'
      },
      {
        type: 'trendy' as const,
        text: "This hits different 💯 Send this to someone who needs to see it!",
        hashtags: ['mood', 'aesthetic', 'viral', 'trending'],
        emojis: '🔥💯⚡'
      },
      {
        type: 'minimal' as const,
        text: "Simply beautiful.",
        hashtags: ['minimal', 'clean', 'aesthetic'],
        emojis: '✨🤍'
      }
    ],
    story: [
      {
        type: 'casual' as const,
        text: "Mood rn ✨",
        hashtags: [],
        emojis: '✨😍'
      },
      {
        type: 'professional' as const,
        text: "Today's capture",
        hashtags: [],
        emojis: '📸💼'
      },
      {
        type: 'trendy' as const,
        text: "No caption needed 💯",
        hashtags: [],
        emojis: '💯🔥'
      },
      {
        type: 'minimal' as const,
        text: "✨",
        hashtags: [],
        emojis: '✨'
      }
    ],
    reel: [
      {
        type: 'casual' as const,
        text: "Wait for it... 👀 This moment was everything!",
        hashtags: ['reels', 'viral', 'moment', 'content'],
        emojis: '👀🔥✨'
      },
      {
        type: 'professional' as const,
        text: "Here's what I learned today. Save this for later!",
        hashtags: ['education', 'tips', 'content', 'value'],
        emojis: '💡🎯📚'
      },
      {
        type: 'trendy' as const,
        text: "POV: You see this and immediately hit save 💯",
        hashtags: ['pov', 'relatable', 'viral', 'mood'],
        emojis: '💯🎭⚡'
      },
      {
        type: 'minimal' as const,
        text: "Art in motion.",
        hashtags: ['art', 'aesthetic', 'reels'],
        emojis: '🎨🎬'
      }
    ]
  };
  
  return fallbacks[contentType] || fallbacks.post;
}
