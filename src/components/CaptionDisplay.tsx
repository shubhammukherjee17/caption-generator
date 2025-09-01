'use client';

import { useState } from 'react';
import { Copy, Check, Hash, Heart, MessageCircle, Share, Bookmark } from 'lucide-react';

type InstagramContentType = 'post' | 'story' | 'reel';

interface InstagramCaption {
  type: 'casual' | 'professional' | 'trendy' | 'minimal';
  text: string;
  hashtags: string[];
  emojis: string;
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
  minimal: { label: '✨ Minimal', color: 'gray', desc: 'Clean & aesthetic' }
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
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Your Instagram {result.contentType.charAt(0).toUpperCase() + result.contentType.slice(1)} Captions
        </h2>
        <p className="text-gray-600">
          Choose from 4 different styles - click to copy any caption
        </p>
      </div>

      {/* Captions Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {result.captions.map((caption, index) => {
          const typeInfo = captionTypeInfo[caption.type];
          const captionId = `${caption.type}-${index}`;
          const fullCaption = `${caption.text}${caption.hashtags.length > 0 ? '\n\n' + caption.hashtags.map(tag => `#${tag}`).join(' ') : ''}`;
          const isCopied = copiedStates[captionId];
          
          return (
            <div key={captionId} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Caption Header */}
              <div className={`px-6 py-4 bg-gradient-to-r from-${typeInfo.color}-50 to-${typeInfo.color}-100 border-b border-gray-100`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{typeInfo.label}</h3>
                    <p className="text-sm text-gray-600">{typeInfo.desc}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(fullCaption, captionId)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isCopied 
                        ? 'bg-green-100 text-green-700' 
                        : `bg-${typeInfo.color}-100 hover:bg-${typeInfo.color}-200 text-${typeInfo.color}-700`
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-sm font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-sm font-medium">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Instagram Mock-up */}
              <div className="p-6">
                {/* Instagram Post Preview */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-sm">your_account</p>
                      <p className="text-xs text-gray-500">Just now</p>
                    </div>
                  </div>
                  
                  {/* Caption Text */}
                  <div className="space-y-2">
                    <p className="text-gray-800 leading-relaxed">
                      {caption.text}
                    </p>
                    
                    {/* Emojis */}
                    {caption.emojis && (
                      <div className="text-lg">
                        {caption.emojis}
                      </div>
                    )}
                    
                    {/* Hashtags */}
                    {caption.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {caption.hashtags.map((hashtag, idx) => (
                          <span key={idx} className="text-blue-600 text-sm">#{hashtag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Instagram Actions */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <Heart className="w-5 h-5 text-gray-400" />
                      <MessageCircle className="w-5 h-5 text-gray-400" />
                      <Share className="w-5 h-5 text-gray-400" />
                    </div>
                    <Bookmark className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex justify-between text-sm text-gray-500">
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
      
      {/* Image Info */}
      <div className="bg-gray-50 rounded-lg p-4 mt-8">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Image Information</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">File:</span> {result.imageInfo.name}</p>
          <p><span className="font-medium">Size:</span> {formatFileSize(result.imageInfo.size)}</p>
          <p><span className="font-medium">Type:</span> {result.imageInfo.type}</p>
        </div>
      </div>
    </div>
  );
}
