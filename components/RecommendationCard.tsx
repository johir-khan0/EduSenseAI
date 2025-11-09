import React from 'react';
import { LearningRecommendation } from '../types';
import Card from './Card';
import Button from './Button';
import { PlayCircleIcon, FileTextIcon, DumbbellIcon, ClockIcon, CheckIcon, FlameIcon } from './icons';

interface RecommendationCardProps {
  recommendation: LearningRecommendation;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

const contentTypeIcons = {
    video: <PlayCircleIcon className="h-5 w-5" />,
    article: <FileTextIcon className="h-5 w-5" />,
    practice: <DumbbellIcon className="h-5 w-5" />,
};

const difficultyColors = {
    easy: 'bg-success/20 text-success-dark',
    medium: 'bg-warning/20 text-warning-dark',
    hard: 'bg-danger/20 text-danger-dark',
};

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, isCompleted, onToggleComplete }) => {
  const { title, skill, contentType, duration, difficulty, thumbnail, priority } = recommendation;
  
  return (
    <Card className={`!p-0 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-within:-translate-y-1 focus-within:shadow-xl ${isCompleted ? 'grayscale opacity-70' : ''}`}>
        <div className="relative">
            <img src={thumbnail} alt={title} className="w-full h-40 object-cover rounded-t-2xl" />
            <div className={`absolute top-4 right-4 flex items-center bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-neutral-dark`}>
                {contentTypeIcons[contentType]}
                <span className="ml-1.5 capitalize">{contentType}</span>
            </div>
            {isCompleted && (
              <div className="absolute top-4 left-4 flex items-center bg-success/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-white">
                  <CheckIcon className="h-4 w-4 mr-1" />
                  <span>Completed</span>
              </div>
            )}
             {priority === 'high' && !isCompleted && (
              <div className="absolute bottom-4 left-4 flex items-center bg-danger/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-white">
                  <FlameIcon className="h-4 w-4 mr-1" />
                  <span>High Priority</span>
              </div>
            )}
        </div>
        <div className="p-5 flex flex-col flex-grow">
            <span className="text-sm font-semibold text-primary">{skill}</span>
            <h3 className={`font-bold text-neutral-extradark mt-1 flex-grow ${isCompleted ? 'line-through' : ''}`}>{title}</h3>
            <div className="flex justify-between items-center mt-4 text-sm text-neutral-medium">
                <span className={`px-2 py-1 rounded-md text-xs font-bold capitalize ${difficultyColors[difficulty]}`}>{difficulty}</span>
                <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>{duration} min</span>
                </div>
            </div>
            <Button 
              variant={isCompleted ? 'outline' : 'secondary'} 
              className="w-full mt-4 !py-2.5"
              onClick={onToggleComplete}
            >
                {isCompleted ? 'Review Again' : 'Mark as Complete'}
            </Button>
        </div>
    </Card>
  );
};

export default RecommendationCard;