'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

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

interface ImageUploaderProps {
  onCaptionGenerated: (result: CaptionResult) => void;
  contentType: InstagramContentType;
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
    <div className="w-full max-w-3xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 min-h-[320px] flex flex-col items-center justify-center
          bg-white shadow-sm
          ${isDragActive && !isDragReject ? 'border-blue-500 bg-blue-50 scale-[1.02]' : ''}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
          ${!isDragActive && !isDragReject ? 'border-gray-300 hover:border-gray-400 hover:shadow-lg hover:scale-[1.01]' : ''}
          ${isGenerating ? 'pointer-events-none opacity-75' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {isGenerating ? (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-ping opacity-20"></div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 mb-2">AI analyzing your image...</p>
              <p className="text-gray-600 font-medium">Creating 9 captions that match the exact mood & content</p>
            </div>
          </div>
        ) : uploadedImage ? (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative group">
              <Image
                src={uploadedImage}
                alt="Uploaded preview"
                width={350}
                height={220}
                className="max-w-full max-h-56 object-contain rounded-xl shadow-lg border border-gray-200 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="text-center bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-800 font-semibold mb-1">
                ✅ {contentType === 'post' ? 'Instagram Post' : 
                 contentType === 'story' ? 'Instagram Story' : 
                 'Instagram Reel'} captions generated!
              </p>
              <p className="text-green-700 text-sm">Upload another image to try again</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            {isDragActive ? (
              <>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-ping opacity-20"></div>
                </div>
                <p className="text-2xl font-bold text-blue-600">Drop the image here!</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mb-2 group-hover:from-blue-500 group-hover:to-purple-600 group-hover:scale-110 transition-all duration-300">
                  <ImageIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-center space-y-4">
                  <p className="text-2xl font-bold text-gray-900">
                    Drag & drop an image here
                  </p>
                  <p className="text-gray-600 text-lg">
                    or click to select from your device
                  </p>
                  <div className="flex items-center justify-center space-x-4 mt-6">
                    <div className="bg-gray-100 rounded-full px-4 py-2 border border-gray-200">
                      <p className="text-gray-700 text-sm font-medium">JPG, PNG, GIF, WebP</p>
                    </div>
                    <div className="bg-gray-100 rounded-full px-4 py-2 border border-gray-200">
                      <p className="text-gray-700 text-sm font-medium">Max 10MB</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm font-medium text-center">{error}</p>
        </div>
      )}
    </div>
  );
}
