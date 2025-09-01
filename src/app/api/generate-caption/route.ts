import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import sharp from 'sharp';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

type InstagramContentType = 'post' | 'story' | 'reel';

interface InstagramCaption {
  type: 'casual' | 'professional' | 'trendy' | 'minimal' | 'aesthetic' | 'bold' | 'poetic' | 'oneline' | 'oneword';
  text: string;
  hashtags: string[];
  emojis: string;
  emojiOnly: string;
}

function generateInstagramPrompt(contentType: InstagramContentType): string {
  const basePrompt = `CRITICAL: Analyze this image DEEPLY and generate Instagram captions based on what you ACTUALLY SEE. 
  
  First, identify:
  - Main subject/content (person, object, scene, etc.)
  - Mood/vibe (aesthetic, sexy/hot, cute, bold, romantic, cool, artsy, etc.)
  - Colors, lighting, composition
  - Setting/location
  - Any emotions or feelings conveyed
  - Style (glamorous, casual, artistic, fitness, fashion, etc.)
  
  Then adapt ALL captions to match the SPECIFIC content, mood, and energy of THIS image.`;
  
  switch (contentType) {
    case 'post':
      return `${basePrompt}
      
      Create 9 Instagram POST captions that PERFECTLY match this specific image:
      
      1. CASUAL - Match the actual vibe (fun/sexy/cute/bold/etc.) with relatable, conversational tone
      2. PROFESSIONAL - Adapt to image content (brand/lifestyle/fitness/fashion) with polished language
      3. TRENDY - Use current slang that fits the image mood (fire/slay/aesthetic/vibe/etc.)
      4. AESTHETIC - Poetic, dreamy language that matches the visual style and mood
      5. MINIMAL - Short, impactful words that capture the essence
      6. BOLD - Confident, powerful, attention-grabbing language that commands presence
      7. POETIC - Beautiful, lyrical, artistic language with metaphors and imagery
      8. ONELINE - Single impactful sentence that captures everything (10-25 words)
      9. ONEWORD - Single powerful word that embodies the entire image mood
      
      IMPORTANT RULES:
      - If image shows attractive person/model -> use confident, bold, alluring language
      - If image is artistic/aesthetic -> use dreamy, poetic, creative language
      - If image shows fitness/body -> use motivational, strong, empowering language
      - If image is romantic/couple -> use love, relationship, romantic language
      - If image is fashion/style -> use trendy, stylish, fashion-forward language
      - If image is nature/travel -> use adventure, wanderlust, peaceful language
      - Match the ENERGY: high-energy images need exciting captions, calm images need peaceful captions
      
      For emojis:
      - Use emojis that DIRECTLY relate to what's in the image
      - Match the mood: 🔥💋😘 for hot/sexy, 🌸✨💫 for aesthetic, 💪🏆⚡ for fitness, etc.
      - Create emoji-only versions that tell the image story through emojis alone
      
      Hashtags:
      - Use hashtags that match the actual image content and mood
      - Include trending tags for the specific niche/category shown
      
      Return in JSON format:
      {
        "captions": [
          {
            "type": "casual",
            "text": "caption matching actual image mood with relevant emojis",
            "hashtags": ["relevant", "to", "actual", "image", "content"],
            "emojis": "🔥💋✨",
            "emojiOnly": "🔥💋✨😍👀💫"
          }
        ]
      }`;
      
    case 'story':
      return `${basePrompt}
      
      Create 5 Instagram STORY captions that capture the EXACT mood of this image:
      
      1. CASUAL - Match the vibe: if sexy use "Feeling myself 🔥", if cute use "Soft vibes ✨", etc.
      2. PROFESSIONAL - Brief but match the content (fitness/work/lifestyle/etc.)
      3. TRENDY - Use phrases that match: "That's hot 🥵" for sexy, "Aesthetic af ✨" for artistic
      4. AESTHETIC - Dreamy words matching the visual: "Golden hour magic" for sunset, "Midnight mood" for dark
      5. MINIMAL - 1-3 words that capture essence: "Unstoppable" for confident, "Dreaming" for soft
      
      STORY RULES:
      - Keep SHORT (10-30 characters)
      - Match the IMAGE ENERGY exactly
      - Use emojis that represent what's actually shown
      - Perfect for overlay text on the actual image
      
      Return in JSON format:
      {
        "captions": [
          {
            "type": "casual",
            "text": "text matching image mood",
            "hashtags": [],
            "emojis": "relevant emojis",
            "emojiOnly": "story of image in emojis"
          }
        ]
      }`;
      
    case 'reel':
      return `${basePrompt}
      
      Create 5 Instagram REEL captions with STRONG hooks matching this specific image:
      
      1. CASUAL - Hook matching image: "Wait till you see this 👀" for reveals, "This confidence though 🔥" for bold poses
      2. PROFESSIONAL - Educational/value hook: "Here's how to get this look" for beauty, "The secret to this pose" for fitness
      3. TRENDY - Viral hooks: "POV: You look like this 🔥" for attractive, "Tell me you're iconic without telling me" for confident
      4. AESTHETIC - Artistic hooks: "When the light hits different ✨" for golden hour, "Ethereal energy 🌙" for dreamy
      5. MINIMAL - Powerful short hooks: "Main character energy" for confident, "Art" for aesthetic
      
      REEL RULES:
      - Hook must match the IMAGE VIBE exactly
      - If sexy/hot -> use confident, bold, fire language
      - If aesthetic -> use dreamy, magical, artistic language
      - If fitness -> use motivational, strong language
      - Include engagement: "Double tap if...", "Save this if...", "Tag someone who..."
      - Use hashtags matching actual image category
      
      Return in JSON format:
      {
        "captions": [
          {
            "type": "casual",
            "text": "hook matching actual image vibe + call to action",
            "hashtags": ["matching", "image", "category"],
            "emojis": "emojis representing image content",
            "emojiOnly": "emoji story of the image"
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
  // Comprehensive fallback captions covering all 9 caption types
  const expandedCaptions = [
    // 1. Casual
    {
      type: 'casual' as const,
      text: "Feeling myself today 🔥 Who else is ready to slay?",
      hashtags: ['confidence', 'selflove', 'mood', 'vibes'],
      emojis: '🔥💋😘',
      emojiOnly: '🔥💋😘😍👀💫'
    },
    // 2. Professional
    {
      type: 'professional' as const,
      text: "Elevating my standards, one step at a time 💪✨",
      hashtags: ['growth', 'professional', 'goals', 'success'],
      emojis: '💪🏆✨',
      emojiOnly: '💪🏆✨💼🔥'
    },
    // 3. Trendy
    {
      type: 'trendy' as const,
      text: "This hits different 💯 No cap, pure vibes only!",
      hashtags: ['trendy', 'viral', 'nocap', 'vibesonly'],
      emojis: '💯🔥⚡',
      emojiOnly: '💯🔥⚡😍👀'
    },
    // 4. Aesthetic
    {
      type: 'aesthetic' as const,
      text: "Lost in golden hour dreams and ethereal moments 🌅✨",
      hashtags: ['aesthetic', 'goldenhour', 'dreamy', 'ethereal'],
      emojis: '🌅✨🌙',
      emojiOnly: '🌅✨🌙💫🦋🌸'
    },
    // 5. Minimal
    {
      type: 'minimal' as const,
      text: "Pure magic ✨",
      hashtags: ['minimal', 'simple', 'clean'],
      emojis: '✨🤍',
      emojiOnly: '✨🤍'
    },
    // 6. Bold
    {
      type: 'bold' as const,
      text: "I AM THE MOMENT. I AM THE ENERGY. Period. 👑🔥",
      hashtags: ['bold', 'confident', 'powerful', 'energy'],
      emojis: '👑🔥⚡',
      emojiOnly: '👑🔥⚡💪💋💫'
    },
    // 7. Poetic
    {
      type: 'poetic' as const,
      text: "Like stardust dancing through twilight skies, some moments are simply meant to be captured 🌙✨",
      hashtags: ['poetic', 'artistic', 'lyrical', 'beauty'],
      emojis: '🌙✨🌌',
      emojiOnly: '🌙✨🌌🦋💫🌸'
    },
    // 8. One Line
    {
      type: 'oneline' as const,
      text: "Sometimes the best moments happen when you're just being yourself 😊✨",
      hashtags: ['authentic', 'genuine', 'moment', 'real'],
      emojis: '😊✨💖',
      emojiOnly: '😊✨💖🌸💫'
    },
    // 9. One Word
    {
      type: 'oneword' as const,
      text: "Unstoppable.",
      hashtags: ['oneword', 'power', 'strength'],
      emojis: '💪',
      emojiOnly: '💪🔥✨'
    }
  ];
  
  const fallbacks = {
    post: expandedCaptions,
    story: [
      {
        type: 'casual' as const,
        text: "Feeling myself 🔥",
        hashtags: [],
        emojis: '🔥😘',
        emojiOnly: '🔥😘💋😍'
      },
      {
        type: 'professional' as const,
        text: "Confidence level 💯",
        hashtags: [],
        emojis: '💯💪',
        emojiOnly: '💯💪🏆✨'
      },
      {
        type: 'trendy' as const,
        text: "That's hot 🥵",
        hashtags: [],
        emojis: '🥵🔥',
        emojiOnly: '🥵🔥👀💋'
      },
      {
        type: 'aesthetic' as const,
        text: "Golden hour magic ✨",
        hashtags: [],
        emojis: '✨🌅',
        emojiOnly: '✨🌅🌙💫🦋'
      },
      {
        type: 'minimal' as const,
        text: "Vibes ✨",
        hashtags: [],
        emojis: '✨😍',
        emojiOnly: '✨😍'
      }
    ],
    reel: [
      {
        type: 'casual' as const,
        text: "Wait... did I just serve this look? 🔥👀 Double tap if you agree!",
        hashtags: ['confidence', 'fire', 'viral', 'mood'],
        emojis: '🔥👀💋',
        emojiOnly: '🔥👀💋😘💯✨'
      },
      {
        type: 'professional' as const,
        text: "Confidence is the best outfit 💪 Wear it daily!",
        hashtags: ['confidence', 'motivation', 'selfcare', 'strong'],
        emojis: '💪🏆✨',
        emojiOnly: '💪🏆✨👑🔥'
      },
      {
        type: 'trendy' as const,
        text: "POV: You're main character energy 👑🔥 Tag someone iconic!",
        hashtags: ['maincharacter', 'iconic', 'energy', 'pov'],
        emojis: '👑🔥💯',
        emojiOnly: '👑🔥💯👀💋✨'
      },
      {
        type: 'aesthetic' as const,
        text: "When the light hits just right... pure magic ✨🌙",
        hashtags: ['aesthetic', 'dreamy', 'magic', 'artsy'],
        emojis: '✨🌙💫',
        emojiOnly: '✨🌙💫🦋🌸🎨'
      },
      {
        type: 'minimal' as const,
        text: "Unstoppable.",
        hashtags: ['power', 'strength', 'minimal'],
        emojis: '💪✨',
        emojiOnly: '💪✨🔥'
      }
    ]
  };
  
  return fallbacks[contentType] || fallbacks.post;
}
