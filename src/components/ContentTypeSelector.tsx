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
    <div className="max-w-5xl mx-auto">
      {/* QR Builders Style Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {contentTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <div
              key={type.id}
              className={`
                relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden
                ${isSelected 
                  ? 'border-blue-500 shadow-xl shadow-blue-500/10' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
                }
              `}
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                    ${isSelected 
                      ? `bg-gradient-to-r ${type.gradient}` 
                      : 'bg-gray-100'
                    }
                  `}>
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{type.label}</h3>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </div>
                </div>
              </div>
              
              {/* Card Content */}
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  {type.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => onTypeChange(type.id)}
                  className={`
                    w-full py-3 px-4 rounded-lg font-medium transition-all duration-300
                    ${isSelected 
                      ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
