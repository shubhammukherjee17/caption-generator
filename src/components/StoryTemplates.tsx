'use client';

import { useState } from 'react';
import { MessageCircle, BarChart3, HelpCircle, Camera, Lightbulb, Clock, ArrowUpDown, Zap } from 'lucide-react';

interface StoryTemplate {
  id: string;
  type: 'poll' | 'question' | 'quiz' | 'behind-the-scenes' | 'tutorial' | 'day-in-life' | 'before-after' | 'motivational';
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  template: string;
  interactiveElement?: string;
  examples: string[];
  gradient: string;
}

const storyTemplates: StoryTemplate[] = [
  {
    id: 'poll',
    type: 'poll',
    title: 'Interactive Poll',
    description: 'Engage audience with polls',
    icon: BarChart3,
    template: '[Question]? 🤔\nPoll: [Option A] vs [Option B]',
    interactiveElement: 'Add Poll Sticker',
    examples: [
      'Coffee or Tea? ☕🍵',
      'Beach or Mountains? 🏖️🏔️',
      'Morning or Night person? 🌅🌙'
    ],
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'question',
    type: 'question',
    title: 'Q&A Session',
    description: 'Invite questions from followers',
    icon: HelpCircle,
    template: '[Context] Ask me anything! 💬\n#AMA #Questions',
    interactiveElement: 'Add Question Sticker',
    examples: [
      'Working on new projects! Ask me anything about entrepreneurship 💼',
      'Fresh workout routine! Questions about fitness? 💪',
      'Cooking experiments! What should I try next? 👩‍🍳'
    ],
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'quiz',
    type: 'quiz',
    title: 'Quiz Challenge',
    description: 'Test followers knowledge',
    icon: Lightbulb,
    template: 'Quiz Time! 🧠\nCan you guess [question]?\nAnswer in comments! ⬇️',
    interactiveElement: 'Add Quiz Sticker',
    examples: [
      'Can you guess my favorite color? 🎨',
      'Where was this photo taken? 📍',
      'What time did I wake up today? ⏰'
    ],
    gradient: 'from-orange-500 to-red-500'
  },
  {
    id: 'behind-the-scenes',
    type: 'behind-the-scenes',
    title: 'Behind the Scenes',
    description: 'Show the process',
    icon: Camera,
    template: 'Behind the magic ✨\n[Process description]\n#BTS #Process',
    examples: [
      'Behind the magic ✨ 3 hours of editing for that perfect shot!',
      'The real setup vs the final photo 📸',
      'What really goes into creating content 💭'
    ],
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'tutorial',
    type: 'tutorial',
    title: 'Quick Tutorial',
    description: 'Share tips and how-tos',
    icon: Lightbulb,
    template: 'How to [skill/tip] 👩‍🏫\nStep 1: [instruction]\nSave this! 💾',
    examples: [
      'How to get this pose 📸 Step 1: Find good lighting',
      'Quick makeup tip ✨ Blend upwards for best results',
      'Photo editing hack 🎨 Increase shadows by 20%'
    ],
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'day-in-life',
    type: 'day-in-life',
    title: 'Day in My Life',
    description: 'Share daily moments',
    icon: Clock,
    template: '[Time] [Activity] 🌅\n#DayInMyLife #Routine',
    examples: [
      '6 AM Morning workout 💪 #DayInMyLife',
      '2 PM Lunch prep 🥗 Eating the rainbow today',
      '8 PM Wind down time 🛁 Self-care Sunday'
    ],
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'before-after',
    type: 'before-after',
    title: 'Before & After',
    description: 'Show transformations',
    icon: ArrowUpDown,
    template: 'Before ➡️ After\n[Transformation details]\n#Transformation #Progress',
    examples: [
      'Room makeover complete! ➡️ From chaos to calm',
      'Workout progress! ➡️ 6 months of consistency',
      'Art evolution ➡️ Practice makes perfect'
    ],
    gradient: 'from-teal-500 to-green-500'
  },
  {
    id: 'motivational',
    type: 'motivational',
    title: 'Daily Motivation',
    description: 'Inspire your audience',
    icon: Zap,
    template: '[Inspirational quote/message] ⚡\n#Motivation #MondayVibes',
    examples: [
      'Your only competition is who you were yesterday ⚡',
      'Small steps lead to big changes 🌱',
      'Believe in your journey, trust the process ✨'
    ],
    gradient: 'from-rose-500 to-pink-500'
  }
];

interface StoryTemplatesProps {
  onTemplateSelect: (template: StoryTemplate) => void;
}

export default function StoryTemplates({ onTemplateSelect }: StoryTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleTemplateSelect = (template: StoryTemplate) => {
    setSelectedTemplate(template.id);
    onTemplateSelect(template);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-700 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-2">
          Interactive Story Templates
        </h3>
        <p className="text-sm text-gray-600 dark:text-zinc-400">
          Choose from engaging story formats to boost interaction
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {storyTemplates.map((template) => {
          const Icon = template.icon;
          const isSelected = selectedTemplate === template.id;

          return (
            <div
              key={template.id}
              className={`
                relative p-4 border rounded-xl transition-all duration-300 cursor-pointer
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-zinc-600 hover:border-gray-300 dark:hover:border-zinc-500'
                }
              `}
              onClick={() => handleTemplateSelect(template)}
            >
              {/* Template Header */}
              <div className="flex items-center space-x-3 mb-3">
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center
                  ${isSelected 
                    ? `bg-gradient-to-r ${template.gradient}` 
                    : 'bg-gray-100 dark:bg-zinc-700'
                  }
                `}>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-600 dark:text-zinc-300'}`} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-zinc-100 text-sm">
                    {template.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    {template.description}
                  </p>
                </div>
              </div>

              {/* Interactive Element Badge */}
              {template.interactiveElement && (
                <div className="mb-3">
                  <span className="inline-block px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs font-medium rounded-md">
                    {template.interactiveElement}
                  </span>
                </div>
              )}

              {/* Example Preview */}
              <div className="text-xs text-gray-600 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800 rounded-lg p-2">
                {template.examples[0]}
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Template Details */}
      {selectedTemplate && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          {(() => {
            const template = storyTemplates.find(t => t.id === selectedTemplate);
            if (!template) return null;
            
            return (
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  {template.title} Template
                </h4>
                <div className="text-sm text-blue-800 dark:text-blue-200 bg-white dark:bg-zinc-800 rounded-lg p-3 font-mono">
                  {template.template}
                </div>
                <div className="mt-3">
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-2">More Examples:</p>
                  <div className="space-y-1">
                    {template.examples.slice(1).map((example, idx) => (
                      <p key={idx} className="text-xs text-blue-600 dark:text-blue-400">
                        • {example}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
