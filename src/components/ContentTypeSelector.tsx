'use client';

import { Instagram, Camera, Video, Linkedin, Twitter, Facebook, Youtube, Music, Briefcase, MessageCircle } from 'lucide-react';

type ContentType = 'instagram-post' | 'instagram-story' | 'instagram-reel' | 'linkedin-post' | 'twitter-thread' | 'facebook-post' | 'youtube-description' | 'tiktok-caption';

interface ContentTypeSelectorProps {
  selectedType: ContentType;
  onTypeChange: (type: ContentType) => void;
}

const contentTypes = [
  {
    id: 'instagram-post' as const,
    label: 'Instagram Post',
    description: 'Feed posts with engaging captions',
    icon: Instagram,
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-200 hover:border-purple-300',
    features: ['25+ Caption Styles', 'Smart Hashtags', 'Emoji Integration', 'Story Formats']
  },
  {
    id: 'instagram-story' as const,
    label: 'Instagram Story',
    description: 'Quick, engaging story content',
    icon: Camera,
    gradient: 'from-orange-500 to-pink-500',
    bgGradient: 'from-orange-500/10 to-pink-500/10',
    borderColor: 'border-orange-200 hover:border-orange-300',
    features: ['Short & Sweet', 'Interactive Elements', 'Polls & Questions', 'Behind-the-scenes']
  },
  {
    id: 'instagram-reel' as const,
    label: 'Instagram Reel',
    description: 'Viral-ready reel captions',
    icon: Video,
    gradient: 'from-pink-500 to-red-500',
    bgGradient: 'from-pink-500/10 to-red-500/10',
    borderColor: 'border-pink-200 hover:border-pink-300',
    features: ['Hook-Driven', 'Call-to-Action', 'Viral Potential', 'Trending Audio']
  },
  {
    id: 'linkedin-post' as const,
    label: 'LinkedIn Post',
    description: 'Professional networking content',
    icon: Linkedin,
    gradient: 'from-blue-600 to-blue-700',
    bgGradient: 'from-blue-600/10 to-blue-700/10',
    borderColor: 'border-blue-200 hover:border-blue-300',
    features: ['Professional Tone', 'Industry Insights', 'Career Growth', 'Thought Leadership']
  },
  {
    id: 'twitter-thread' as const,
    label: 'Twitter Thread',
    description: 'Engaging Twitter conversations',
    icon: Twitter,
    gradient: 'from-blue-400 to-blue-600',
    bgGradient: 'from-blue-400/10 to-blue-600/10',
    borderColor: 'border-blue-200 hover:border-blue-300',
    features: ['Thread Structure', 'Viral Hooks', 'Character Limits', 'Engagement Focus']
  },
  {
    id: 'facebook-post' as const,
    label: 'Facebook Post',
    description: 'Community-focused content',
    icon: Facebook,
    gradient: 'from-blue-600 to-indigo-600',
    bgGradient: 'from-blue-600/10 to-indigo-600/10',
    borderColor: 'border-blue-200 hover:border-blue-300',
    features: ['Community Building', 'Detailed Stories', 'Event Promotion', 'Group Engagement']
  },
  {
    id: 'youtube-description' as const,
    label: 'YouTube Description',
    description: 'Video descriptions & titles',
    icon: Youtube,
    gradient: 'from-red-500 to-red-600',
    bgGradient: 'from-red-500/10 to-red-600/10',
    borderColor: 'border-red-200 hover:border-red-300',
    features: ['SEO Optimized', 'Timestamps', 'Call-to-Action', 'Channel Growth']
  },
  {
    id: 'tiktok-caption' as const,
    label: 'TikTok Caption',
    description: 'Trendy, viral TikTok content',
    icon: Music,
    gradient: 'from-black to-gray-800',
    bgGradient: 'from-black/10 to-gray-800/10',
    borderColor: 'border-gray-200 hover:border-gray-300',
    features: ['Trend-Aware', 'Gen-Z Language', 'Challenge Ready', 'Music Integration']
  }
];

export default function ContentTypeSelector({ selectedType, onTypeChange }: ContentTypeSelectorProps) {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Modern Platform Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Featured platforms first */}
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
