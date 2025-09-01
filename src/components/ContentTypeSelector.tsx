'use client';

import { Instagram, Camera, Video } from 'lucide-react';

type InstagramContentType = 'post' | 'story' | 'reel';

interface ContentTypeSelectorProps {
  selectedType: InstagramContentType;
  onTypeChange: (type: InstagramContentType) => void;
}

const contentTypes = [
  {
    id: 'post' as const,
    label: 'Instagram Post',
    description: 'Feed posts with engaging captions',
    icon: Instagram,
    color: 'blue',
    features: ['Hashtags', 'Long captions', 'Engagement focused']
  },
  {
    id: 'story' as const,
    label: 'Instagram Story',
    description: 'Quick, casual story content',
    icon: Camera,
    color: 'purple',
    features: ['Short text', 'Casual tone', 'Moment capture']
  },
  {
    id: 'reel' as const,
    label: 'Instagram Reel',
    description: 'Viral-ready reel captions',
    icon: Video,
    color: 'pink',
    features: ['Hook-driven', 'Call-to-action', 'Viral potential']
  }
];

export default function ContentTypeSelector({ selectedType, onTypeChange }: ContentTypeSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Choose Your Instagram Content Type
        </h2>
        <p className="text-gray-600">
          Select the type of Instagram content to get optimized captions
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        {contentTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => onTypeChange(type.id)}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-200 text-left
                ${isSelected 
                  ? `border-${type.color}-500 bg-${type.color}-50 shadow-lg scale-105` 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }
              `}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className={`absolute top-3 right-3 w-4 h-4 bg-${type.color}-500 rounded-full flex items-center justify-center`}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
              
              {/* Icon */}
              <div className={`
                inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4
                ${isSelected ? `bg-${type.color}-100` : 'bg-gray-100'}
              `}>
                <Icon className={`w-6 h-6 ${isSelected ? `text-${type.color}-600` : 'text-gray-600'}`} />
              </div>
              
              {/* Content */}
              <h3 className={`font-semibold text-lg mb-2 ${isSelected ? `text-${type.color}-900` : 'text-gray-800'}`}>
                {type.label}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {type.description}
              </p>
              
              {/* Features */}
              <div className="space-y-1">
                {type.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? `bg-${type.color}-400` : 'bg-gray-400'}`}></div>
                    <span className="text-xs text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
