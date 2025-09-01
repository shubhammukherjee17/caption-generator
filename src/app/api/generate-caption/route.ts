import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import sharp from 'sharp';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

type InstagramContentType = 'post' | 'story' | 'reel';

interface InstagramCaption {
  type: 'casual' | 'professional' | 'trendy' | 'minimal' | 'aesthetic';
  text: string;
  hashtags: string[];
  emojis: string;
  emojiOnly: string;
}

function generateInstagramPrompt(contentType: InstagramContentType): string {
  const basePrompt = `Analyze this image and generate Instagram captions. Focus on what's actually visible in the image.`;
  
  switch (contentType) {
    case 'post':
      return `${basePrompt} Create 5 different Instagram POST captions:
      1. CASUAL - Fun, relatable, conversational tone with emojis
      2. PROFESSIONAL - Polished, brand-friendly, informative with subtle emojis
      3. TRENDY - Using current slang, trending phrases, Gen-Z style with trendy emojis
      4. AESTHETIC - Poetic, artistic, dreamy language with aesthetic emojis
      5. MINIMAL - Short, clean, impactful with minimal emojis
      
      For each caption:
      - Make it engaging and authentic
      - Include relevant emojis naturally integrated in the text
      - Suggest 5-8 relevant hashtags
      - Keep captions between 50-150 characters
      - Make it specific to what's in the image
      - Create a separate emoji-only version for each caption
      
      Return in JSON format:
      {
        "captions": [
          {
            "type": "casual",
            "text": "caption text with emojis naturally included",
            "hashtags": ["hashtag1", "hashtag2"...],
            "emojis": "🎨✨📸",
            "emojiOnly": "📸✨🎨😍🔥"
          }
        ]
      }`;
      
    case 'story':
      return `${basePrompt} Create 5 different Instagram STORY captions:
      1. CASUAL - Short, spontaneous, authentic with emojis
      2. PROFESSIONAL - Brief but polished with subtle emojis
      3. TRENDY - Current vibes, relatable with trendy emojis
      4. AESTHETIC - Dreamy, artistic, poetic with aesthetic emojis
      5. MINIMAL - Very short, clean with minimal emojis
      
      For each caption:
      - Keep it SHORT (15-40 characters)
      - Perfect for story overlay text
      - Include 2-4 relevant emojis naturally in text
      - Focus on the moment/feeling
      - Make it specific to what's in the image
      - Create a separate emoji-only version
      
      Return in JSON format:
      {
        "captions": [
          {
            "type": "casual",
            "text": "short story text with emojis",
            "hashtags": [],
            "emojis": "🎨✨",
            "emojiOnly": "😍✨📸🔥"
          }
        ]
      }`;
      
    case 'reel':
      return `${basePrompt} Create 5 different Instagram REEL captions:
      1. CASUAL - Hook + engaging question or statement with emojis
      2. PROFESSIONAL - Value-driven, educational hook with professional emojis
      3. TRENDY - Viral-worthy, shareable content with trendy emojis
      4. AESTHETIC - Artistic, dreamy hook with aesthetic emojis
      5. MINIMAL - Clean, impactful hook with minimal emojis
      
      For each caption:
      - Start with a STRONG hook
      - Include call-to-action
      - Use trending hashtags
      - 80-200 characters optimal
      - Encourage engagement
      - Include emojis naturally in text
      - Make it specific to what's in the image
      - Create a separate emoji-only version
      
      Return in JSON format:
      {
        "captions": [
          {
            "type": "casual",
            "text": "hook + caption with emojis included",
            "hashtags": ["hashtag1", "hashtag2"...],
            "emojis": "🎨✨📸",
            "emojiOnly": "🔥👀✨📸😍"
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
      
      // Parse the JSON response (handle markdown code blocks)
      try {
        let cleanedText = text.trim();
        
        // Remove markdown code block markers if present
        if (cleanedText.startsWith('```json')) {
          cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/```\s*$/, '');
        } else if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.replace(/^```\s*/, '').replace(/```\s*$/, '');
        }
        
        const parsed = JSON.parse(cleanedText);
        captions = parsed.captions || [];
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', parseError);
        console.log('Raw response:', text);
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
        emojis: '📸✨🎨',
        emojiOnly: '📸✨🎨😍💫🔥'
      },
      {
        type: 'professional' as const,
        text: "Sharing this beautiful capture with you today 📸",
        hashtags: ['content', 'creative', 'inspiration', 'art'],
        emojis: '🎯📱💡',
        emojiOnly: '📸🎯💼✨📱'
      },
      {
        type: 'trendy' as const,
        text: "This hits different 💯 Send this to someone who needs to see it!",
        hashtags: ['mood', 'aesthetic', 'viral', 'trending'],
        emojis: '🔥💯⚡',
        emojiOnly: '🔥💯⚡😍👀💫'
      },
      {
        type: 'aesthetic' as const,
        text: "Lost in the beauty of this moment 🌸✨",
        hashtags: ['aesthetic', 'dreamy', 'artistic', 'beauty', 'moments'],
        emojis: '🌸✨🤍',
        emojiOnly: '🌸✨🤍💫🦋🌙'
      },
      {
        type: 'minimal' as const,
        text: "Simply beautiful.",
        hashtags: ['minimal', 'clean', 'aesthetic'],
        emojis: '✨🤍',
        emojiOnly: '✨🤍'
      }
    ],
    story: [
      {
        type: 'casual' as const,
        text: "Mood rn ✨",
        hashtags: [],
        emojis: '✨😍',
        emojiOnly: '✨😍🔥📸'
      },
      {
        type: 'professional' as const,
        text: "Today's capture 📸",
        hashtags: [],
        emojis: '📸💼',
        emojiOnly: '📸💼✨'
      },
      {
        type: 'trendy' as const,
        text: "No caption needed 💯",
        hashtags: [],
        emojis: '💯🔥',
        emojiOnly: '💯🔥✨👀'
      },
      {
        type: 'aesthetic' as const,
        text: "Dreamy vibes 🌙",
        hashtags: [],
        emojis: '🌙✨',
        emojiOnly: '🌙✨🦋💫🌸'
      },
      {
        type: 'minimal' as const,
        text: "✨",
        hashtags: [],
        emojis: '✨',
        emojiOnly: '✨'
      }
    ],
    reel: [
      {
        type: 'casual' as const,
        text: "Wait for it... 👀 This moment was everything!",
        hashtags: ['reels', 'viral', 'moment', 'content'],
        emojis: '👀🔥✨',
        emojiOnly: '👀🔥✨📸😍💫'
      },
      {
        type: 'professional' as const,
        text: "Here's what I learned today 📚 Save this for later!",
        hashtags: ['education', 'tips', 'content', 'value'],
        emojis: '💡🎯📚',
        emojiOnly: '💡🎯📚✨💼'
      },
      {
        type: 'trendy' as const,
        text: "POV: You see this and immediately hit save 💯",
        hashtags: ['pov', 'relatable', 'viral', 'mood'],
        emojis: '💯🎭⚡',
        emojiOnly: '💯🎭⚡🔥👀✨'
      },
      {
        type: 'aesthetic' as const,
        text: "Poetry in motion 🌙✨",
        hashtags: ['aesthetic', 'art', 'dreamy', 'poetry'],
        emojis: '🌙✨🎨',
        emojiOnly: '🌙✨🎨🦋💫🌸'
      },
      {
        type: 'minimal' as const,
        text: "Art in motion.",
        hashtags: ['art', 'aesthetic', 'reels'],
        emojis: '🎨🎬',
        emojiOnly: '🎨🎬✨'
      }
    ]
  };
  
  return fallbacks[contentType] || fallbacks.post;
}
