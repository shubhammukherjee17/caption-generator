'use client';

import { useState } from 'react';
import { Instagram, Sparkles } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import CaptionDisplay from '@/components/CaptionDisplay';
import ContentTypeSelector from '@/components/ContentTypeSelector';

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

export default function Home() {
  const [captionResult, setCaptionResult] = useState<CaptionResult | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<InstagramContentType>('post');

  const handleCaptionGenerated = (result: CaptionResult) => {
    setCaptionResult(result);
  };

  const handleContentTypeChange = (type: InstagramContentType) => {
    setSelectedContentType(type);
    setCaptionResult(null); // Clear previous results when type changes
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Instagram Caption Generator
            </h1>
          </div>
          <p className="text-center text-gray-600 mt-2">
            AI analyzes your image and creates captions that match the exact mood, style & content
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Content Type Selection */}
          <ContentTypeSelector 
            selectedType={selectedContentType}
            onTypeChange={handleContentTypeChange}
          />

          {/* Upload Section */}
          <ImageUploader 
            onCaptionGenerated={handleCaptionGenerated}
            contentType={selectedContentType}
          />
          
          {/* Results Section */}
          <CaptionDisplay result={captionResult} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600 text-sm">
            <p>Powered by Google Gemini AI • Built with ❤️ by Shubham Mukherjee</p>
            <p className="mt-1">Create engaging Instagram content • Upload images responsibly</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
