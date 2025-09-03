import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import sharp from 'sharp';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

type ContentType = 'instagram-post' | 'instagram-story' | 'instagram-reel' | 'linkedin-post' | 'twitter-thread' | 'facebook-post' | 'youtube-description' | 'tiktok-caption';

interface Caption {
  type: 'casual' | 'professional' | 'trendy' | 'minimal' | 'aesthetic' | 'bold' | 'poetic' | 'oneline' | 'oneword' | 
        'romantic' | 'funny' | 'motivational' | 'lifestyle' | 'travel' | 'food' | 'fitness' | 'business' | 
        'educational' | 'storytelling' | 'sarcastic' | 'emotional' | 'philosophical' | 'mysterious' | 'confident';
  text: string;
  hashtags: string[];
  emojis: string;
  emojiOnly: string;
}

function generateContentPrompt(contentType: ContentType): string {
  const basePrompt = `CRITICAL: Analyze this image DEEPLY and generate Instagram captions based on what you ACTUALLY SEE. 
  
  First, identify:
  - Main subject/content (person, object, scene, etc.)
  - Mood/vibe (aesthetic, sexy/hot, cute, bold, romantic, cool, artsy, devotional/spiritual, etc.)
  - Colors, lighting, composition
  - Setting/location
  - Any emotions or feelings conveyed
  - Style (glamorous, casual, artistic, fitness, fashion, devotional/spiritual, etc.)
  - DEVOTIONAL CONTENT: Check if image contains gods, goddesses, temples, spiritual symbols, religious ceremonies, prayers, meditation, or any spiritual/devotional content
  
  Then adapt ALL captions to match the SPECIFIC content, mood, and energy of THIS image.
  
  SPECIAL RULE FOR DEVOTIONAL IMAGES: If the image contains ANY devotional/spiritual content (gods, goddesses, temples, spiritual symbols, religious ceremonies, etc.), include beautiful Hindi shloks (verses) with English translations that relate to the spiritual theme shown in the image.`;
  
  switch (contentType) {
    case 'instagram-post':
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
      - If image is DEVOTIONAL/SPIRITUAL (gods, goddesses, temples, spiritual symbols, prayers, meditation, religious ceremonies) -> include beautiful Hindi shloks with English translations that relate to the spiritual content. Use peaceful, reverent, blessed language with spiritual emojis (🙏🕉️🪔✨🌺)
      - Match the ENERGY: high-energy images need exciting captions, calm images need peaceful captions, devotional images need sacred, respectful captions
      
      For emojis:
      - Use emojis that DIRECTLY relate to what's in the image
      - Match the mood: 🔥💋😘 for hot/sexy, 🌸✨💫 for aesthetic, 💪🏆⚡ for fitness, etc.
      - Create emoji-only versions that tell the image story through emojis alone
      
      Hashtags:
      - Use hashtags that match the actual image content and mood
      - Include trending tags for the specific niche/category shown
      - For devotional content, use spiritual hashtags like: #blessed, #spiritual, #devotion, #divine, #prayer, #faith, #peace, #meditation, #god, #temple
      
      EXAMPLE HINDI SHLOKS FOR DEVOTIONAL CONTENT:
      "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः" (May all be happy, may all be free from illness)
      "वसुधैव कुटुम्बकम्" (The world is one family)
      "सत्यमेव जयते" (Truth alone triumphs)
      "शांति शांति शांतिः" (Peace, peace, peace)
      
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
      
    case 'instagram-story':
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
      
    case 'instagram-reel':
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

    // New platform-specific prompts
    case 'linkedin-post':
      return `${basePrompt}
      
      Create 8 LinkedIn POST captions with professional focus:
      
      1. PROFESSIONAL - Executive-level, industry insights, thought leadership
      2. BUSINESS - Corporate growth, strategy, innovation, market trends
      3. MOTIVATIONAL - Career inspiration, professional development, success mindset
      4. EDUCATIONAL - Industry knowledge, skills development, learning insights
      5. LIFESTYLE - Work-life balance, professional lifestyle, networking
      6. STORYTELLING - Career journey, business stories, lessons learned
      7. CONFIDENT - Professional confidence, leadership presence, expertise
      8. ONELINE - Professional one-liner that captures business essence
      
      LinkedIn Rules:
      - Professional tone throughout
      - Focus on business value and insights
      - Use business-appropriate hashtags
      - Include calls for professional engagement
      - Target career-minded audience
      
      Return in JSON format with LinkedIn-appropriate content.`;

    case 'twitter-thread':
      return `${basePrompt}
      
      Create 6 Twitter THREAD starter captions:
      
      1. CASUAL - Conversational thread starter with personality
      2. TRENDY - Current topics, viral potential, zeitgeist
      3. EDUCATIONAL - Informative threads, how-to, insights
      4. FUNNY - Humorous takes, memes, entertaining content
      5. EMOTIONAL - Personal stories, relatable experiences
      6. BUSINESS - Industry insights, professional takes
      
      Twitter Rules:
      - Hook must grab attention immediately
      - Consider thread format (1/n structure)
      - Use trending hashtags when relevant
      - Encourage retweets and engagement
      - Character-efficient but impactful
      
      Return in JSON format.`;

    case 'facebook-post':
      return `${basePrompt}
      
      Create 6 Facebook POST captions for community engagement:
      
      1. CASUAL - Friendly, community-focused, conversational
      2. LIFESTYLE - Daily life, relatable moments, personal sharing
      3. STORYTELLING - Detailed narratives, personal experiences
      4. MOTIVATIONAL - Uplifting, inspiring, positive messaging
      5. FUNNY - Light-hearted, family-friendly humor
      6. EMOTIONAL - Heartfelt, meaningful, connection-focused
      
      Facebook Rules:
      - Longer format acceptable
      - Focus on community and relationships
      - Encourage meaningful comments
      - Family-friendly content
      - Build connections and conversations
      
      Return in JSON format.`;

    case 'youtube-description':
      return `${basePrompt}
      
      Create 5 YouTube DESCRIPTION captions:
      
      1. PROFESSIONAL - Polished video descriptions with value proposition
      2. EDUCATIONAL - Learning-focused, tutorial-style descriptions
      3. CASUAL - Conversational, personality-driven descriptions
      4. BUSINESS - Brand-focused, promotional, strategic
      5. STORYTELLING - Narrative descriptions that build anticipation
      
      YouTube Rules:
      - SEO-optimized descriptions
      - Include video value proposition
      - Encourage subscriptions and engagement
      - Consider searchability
      - Call-to-action for video interaction
      
      Return in JSON format.`;

    case 'tiktok-caption':
      return `${basePrompt}
      
      Create 6 TikTok CAPTION styles:
      
      1. TRENDY - Current trends, viral language, Gen-Z speak
      2. FUNNY - Humorous, entertaining, meme-worthy
      3. CASUAL - Relatable, everyday moments, authentic
      4. CONFIDENT - Bold statements, self-assured content
      5. MYSTERIOUS - Intriguing, curiosity-driven hooks
      6. AESTHETIC - Visually-focused, artistic descriptions
      
      TikTok Rules:
      - Match current trends and sounds
      - Use trending hashtags
      - Encourage duets and stitches
      - Appeal to younger demographics
      - Viral potential language
      
      Return in JSON format.`;

    default:
      return `${basePrompt}
      
      Create 9 general social media captions matching this image:
      1. CASUAL - Relatable and conversational
      2. PROFESSIONAL - Polished and informative
      3. TRENDY - Current and viral-worthy
      4. AESTHETIC - Artistic and dreamy
      5. MINIMAL - Clean and simple
      6. BOLD - Confident and powerful
      7. MOTIVATIONAL - Inspiring and uplifting
      8. FUNNY - Humorous and entertaining
      9. EMOTIONAL - Heartfelt and meaningful
      
      Return in JSON format.`;
  }
}

