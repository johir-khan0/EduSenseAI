import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, Tooltip as RechartsTooltip } from 'recharts';
import { User, Result, StudentSkill } from '../types';
import { View } from '../App';
import { mockStudentPerformanceHistory } from '../data';
import Card from './Card';
import Button from './Button';
import { SparklesIcon, TrendingUpIcon, TrendingDownIcon, BookOpenIcon, GlobeIcon, TargetIcon, CheckSquareIcon, FlameIcon, ArrowRightIcon, TrophyIcon, ClockIcon, BrainCircuitIcon } from './icons';
import RadialProgressBar from './RadialProgressBar';

interface DashboardViewProps {
  user: User;
  lastResult: Result | null;
  handleNavigate: (view: View, payload?: any) => void;
  studentSkills: StudentSkill[];
}

const CustomSparklineTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-surface/80 backdrop-blur-lg rounded-lg shadow-lg border border-white/20">
          <p className="text-xs text-neutral-dark font-semibold">{`Score: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
};

const SkillBar: React.FC<{ skill: StudentSkill, color: string }> = ({ skill, color }) => (
    <div className="flex items-center gap-3">
        <span className="w-28 text-sm font-semibold text-neutral-dark truncate">{skill.subject}</span>
        <div className="flex-1 bg-neutral-light/30 rounded-full h-2">
            <div className={`h-full rounded-full`} style={{ width: `${skill.score}%`, backgroundColor: color }}></div>
        </div>
        <div className="flex items-center w-16 text-sm font-bold text-neutral-extradark">
            {skill.score}%
            {skill.previousMastery !== undefined && (
                skill.score > skill.previousMastery ? 
                <TrendingUpIcon className="h-4 w-4 ml-1 text-success" /> : 
                <TrendingDownIcon className="h-4 w-4 ml-1 text-danger" />
            )}
        </div>
    </div>
);


const DashboardView: React.FC<DashboardViewProps> = ({ user, lastResult, handleNavigate, studentSkills }) => {
  const { level = 1, xp = 0, streakDays = 0 } = user;
  const xpToNextLevel = 100 + (level - 1) * 50;
  const levelProgress = (xp / xpToNextLevel) * 100;
  
  const skills = useMemo(() => [...studentSkills].sort((a, b) => b.score - a.score), [studentSkills]);
  const strengths = skills.slice(0, 3);
  const weaknesses = [...skills].sort((a,b) => a.score - b.score).slice(0, 3);

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-display text-neutral-extradark">Welcome, {user.name.split(' ')[0]}!</h1>
        <p className="text-md md:text-lg text-neutral-medium mt-2 max-w-2xl">Your mission control for learning excellence.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
              <Card>
                  <div className="flex items-center mb-6">
                      <TargetIcon className="h-7 w-7 text-primary mr-3" />
                      <h2 className="text-xl font-bold font-display text-neutral-extradark">Learning Focus</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div>
                          <h3 className="font-semibold text-neutral-dark mb-4">Top 3 Strengths</h3>
                          <div className="space-y-4">
                              {strengths.map(s => <SkillBar key={s.subject} skill={s} color="#059669" />)}
                          </div>
                      </div>
                       <div>
                          <h3 className="font-semibold text-neutral-dark mb-4">Top 3 Growth Areas</h3>
                          <div className="space-y-4">
                              {weaknesses.map(s => <SkillBar key={s.subject} skill={s} color="#D97706" />)}
                          </div>
                      </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-black/5">
                      <Button onClick={() => handleNavigate('dynamicLearningPath')} className="w-full sm:w-auto group">
                         Continue Learning Path
                         <ArrowRightIcon className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                  </div>
              </Card>
              <Card>
                  <div className="flex items-center mb-6">
                      <TrendingUpIcon className="h-7 w-7 text-primary mr-3" />
                      <h2 className="text-xl font-bold font-display text-neutral-extradark">Progress Snapshot</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="flex items-center">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mr-4 shrink-0">
                              <TrophyIcon className="h-6 w-6"/>
                          </div>
                          <div>
                              <p className="text-sm font-semibold text-neutral">Average Score</p>
                              <p className="text-2xl font-display font-bold text-neutral-extradark">{user.stats.averageScore.toFixed(1)}%</p>
                          </div>
                      </div>
                      <div className="flex items-center">
                          <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mr-4 shrink-0">
                              <ClockIcon className="h-6 w-6"/>
                          </div>
                          <div>
                              <p className="text-sm font-semibold text-neutral">Hours Studied</p>
                              <p className="text-2xl font-display font-bold text-neutral-extradark">{(user.stats.totalStudyTime / 60).toFixed(1)}</p>
                          </div>
                      </div>
                       <div className="flex items-center">
                          <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-success mr-4 shrink-0">
                              <CheckSquareIcon className="h-6 w-6"/>
                          </div>
                          <div>
                              <p className="text-sm font-semibold text-neutral">Assessments</p>
                              <p className="text-2xl font-display font-bold text-neutral-extradark">{user.stats.assessmentsCompleted}</p>
                          </div>
                      </div>
                  </div>
                  <div className="h-[120px]">
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={mockStudentPerformanceHistory} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                              <defs>
                                  <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4}/>
                                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <RechartsTooltip content={<CustomSparklineTooltip />} cursor={{ stroke: '#4F46E5', strokeWidth: 1, strokeDasharray: '3 3' }} />
                              <Area type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#progressGradient)" />
                          </AreaChart>
                      </ResponsiveContainer>
                  </div>
              </Card>
          </div>
          <div className="lg:col-span-2 space-y-6">
              <Card className="text-center">
                <h2 className="text-lg font-bold font-display text-neutral-extradark">Your Progress</h2>
                <div className="my-6">
                    <RadialProgressBar progress={levelProgress} size={140} strokeWidth={12}>
                       <div className="text-center">
                          <p className="text-xs font-semibold text-neutral">Level</p>
                          <p className="text-4xl font-display font-bold text-neutral-extradark">{level}</p>
                       </div>
                    </RadialProgressBar>
                </div>
                 <div className="text-sm font-semibold text-neutral-dark -mt-2 mb-6">
                      {xp} / {xpToNextLevel} XP to next level
                 </div>
                 <div className="grid grid-cols-2 gap-4 text-center border-t border-black/5 pt-4">
                      <div className="flex flex-col items-center gap-1">
                           <FlameIcon className="h-7 w-7 text-orange-500" />
                           <p className="text-lg font-display font-bold text-neutral-extradark">{streakDays}</p>
                           <p className="text-xs font-semibold text-neutral">Day Streak</p>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                           <CheckSquareIcon className="h-7 w-7 text-primary" />
                          <p className="text-lg font-display font-bold text-neutral-extradark">{user.stats.assessmentsCompleted}</p>
                          <p className="text-xs font-semibold text-neutral">Completed</p>
                      </div>
                 </div>
              </Card>
               <div>
                  <h2 className="text-xl font-bold font-display text-neutral-extradark mb-4">Quick Actions</h2>
                  <div className="space-y-4">
                      <div 
                          onClick={() => handleNavigate('aiGenerator')}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNavigate('aiGenerator'); }}
                          className="group p-5 rounded-2xl bg-gradient-to-br from-secondary to-cyan-400 text-white cursor-pointer transform hover:-translate-y-1 transition-transform duration-300 shadow-lg hover:shadow-secondary/40 flex items-center gap-4"
                      >
                          <div className="bg-white/20 p-3 rounded-xl">
                              <BrainCircuitIcon className="h-8 w-8"/>
                          </div>
                          <div>
                              <h3 className="font-bold text-lg">Practice a Weak Skill</h3>
                              <p className="text-sm text-white/80">Adaptive quiz on any topic.</p>
                          </div>
                      </div>
                      <div
                          onClick={() => handleNavigate('realLifeAppContext')}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNavigate('realLifeAppContext'); }}
                          className="group p-5 rounded-2xl bg-gradient-to-br from-primary to-indigo-400 text-white cursor-pointer transform hover:-translate-y-1 transition-transform duration-300 shadow-lg hover:shadow-primary/40 flex items-center gap-4"
                      >
                          <div className="bg-white/20 p-3 rounded-xl">
                              <GlobeIcon className="h-8 w-8"/>
                          </div>
                          <div>
                              <h3 className="font-bold text-lg">Explore Real-World Context</h3>
                              <p className="text-sm text-white/80">See how your skills apply.</p>
                          </div>
                      </div>
                  </div>
               </div>
          </div>
      </div>
    </>
  );
};

export default DashboardView;