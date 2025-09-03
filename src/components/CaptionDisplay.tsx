'use client';

import { useState } from 'react';
import { Instagram } from 'lucide-react';

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

interface CaptionResult {
  captions: Caption[];
  contentType: ContentType;
  imageInfo: {
    size: number;
    type: string;
    name: string;
  };
}

interface CaptionDisplayProps {
  result: CaptionResult | null;
}

const captionTypeInfo = {
  // Original types
  casual: { label: '😎 Casual', color: 'blue', desc: 'Fun & relatable', gradient: 'from-blue-500 to-blue-600' },
  professional: { label: '💼 Professional', color: 'green', desc: 'Polished & informative', gradient: 'from-green-500 to-green-600' },
  trendy: { label: '🔥 Trendy', color: 'purple', desc: 'Current & viral-worthy', gradient: 'from-purple-500 to-purple-600' },
  aesthetic: { label: '🌸 Aesthetic', color: 'pink', desc: 'Dreamy & artistic', gradient: 'from-pink-500 to-pink-600' },
  minimal: { label: '✨ Minimal', color: 'gray', desc: 'Clean & simple', gradient: 'from-gray-500 to-gray-600' },
  bold: { label: '👑 Bold', color: 'red', desc: 'Confident & powerful', gradient: 'from-red-500 to-red-600' },
  poetic: { label: '🌙 Poetic', color: 'indigo', desc: 'Lyrical & artistic', gradient: 'from-indigo-500 to-indigo-600' },
  oneline: { label: '📝 One Line', color: 'teal', desc: 'Single impactful sentence', gradient: 'from-teal-500 to-teal-600' },
  oneword: { label: '💎 One Word', color: 'orange', desc: 'Powerful single word', gradient: 'from-orange-500 to-orange-600' },
  
  // New expanded types
  romantic: { label: '💕 Romantic', color: 'rose', desc: 'Love & relationships', gradient: 'from-rose-500 to-rose-600' },
  funny: { label: '😂 Funny', color: 'yellow', desc: 'Humorous & entertaining', gradient: 'from-yellow-500 to-yellow-600' },
  motivational: { label: '💪 Motivational', color: 'emerald', desc: 'Inspiring & uplifting', gradient: 'from-emerald-500 to-emerald-600' },
  lifestyle: { label: '🌿 Lifestyle', color: 'green', desc: 'Daily life & wellness', gradient: 'from-green-500 to-emerald-500' },
  travel: { label: '✈️ Travel', color: 'sky', desc: 'Adventure & wanderlust', gradient: 'from-sky-500 to-sky-600' },
  food: { label: '🍽️ Food', color: 'amber', desc: 'Culinary & delicious', gradient: 'from-amber-500 to-amber-600' },
  fitness: { label: '🏋️ Fitness', color: 'orange', desc: 'Health & strength', gradient: 'from-orange-500 to-red-500' },
  business: { label: '📊 Business', color: 'slate', desc: 'Corporate & growth', gradient: 'from-slate-500 to-slate-600' },
  educational: { label: '📚 Educational', color: 'blue', desc: 'Learning & insights', gradient: 'from-blue-600 to-indigo-600' },
  storytelling: { label: '📖 Storytelling', color: 'violet', desc: 'Narrative & engaging', gradient: 'from-violet-500 to-violet-600' },
  sarcastic: { label: '😏 Sarcastic', color: 'zinc', desc: 'Witty & clever', gradient: 'from-zinc-500 to-zinc-600' },
  emotional: { label: '💭 Emotional', color: 'purple', desc: 'Deep & heartfelt', gradient: 'from-purple-600 to-purple-700' },
  philosophical: { label: '🧠 Philosophical', color: 'indigo', desc: 'Thoughtful & profound', gradient: 'from-indigo-600 to-indigo-700' },
  mysterious: { label: '🌚 Mysterious', color: 'gray', desc: 'Intriguing & enigmatic', gradient: 'from-gray-600 to-gray-700' },
  confident: { label: '💯 Confident', color: 'red', desc: 'Self-assured & bold', gradient: 'from-red-600 to-red-700' }
};

