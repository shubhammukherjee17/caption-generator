'use client';

import { useState } from 'react';
import { Copy, Check, Hash, Heart, MessageCircle, Share, Bookmark } from 'lucide-react';

type InstagramContentType = 'post' | 'story' | 'reel';

interface InstagramCaption {
  type: 'casual' | 'professional' | 'trendy' | 'minimal' | 'aesthetic' | 'bold' | 'poetic' | 'oneline' | 'oneword';
  text: string;
  hashtags: string[];
  emojis: string;
  emojiOnly: string;
}

interface CaptionResult {
  captions: InstagramCaption[];
  contentType: InstagramContentType;
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
  casual: { label: '😎 Casual', color: 'blue', desc: 'Fun & relatable' },
  professional: { label: '💼 Professional', color: 'green', desc: 'Polished & informative' },
  trendy: { label: '🔥 Trendy', color: 'purple', desc: 'Current & viral-worthy' },
  aesthetic: { label: '🌸 Aesthetic', color: 'pink', desc: 'Dreamy & artistic' },
  minimal: { label: '✨ Minimal', color: 'gray', desc: 'Clean & simple' },
  bold: { label: '👑 Bold', color: 'red', desc: 'Confident & powerful' },
  poetic: { label: '🌙 Poetic', color: 'indigo', desc: 'Lyrical & artistic' },
  oneline: { label: '📝 One Line', color: 'teal', desc: 'Single impactful sentence' },
  oneword: { label: '💎 One Word', color: 'orange', desc: 'Powerful single word' }
};

export default function CaptionDisplay({ result }: CaptionDisplayProps) {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  if (!result) {
    return null;
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-12 space-y-8">
      {/* Clean Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 rounded-full px-6 py-3 mb-6">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-700 text-sm font-medium">AI Analysis Complete</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Your Instagram {result.contentType.charAt(0).toUpperCase() + result.contentType.slice(1)} Captions
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          AI analyzed your image and created 9 unique captions matching its exact mood & content
        </p>
      </div>

      {/* Captions Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {result.captions.map((caption, index) => {
          const typeInfo = captionTypeInfo[caption.type] || { label: '📱 Custom', color: 'slate', desc: 'AI generated' };
          const captionId = `${caption.type}-${index}`;
          const fullCaption = `${caption.text}${caption.hashtags.length > 0 ? '\n\n' + caption.hashtags.map(tag => `#${tag}`).join(' ') : ''}`;
          const isCopied = copiedStates[captionId];
          
          return (
            <div key={captionId} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
              {/* Clean Caption Header */}
              <div className={`px-6 py-5 bg-${typeInfo.color}-50 border-b border-gray-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{typeInfo.label}</h3>
                    <p className="text-gray-600 text-sm font-medium">{typeInfo.desc}</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => copyToClipboard(caption.emojiOnly, `${captionId}-emoji`)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                        copiedStates[`${captionId}-emoji`]
                          ? 'bg-green-100 text-green-700 shadow-sm' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow-sm'
                      }`}
                      title="Copy emoji-only version"
                    >
                      {copiedStates[`${captionId}-emoji`] ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="text-xs font-semibold">✨</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm">😍</span>
                          <span className="text-xs font-semibold">Emoji</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(fullCaption, captionId)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        isCopied 
                          ? 'bg-green-100 text-green-700 shadow-sm' 
                          : `bg-${typeInfo.color}-100 hover:bg-${typeInfo.color}-200 text-${typeInfo.color}-700 hover:shadow-sm`
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-sm font-semibold">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Clean Instagram Mock-up */}
              <div className="p-6">
                {/* Instagram Post Preview */}
                <div className="bg-gray-50 rounded-xl p-5 mb-4 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-sm"></div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">your_account</p>
                      <p className="text-xs text-gray-500">Just now</p>
                    </div>
                  </div>
                  
                  {/* Caption Text */}
                  <div className="space-y-3">
                    <p className="text-gray-900 leading-relaxed font-medium">
                      {caption.text}
                    </p>
                    
                    {/* Emojis */}
                    {caption.emojis && (
                      <div className="text-xl">
                        {caption.emojis}
                      </div>
                    )}
                    
                    {/* Hashtags */}
                    {caption.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {caption.hashtags.map((hashtag, idx) => (
                          <span key={idx} className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">#{hashtag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Instagram Actions */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-5">
                      <Heart className="w-6 h-6 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" />
                      <MessageCircle className="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" />
                      <Share className="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" />
                    </div>
                    <Bookmark className="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" />
                  </div>
                </div>
                
                {/* Clean Emoji Only Display */}
                {caption.emojiOnly && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-yellow-800">Emoji Only Version</span>
                      <button
                        onClick={() => copyToClipboard(caption.emojiOnly, `${captionId}-emoji-display`)}
                        className="text-xs px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-yellow-800 font-medium transition-colors border border-yellow-300"
                      >
                        {copiedStates[`${captionId}-emoji-display`] ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="text-3xl text-center py-3">
                      {caption.emojiOnly}
                    </div>
                  </div>
                )}
                
                {/* Clean Stats */}
                <div className="flex justify-between text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
                  <span>Caption: {caption.text.length} chars</span>
                  {caption.hashtags.length > 0 && (
                    <span className="flex items-center space-x-1">
                      <Hash className="w-3 h-3" />
                      <span>{caption.hashtags.length} hashtags</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Clean Image Info */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Image Information</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wide">FILE NAME</p>
            <p className="text-gray-900 font-semibold truncate">{result.imageInfo.name}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wide">FILE SIZE</p>
            <p className="text-gray-900 font-semibold">{formatFileSize(result.imageInfo.size)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wide">FILE TYPE</p>
            <p className="text-gray-900 font-semibold uppercase">{result.imageInfo.type}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
