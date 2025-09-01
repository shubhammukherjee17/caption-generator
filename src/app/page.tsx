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
    <div className="min-h-screen bg-gray-50">
      {/* Clean Modern Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Instagram className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Instagram Caption Generator
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              AI analyzes your image and creates captions that match the exact mood, style & content
            </p>
          </div>
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

      {/* Clean Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm font-medium">Powered by Google Gemini AI • Built with Next.js and TypeScript</p>
            <p className="mt-2 text-sm">Create engaging Instagram content • Upload images responsibly</p>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs">
                Built with{' '}
                <span className="text-red-500 text-sm">❤️</span>
                {' '}by{' '}
                <a 
                  href="https://github.com/shubham-mukherjee" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline underline-offset-2"
                >
                  Shubham Mukherjee
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
