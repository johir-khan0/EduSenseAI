
import React, { useState, useMemo } from 'react';
import { LearningRecommendation, StudentSkill } from '../types';
import { allMockRecommendations } from '../data';
import Card from './Card';
import Button from './Button';
import { SparklesIcon, LightbulbIcon, TrophyIcon } from './icons';
import RecommendationCard from './RecommendationCard';

interface DynamicLearningPathViewProps {
  studentSkills: StudentSkill[];
}

type ContentTypeFilter = 'all' | LearningRecommendation['contentType'];
type DifficultyFilter = 'all' | LearningRecommendation['difficulty'];

const FilterButton: React.FC<{ onClick: () => void; isActive: boolean; children: React.ReactNode }> = ({ onClick, isActive, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
      isActive
        ? 'bg-primary text-white shadow'
        : 'bg-surface/80 text-neutral-medium hover:bg-neutral-light/50'
    }`}
    aria-pressed={isActive}
  >
    {children}
  </button>
);


const DynamicLearningPathView: React.FC<DynamicLearningPathViewProps> = ({ studentSkills }) => {
    const [completedRecs, setCompletedRecs] = useState<string[]>([]);
    const [contentTypeFilter, setContentTypeFilter] = useState<ContentTypeFilter>('all');
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');

    const handleToggleComplete = (recId: string) => {
        setCompletedRecs(prev => 
        prev.includes(recId) ? prev.filter(id => id !== recId) : [...prev, recId]
        );
    };

    const priorityOrder = { high: 1, medium: 2, low: 3 };

    const personalizedRecommendations = useMemo(() => {
        if (!studentSkills || studentSkills.length === 0) return {};

        const weakSkills = studentSkills.filter(skill => skill.score < 80);

        if (weakSkills.length === 0) return {};

        const recommendationsByTopic: { [key: string]: { recs: LearningRecommendation[], score: number } } = {};
        
        weakSkills.forEach(skill => {
            let recsForTopic = allMockRecommendations
                .filter(rec => rec.skill === skill.subject)
                .filter(rec => contentTypeFilter === 'all' || rec.contentType === contentTypeFilter)
                .filter(rec => difficultyFilter === 'all' || rec.difficulty === difficultyFilter)
                .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            
            if (recsForTopic.length > 0) {
                recommendationsByTopic[skill.subject] = { recs: recsForTopic, score: skill.score };
            }
        });

        return recommendationsByTopic;
    }, [studentSkills, contentTypeFilter, difficultyFilter]);
    
    const hasRecommendations = Object.keys(personalizedRecommendations).length > 0;
    
    const hasAnyRecsBeforeFilter = useMemo(() => {
        if (!studentSkills) return false;
        const weakTopics = studentSkills.filter(skill => skill.score < 80).map(skill => skill.subject);
        return weakTopics.some(topic => allMockRecommendations.some(rec => rec.skill === topic));
    }, [studentSkills]);

    return (
        <>
            <header className="mb-8 text-center">
                 <div className="inline-block bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-full mb-4">
                    <SparklesIcon className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold font-display text-neutral-extradark">Recommendations Learning Path</h1>
                <p className="text-lg text-neutral-medium mt-2 max-w-2xl mx-auto">Your personalized journey to mastery, with content curated just for you.</p>
            </header>
            
            <div className="animate-fade-in">
                {hasAnyRecsBeforeFilter && (
                    <Card className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <h3 className="text-lg font-bold font-display text-neutral-extradark shrink-0">Filter Recommendations</h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <div className="flex items-center space-x-1">
                                    <span className="text-sm font-semibold mr-2">Type:</span>
                                    <FilterButton onClick={() => setContentTypeFilter('all')} isActive={contentTypeFilter === 'all'}>All</FilterButton>
                                    <FilterButton onClick={() => setContentTypeFilter('video')} isActive={contentTypeFilter === 'video'}>Video</FilterButton>
                                    <FilterButton onClick={() => setContentTypeFilter('article')} isActive={contentTypeFilter === 'article'}>Article</FilterButton>
                                    <FilterButton onClick={() => setContentTypeFilter('practice')} isActive={contentTypeFilter === 'practice'}>Practice</FilterButton>
                                </div>
                                <div className="w-px h-5 bg-neutral-light/50 hidden sm:block"></div>
                                <div className="flex items-center space-x-1">
                                    <span className="text-sm font-semibold mr-2">Difficulty:</span>
                                    <FilterButton onClick={() => setDifficultyFilter('all')} isActive={difficultyFilter === 'all'}>All</FilterButton>
                                    <FilterButton onClick={() => setDifficultyFilter('easy')} isActive={difficultyFilter === 'easy'}>Easy</FilterButton>
                                    <FilterButton onClick={() => setDifficultyFilter('medium')} isActive={difficultyFilter === 'medium'}>Medium</FilterButton>
                                    <FilterButton onClick={() => setDifficultyFilter('hard')} isActive={difficultyFilter === 'hard'}>Hard</FilterButton>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
                
                {hasAnyRecsBeforeFilter && (
                    <Card className="mb-8 bg-primary/5 border border-primary/20">
                        <div className="flex items-center">
                            <LightbulbIcon className="h-8 w-8 text-primary mr-4 shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold text-primary-dark">Your Personalized Focus Areas</h3>
                                <p className="text-neutral-dark mt-1">
                                    Based on your recent assessments, we've identified these key areas for growth. Focusing on these topics will help you improve your overall mastery.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}
            
                {!studentSkills || studentSkills.length === 0 ? (
                    <Card>
                        <p className="text-center text-neutral-medium p-8">Complete an assessment to get your personalized recommendations!</p>
                    </Card>
                ) : hasRecommendations ? (
                    <div className="space-y-8">
                        {Object.entries(personalizedRecommendations).map(([topic, data]) => (
                            <div key={topic}>
                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                    <h4 className="font-bold text-xl text-neutral-dark">
                                        To improve on <span className="text-primary">{topic}</span>
                                    </h4>
                                    <div
                                        className={`px-3 py-1 text-sm font-bold rounded-full ${
                                            // FIX: Cast `data` to its expected type to access properties.
                                            (data as { score: number }).score < 40 ? 'bg-danger/10 text-danger-dark' :
                                            // FIX: Cast `data` to its expected type to access properties.
                                            (data as { score: number }).score < 70 ? 'bg-warning/10 text-warning-dark' :
                                            'bg-success/10 text-success-dark'
                                        }`}
                                    >
                                        {/* FIX: Cast `data` to its expected type to access properties. */}
                                        Current Mastery: {(data as { score: number }).score}%
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* FIX: Cast `data` to its expected type to access properties. */}
                                    {((data as { recs: LearningRecommendation[] }).recs).map(rec => (
                                        <RecommendationCard 
                                            key={rec.id} 
                                            recommendation={rec}
                                            isCompleted={completedRecs.includes(rec.id)}
                                            onToggleComplete={() => handleToggleComplete(rec.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : hasAnyRecsBeforeFilter ? (
                    <Card>
                        <p className="text-center text-neutral-medium p-8">No recommendations match your current filters. Try a different selection!</p>
                    </Card>
                ) : (
                    <Card className="!bg-gradient-to-br from-success/20 to-green-300/20 text-center">
                        <div className="p-8">
                            <TrophyIcon className="h-16 w-16 text-success-dark mx-auto" />
                            <h4 className="text-2xl font-bold font-display text-neutral-extradark mt-4">Congratulations!</h4>
                            <p className="text-neutral-dark mt-2 max-w-md mx-auto">You've demonstrated strong proficiency across all topics in your last assessment. Keep up the fantastic work!</p>
                        </div>
                    </Card>
                )}
            </div>
        </>
    );
};

export default DynamicLearningPathView;
