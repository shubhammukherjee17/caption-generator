'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import StoryTemplates from './StoryTemplates';

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

interface ImageUploaderProps {
  onCaptionGenerated: (result: CaptionResult) => void;
  contentType: ContentType;
}

export default function ImageUploader({ onCaptionGenerated, contentType }: ImageUploaderProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateCaption = useCallback(async (file: File) => {
    setIsGenerating(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('contentType', contentType);

      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: CaptionResult = await response.json();
      onCaptionGenerated(result);
    } catch (err) {
      console.error('Error generating caption:', err);
      setError('Failed to generate caption. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [onCaptionGenerated, contentType]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setUploadedImage(previewUrl);
        
        // Generate caption
        generateCaption(file);
      }
    },
    [generateCaption]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB max
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      {/* Upload Input Section */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Your Image
          </label>
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
              transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center
              ${isDragActive && !isDragReject ? 'border-blue-500 bg-blue-50' : ''}
              ${isDragReject ? 'border-red-500 bg-red-50' : ''}
              ${!isDragActive && !isDragReject ? 'border-gray-300 hover:border-blue-400 hover:bg-blue-50' : ''}
              ${isGenerating ? 'pointer-events-none opacity-75' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            {isGenerating ? (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900 mb-1">Analyzing image...</p>
                  <p className="text-sm text-gray-600">Creating captions that match your content</p>
                </div>
              </div>
            ) : uploadedImage ? (
              <div className="flex flex-col items-center space-y-4">
                <Image
                  src={uploadedImage}
                  alt="Uploaded preview"
                  width={200}
                  height={150}
                  className="max-w-full max-h-32 object-contain rounded-lg"
                />
                <p className="text-sm text-green-600 font-medium">
                  ✓ Captions generated! Upload another to try again.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                {isDragActive ? (
                  <>
                    <Upload className="w-12 h-12 text-blue-500" />
                    <p className="text-lg font-medium text-blue-600">Drop the image here!</p>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        Drag & drop image or click to upload
                      </p>
                      <p className="text-sm text-gray-500">
                        JPG, PNG, GIF, WebP (max 10MB)
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Modern Options Display */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform
            </label>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-3 py-2">
              <span className="text-sm text-blue-900 font-medium">
                {contentType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caption Styles
            </label>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg px-3 py-2">
              <span className="text-sm text-green-900 font-medium">25+ Styles</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      {/* Story Templates for Instagram Stories */}
      {contentType === 'instagram-story' && (
        <div className="mt-6">
          <StoryTemplates 
            onTemplateSelect={(template) => {
              console.log('Selected template:', template);
              // Template selected - could integrate with caption generation
            }} 
          />
        </div>
      )}
    </div>
  );
}