export default function CaptionDisplay({ result }: CaptionDisplayProps) {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const copyToClipboard = async (text: string, id: string) => {
    try {
      // Modern clipboard API (preferred)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setCopiedStates(prev => ({ ...prev, [id]: true }));
        setTimeout(() => {
          setCopiedStates(prev => ({ ...prev, [id]: false }));
        }, 2000);
        return;
      }
      
      // Fallback for mobile and older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Make the textarea invisible but not display: none
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      textArea.style.opacity = '0';
      textArea.setAttribute('readonly', '');
      textArea.style.pointerEvents = 'none';
      
      document.body.appendChild(textArea);
      
      // Focus and select the text
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, 99999); // For mobile devices
      
      // Execute copy command
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopiedStates(prev => ({ ...prev, [id]: true }));
        setTimeout(() => {
          setCopiedStates(prev => ({ ...prev, [id]: false }));
        }, 2000);
      } else {
        throw new Error('Copy command failed');
      }
      
    } catch (err) {
      console.error('Failed to copy text: ', err);
      
      // Last resort: show alert with text to copy manually
      if (text.length < 300) {
        alert(`Copy this text:\n\n${text}`);
      } else {
        alert('Copy failed. Please try selecting the text manually.');
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!result) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Instagram className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Generated Captions</h3>
          <p className="text-gray-600">Upload an image to see AI-generated captions appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Your Generated Captions</h3>
          <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-700 text-xs font-medium">Generated</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          {result.captions.length} captions generated for your {result.contentType}
        </p>
      </div>

      {/* Generated Captions */}
      <div className="space-y-4">
        {result.captions.map((caption, index) => {
          const typeInfo = captionTypeInfo[caption.type] || { label: '📱 Custom', color: 'slate', desc: 'AI generated' };
          const captionId = `${caption.type}-${index}`;
          const fullCaption = `${caption.text}${caption.hashtags.length > 0 ? '\n\n' + caption.hashtags.map(tag => `#${tag}`).join(' ') : ''}`;
          const isCopied = copiedStates[captionId];
          
          return (
            <div key={captionId} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              {/* Caption Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-${typeInfo.color}-100 rounded-lg flex items-center justify-center`}>
                    <span className="text-sm">{typeInfo.label.split(' ')[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{typeInfo.label}</h4>
                    <p className="text-sm text-gray-500">{typeInfo.desc}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 sm:gap-0">
                  <button
                    onClick={() => copyToClipboard(caption.emojiOnly, `${captionId}-emoji`)}
                    className={`px-3 py-2 sm:py-1.5 rounded-lg text-xs font-medium transition-all duration-300 touch-manipulation select-none ${
                      copiedStates[`${captionId}-emoji`]
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700'
                    }`}
                    type="button"
                  >
                    {copiedStates[`${captionId}-emoji`] ? '✓ Copied' : 'Copy Emoji'}
                  </button>
                  <button
                    onClick={() => copyToClipboard(fullCaption, captionId)}
                    className={`px-4 py-2 sm:py-1.5 rounded-lg text-xs font-medium transition-all duration-300 touch-manipulation select-none ${
                      isCopied 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                    }`}
                    type="button"
                  >
                    {isCopied ? '✓ Copied' : 'Copy Caption'}
                  </button>
                </div>
              </div>
              
              {/* Caption Content */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-900 leading-relaxed mb-3">{caption.text}</p>
                {caption.emojis && (
                  <div className="text-lg mb-2">{caption.emojis}</div>
                )}
                {caption.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {caption.hashtags.map((hashtag, idx) => (
                      <span key={idx} className="text-blue-600 text-sm">#{hashtag}</span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Emoji Only */}
              {caption.emojiOnly && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-yellow-800 uppercase tracking-wide">Emoji Only</span>
                  </div>
                  <div className="text-2xl text-center">{caption.emojiOnly}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Image Info */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-4">Image Information</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-1 font-medium">Filename</p>
            <p className="text-gray-900 truncate">{result.imageInfo.name}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1 font-medium">Size</p>
            <p className="text-gray-900">{formatFileSize(result.imageInfo.size)}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1 font-medium">Type</p>
            <p className="text-gray-900 uppercase">{result.imageInfo.type}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
