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

  const scrollToGenerator = () => {
    const generatorSection = document.getElementById('generator');
    if (generatorSection) {
      generatorSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const scrollToTools = () => {
    const toolsSection = document.getElementById('tools');
    if (toolsSection) {
      toolsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header like QR Builders */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Instagram Caption Generator</span>
            </div>
            <nav className="hidden md:flex items-center">
              <button 
                onClick={scrollToGenerator}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section like QR Builders */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Generate Professional
              <br />
              <span className="text-blue-600">Instagram Captions</span>
              <br />
              for Everything
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Create custom Instagram captions for your posts, stories, and reels with our AI-powered platform. 
              Fast, flexible, and future-ready for content creators and businesses.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={scrollToGenerator}
                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
              >
                Start Creating
              </button>
              <button 
                onClick={scrollToTools}
                className="w-full sm:w-auto border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-lg"
              >
                Explore Tools
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Generator Section like QR Builders */}
      <section id="tools" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All Free Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create engaging Instagram content with our AI-powered caption generator. 
              No signups, no fees - just upload and generate!
            </p>
          </div>
          
          {/* Content Type Selection */}
          <ContentTypeSelector 
            selectedType={selectedContentType}
            onTypeChange={handleContentTypeChange}
          />
        </div>
      </section>

      {/* Generator Interface like QR Builders */}
      <section id="generator" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Upload */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedContentType === 'post' && 'Instagram Post Caption Generator'}
                {selectedContentType === 'story' && 'Instagram Story Caption Generator'}
                {selectedContentType === 'reel' && 'Instagram Reel Caption Generator'}
              </h3>
              <ImageUploader 
                onCaptionGenerated={handleCaptionGenerated}
                contentType={selectedContentType}
              />
            </div>
            
            {/* Right Column - Results */}
            <div>
              <CaptionDisplay result={captionResult} />
            </div>
          </div>
        </div>
      </section>

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
                  href="https://github.com/shubhammukherjee17" 
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
