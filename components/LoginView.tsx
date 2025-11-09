import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { BookOpenIcon, UserIcon, LockIcon, BriefcaseIcon } from './icons';

interface LoginViewProps {
  onLogin: (user: { email: string, pass: string, role: 'student' | 'teacher' }) => void;
  onStudentSignup: (signupData: { name: string, email: string, pass: string }) => void;
}

// --- Sub-components for each view ---

const RoleSelect: React.FC<{ onSelectRole: (role: 'student' | 'teacher') => void }> = ({ onSelectRole }) => (
    <div className="space-y-6">
        <Card className="text-center hover:!shadow-lg hover:border-primary/50 border-2 border-transparent transition-all duration-300 cursor-pointer" padding="none" onClick={() => onSelectRole('student')}>
            <div className="p-8">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                    <UserIcon className="w-8 h-8"/>
                </div>
                <h3 className="text-2xl font-bold font-display text-neutral-extradark mt-4">I am a Student</h3>
                <p className="text-neutral-medium mt-1">Access your personal learning dashboard.</p>
            </div>
        </Card>
        <Card className="text-center hover:!shadow-lg hover:border-secondary/50 border-2 border-transparent transition-all duration-300 cursor-pointer" padding="none" onClick={() => onSelectRole('teacher')}>
            <div className="p-8">
                <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto">
                    <BriefcaseIcon className="w-8 h-8"/>
                </div>
                <h3 className="text-2xl font-bold font-display text-neutral-extradark mt-4">I am a Teacher</h3>
                <p className="text-neutral-medium mt-1">Manage classrooms & track student progress.</p>
            </div>
        </Card>
    </div>
);

const StudentLogin: React.FC<{ onLogin: (creds: any) => void, onSwitchToSignup: () => void, onBack: () => void }> = ({ onLogin, onSwitchToSignup, onBack }) => {
    const [email, setEmail] = useState('rahul.sharma@example.com');
    const [password, setPassword] = useState('password');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin({ email, pass: password, role: 'student' });
    };

    return (
        <Card>
            <button onClick={onBack} className="text-sm font-semibold text-primary mb-4">&larr; Back to role selection</button>
            <h2 className="text-2xl font-bold text-neutral-extradark text-center">Student Login</h2>
            <p className="text-neutral text-center mt-2 mb-8">Sign in to continue your learning journey.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-dark">Email Address</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-surface/50 border border-neutral-light/50 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="password"className="block text-sm font-medium text-neutral-dark">Password</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-surface/50 border border-neutral-light/50 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm" />
                </div>
                <Button type="submit" className="w-full !py-3">Sign In</Button>
            </form>
            <p className="text-center text-sm mt-6">Don't have an account? <button type="button" onClick={onSwitchToSignup} className="font-semibold text-primary hover:underline">Sign Up</button></p>
        </Card>
    );
};

const StudentSignup: React.FC<{ onSignup: (data: any) => void, onBack: () => void }> = ({ onSignup, onBack }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSignup({ name, email, pass: password });
    };
    
    return (
        <Card>
            <button onClick={onBack} className="text-sm font-semibold text-primary mb-4">&larr; Back to login</button>
            <h2 className="text-2xl font-bold text-neutral-extradark text-center">Create Student Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="block w-full px-4 py-3 bg-surface/50 border border-neutral-light/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="block w-full px-4 py-3 bg-surface/50 border border-neutral-light/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="block w-full px-4 py-3 bg-surface/50 border border-neutral-light/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <Button type="submit" variant="primary" className="w-full !py-3">Create Account</Button>
            </form>
        </Card>
    );
};