export async function POST(request: NextRequest) {
  console.log('📸 Caption generation request started');
  
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'API configuration error. Please check environment variables.' },
        { status: 500 }
      );
    }

    console.log('✅ Environment variables validated');
    
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const contentType = (formData.get('contentType') as ContentType) || 'instagram-post';
    
    if (!file) {
      console.error('❌ No image file provided');
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    console.log(`✅ Image file received: ${file.name} (${file.size} bytes, ${file.type})`);
    console.log(`✅ Content type: ${contentType}`);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
    if (!allowedTypes.includes(file.type)) {
      console.error(`❌ Unsupported file type: ${file.type}`);
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Please use JPEG, PNG, GIF, WebP, or BMP.` },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error(`❌ File too large: ${file.size} bytes (max: ${maxSize} bytes)`);
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    console.log('⚙️ Processing image with Sharp...');
    
    // Convert file to buffer and process with sharp
    let bytes, buffer, processedImage;
    try {
      bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
      
      // Process image for Gemini (optimize size but maintain quality)
      processedImage = await sharp(buffer)
        .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
        
      console.log(`✅ Image processed successfully (${processedImage.length} bytes)`);
    } catch (sharpError) {
      console.error('❌ Sharp processing error:', sharpError);
      return NextResponse.json(
        { error: 'Failed to process image. Please try with a different image format.' },
        { status: 500 }
      );
    }

    let captions: Caption[] = [];
    
    console.log('🤖 Calling Gemini API...');
    try {
      // Use Gemini Vision API
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = generateContentPrompt(contentType);
      console.log(`✅ Prompt generated for ${contentType}`);
      
      const imageParts = [
        {
          inlineData: {
            data: processedImage.toString('base64'),
            mimeType: 'image/jpeg',
          },
        },
      ];

      console.log('📤 Sending request to Gemini...');
      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();
      
      console.log('📥 Received response from Gemini');
      console.log(`Response length: ${text.length} characters`);
      
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
        console.log(`✅ Successfully parsed ${captions.length} captions`);
        
        // Validate captions structure
        if (!Array.isArray(captions) || captions.length === 0) {
          console.warn('⚠️ Invalid captions structure, using fallback');
          captions = generateFallbackCaptions(contentType);
        }
        
      } catch (parseError) {
        console.error('❌ Failed to parse Gemini response:', parseError);
        console.log('Raw response snippet:', text.substring(0, 500));
        // Fallback captions
        captions = generateFallbackCaptions(contentType);
        console.log('✅ Using fallback captions');
      }
      
    } catch (geminiError: unknown) {
      console.error('❌ Gemini API error:', geminiError);
      
      const errorDetails = {
        message: geminiError instanceof Error ? geminiError.message : 'Unknown error',
        status: (geminiError as Record<string, unknown>)?.status || 'Unknown',
        code: (geminiError as Record<string, unknown>)?.code || 'Unknown'
      };
      console.error('Error details:', errorDetails);
      
      // Generate fallback captions
      captions = generateFallbackCaptions(contentType);
      console.log('✅ Using fallback captions due to Gemini error');
    }

    console.log(`🎉 Successfully completed caption generation with ${captions.length} captions`);
    
    return NextResponse.json({
      captions,
      contentType,
      imageInfo: {
        size: file.size,
        type: file.type,
        name: file.name
      }
    });

  } catch (error: unknown) {
    console.error('🚫 Caption generation error:', error);
    
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack?.substring(0, 500) : 'No stack trace'
    };
    console.error('Error details:', errorDetails);
    
    // Always return fallback captions instead of an error
    const fallbackCaptions = generateFallbackCaptions('instagram-post');
    console.log(`⚙️ Returning ${fallbackCaptions.length} fallback captions due to error`);
    
    return NextResponse.json({
      captions: fallbackCaptions,
      contentType: 'instagram-post',
      imageInfo: {
        size: 0,
        type: 'fallback',
        name: 'fallback-captions'
      }
    });
  }
}

function generateFallbackCaptions(contentType: ContentType): Caption[] {
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
    // 7. Poetic (with devotional alternative)
    {
      type: 'poetic' as const,
      text: "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः 🙏✨\nMay all beings be happy, may all be free from illness. Finding peace in divine blessings.",
      hashtags: ['blessed', 'spiritual', 'peace', 'devotion', 'divine'],
      emojis: '🙏✨🪔',
      emojiOnly: '🙏✨🪔🕉️🌺💫'
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
    'instagram-post': expandedCaptions,
    'instagram-story': [
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
    'instagram-reel': [
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
    ],
    'linkedin-post': [
      {
        type: 'professional' as const,
        text: "Driving innovation through strategic thinking and collaborative leadership 💼🚀",
        hashtags: ['leadership', 'innovation', 'strategy', 'professional'],
        emojis: '💼🚀💡',
        emojiOnly: '💼🚀💡🎯✨'
      },
      {
        type: 'business' as const,
        text: "Market trends show the future belongs to adaptive organizations. What's your strategy?",
        hashtags: ['business', 'strategy', 'growth', 'leadership'],
        emojis: '📊📈💼',
        emojiOnly: '📊📈💼🎯🚀'
      }
    ],
    'twitter-thread': [
      {
        type: 'casual' as const,
        text: "Thread 🧵 Here's what I learned today that changed everything...",
        hashtags: ['thread', 'learning', 'insights', 'growth'],
        emojis: '🧵💡✨',
        emojiOnly: '🧵💡✨📚🔥'
      }
    ],
    'facebook-post': [
      {
        type: 'casual' as const,
        text: "Life's beautiful moments deserve to be shared with the people who matter most ❤️",
        hashtags: ['life', 'family', 'memories', 'gratitude'],
        emojis: '❤️🏠✨',
        emojiOnly: '❤️🏠✨😊💕'
      }
    ],
    'youtube-description': [
      {
        type: 'professional' as const,
        text: "In today's video, we explore [topic] with actionable insights you can apply immediately. Don't forget to subscribe for more content!",
        hashtags: ['youtube', 'tutorial', 'learning', 'subscribe'],
        emojis: '▶️📚💡',
        emojiOnly: '▶️📚💡🎯✨'
      }
    ],
    'tiktok-caption': [
      {
        type: 'trendy' as const,
        text: "This trend hits different when you add your own twist ✨ #fyp",
        hashtags: ['fyp', 'trend', 'viral', 'creative'],
        emojis: '✨🔥💫',
        emojiOnly: '✨🔥💫🎵💃'
      }
    ]
  };
  
  return fallbacks[contentType] || fallbacks['instagram-post'];
}
