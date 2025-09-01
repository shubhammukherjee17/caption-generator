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
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    textColor: 'text-blue-200',
    features: ['9 Caption Styles', '5 Hashtag Types', 'Engagement Focused']
  },
  {
    id: 'story' as const,
    label: 'Instagram Story',
    description: 'Quick, casual story content',
    icon: Camera,
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-500/20 to-pink-500/20',
    textColor: 'text-purple-200',
    features: ['Short & Sweet', 'Casual Tone', 'Moment Capture']
  },
  {
    id: 'reel' as const,
    label: 'Instagram Reel',
    description: 'Viral-ready reel captions',
    icon: Video,
    gradient: 'from-pink-500 to-red-500',
    bgGradient: 'from-pink-500/20 to-red-500/20',
    textColor: 'text-pink-200',
    features: ['Hook-Driven', 'Call-to-Action', 'Viral Potential']
  }
];

export default function ContentTypeSelector({ selectedType, onTypeChange }: ContentTypeSelectorProps) {
  return (
    <div className="w-full max-w-5xl mx-auto mb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Choose Your Content Type
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select your Instagram content type for AI-optimized captions
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {contentTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => onTypeChange(type.id)}
              className={`
                group relative p-8 rounded-2xl transition-all duration-300 text-left border
                ${isSelected 
                  ? 'bg-white border-blue-500 shadow-lg shadow-blue-500/10 scale-[1.02]' 
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg hover:scale-[1.02]'
                }
              `}
            >
              {/* Clean selection indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full">
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                  </div>
                </div>
              )}
              
              {/* Clean Icon */}
              <div className={`
                inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 transition-all duration-300
                ${isSelected 
                  ? `bg-gradient-to-r ${type.gradient} shadow-md group-hover:scale-110` 
                  : 'bg-gray-100 group-hover:bg-gray-200 group-hover:scale-110'
                }
              `}>
                <Icon className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-gray-600'} transition-colors duration-300`} />
              </div>
              
              {/* Clean Content */}
              <h3 className={`font-bold text-xl mb-3 transition-colors duration-300 ${
                isSelected ? 'text-gray-900' : 'text-gray-800'
              }`}>
                {type.label}
              </h3>
              <p className="text-gray-600 text-base mb-6 leading-relaxed">
                {type.description}
              </p>
              
              {/* Clean Features */}
              <div className="space-y-3">
                {type.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isSelected 
                        ? 'bg-blue-500' 
                        : 'bg-gray-400'
                    }`}></div>
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      isSelected ? 'text-gray-700' : 'text-gray-600'
                    }`}>{feature}</span>
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