const TeacherLogin: React.FC<{ onLogin: (creds: any) => void, onSwitchToSignup: () => void, onBack: () => void }> = ({ onLogin, onSwitchToSignup, onBack }) => {
    const [email, setEmail] = useState('priya.singh@example.com');
    const [password, setPassword] = useState('password123');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin({ email, pass: password, role: 'teacher' });
    };

    return (
        <Card>
            <button onClick={onBack} className="text-sm font-semibold text-secondary mb-4">&larr; Back to role selection</button>
            <h2 className="text-2xl font-bold text-neutral-extradark text-center">Teacher Login</h2>
            <p className="text-neutral text-center mt-2 mb-8">Access your classroom management dashboard.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="teacher-email" className="block text-sm font-medium text-neutral-dark">Email Address</label>
                    <input id="teacher-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-surface/50 border border-neutral-light/50 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="teacher-password"className="block text-sm font-medium text-neutral-dark">Password</label>
                    <input id="teacher-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-surface/50 border border-neutral-light/50 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent sm:text-sm" />
                </div>
                <Button type="submit" variant="secondary" className="w-full !py-3">Sign In</Button>
            </form>
             <p className="text-center text-sm mt-6">Don't have an account? <button type="button" onClick={onSwitchToSignup} className="font-semibold text-secondary hover:underline">Sign Up</button></p>
        </Card>
    );
};

const TeacherSignup: React.FC<{ onLogin: (creds: any) => void, onBack: () => void }> = ({ onLogin, onBack }) => {
    const [name, setName] = useState('');
    const [institution, setInstitution] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // In a real app, this would hit a registration endpoint.
      // Here we'll just log them in as a new teacher.
      alert(`Welcome, ${name}! Your teacher account has been created.`);
      onLogin({email: email, pass: password, role: 'teacher'});
    };

    return (
        <Card>
            <button onClick={onBack} className="text-sm font-semibold text-secondary mb-4">&larr; Back to login</button>
            <h2 className="text-2xl font-bold text-neutral-extradark text-center">Create Teacher Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="block w-full px-4 py-3 bg-surface/50 border border-neutral-light/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
                <input type="text" placeholder="Institution Name" value={institution} onChange={e => setInstitution(e.target.value)} required className="block w-full px-4 py-3 bg-surface/50 border border-neutral-light/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
                <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="block w-full px-4 py-3 bg-surface/50 border border-neutral-light/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="block w-full px-4 py-3 bg-surface/50 border border-neutral-light/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
                <Button type="submit" variant="secondary" className="w-full !py-3">Create Account</Button>
            </form>
        </Card>
    );
};


const LoginView: React.FC<LoginViewProps> = ({ onLogin, onStudentSignup }) => {
  const [viewMode, setViewMode] = useState<'role-select' | 'student-login' | 'student-signup' | 'teacher-login' | 'teacher-signup'>('role-select');

  const renderContent = () => {
      switch (viewMode) {
          case 'student-login': 
            return <StudentLogin 
                onLogin={onLogin} 
                onSwitchToSignup={() => setViewMode('student-signup')}
                onBack={() => setViewMode('role-select')}
            />;
          case 'student-signup': 
            return <StudentSignup
                onSignup={onStudentSignup}
                onBack={() => setViewMode('student-login')}
            />;
          case 'teacher-login': 
            return <TeacherLogin 
                onLogin={onLogin}
                onSwitchToSignup={() => setViewMode('teacher-signup')}
                onBack={() => setViewMode('role-select')}
            />;
          case 'teacher-signup':
            return <TeacherSignup
                onLogin={onLogin} // Simplified: signup logs in directly
                onBack={() => setViewMode('teacher-login')}
            />;
          case 'role-select':
          default:
            return <RoleSelect onSelectRole={(role) => setViewMode(role === 'student' ? 'student-login' : 'teacher-login')} />;
      }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in-up">
      <div className="max-w-md w-full">
        <div className="flex flex-col justify-center items-center mb-8">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-full">
              <BookOpenIcon className="h-10 w-10 text-primary" />
            </div>
            <h1 className="mt-4 text-4xl font-display font-bold text-neutral-extradark">EduSense AI</h1>
            <p className="text-neutral-medium text-center mt-2">Your personalized AI learning partner.</p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default LoginView;