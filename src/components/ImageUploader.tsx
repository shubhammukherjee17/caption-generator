'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

type InstagramContentType = 'post' | 'story' | 'reel';

interface InstagramCaption {
  type: 'casual' | 'professional' | 'trendy' | 'minimal' | 'aesthetic';
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
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200 min-h-[200px] flex flex-col items-center justify-center
          ${isDragActive && !isDragReject ? 'border-blue-400 bg-blue-50' : ''}
          ${isDragReject ? 'border-red-400 bg-red-50' : ''}
          ${!isDragActive && !isDragReject ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50' : ''}
          ${isGenerating ? 'pointer-events-none opacity-75' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {isGenerating ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-lg text-gray-600">Generating captions...</p>
          </div>
        ) : uploadedImage ? (
          <div className="flex flex-col items-center space-y-4">
            <Image
              src={uploadedImage}
              alt="Uploaded preview"
              width={300}
              height={192}
              className="max-w-full max-h-48 object-contain rounded-lg shadow-md"
            />
            <p className="text-sm text-gray-500">
              {contentType === 'post' ? 'Instagram Post' : 
               contentType === 'story' ? 'Instagram Story' : 
               'Instagram Reel'} captions generated! Upload another image to try again.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            {isDragActive ? (
              <>
                <Upload className="w-12 h-12 text-blue-500" />
                <p className="text-lg text-blue-600">Drop the image here!</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-gray-400" />
                <div className="space-y-2">
                  <p className="text-lg text-gray-600">
                    Drag & drop an image here, or click to select
                  </p>
                  <p className="text-sm text-gray-400">
                    Supports JPG, PNG, GIF, WebP (max 10MB)
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
