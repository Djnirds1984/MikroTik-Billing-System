import React, { useState } from 'react';
import { Card } from './Card';
import { UsersIcon } from './icons/UsersIcon';
import { PlansIcon } from './icons/PlansIcon';
import { ReportsIcon } from './icons/ReportsIcon';
import { GoogleGenAI } from '@google/genai';
import { useRouterManagement } from '../contexts/RouterManagementContext';
import { useRouter } from '../contexts/RouterContext';

// Mock data for cards
const cardData = [
  {
    title: 'Total Users',
    value: '12,450',
    icon: <UsersIcon />,
    change: '+15.2%',
    changeType: 'positive' as 'positive' | 'negative',
  },
  {
    title: 'Active Plans',
    value: '3,890',
    icon: <PlansIcon />,
    change: '+5.7%',
    changeType: 'positive' as 'positive' | 'negative',
  },
  {
    title: 'Reports Generated',
    value: '1,204',
    icon: <ReportsIcon />,
    change: '-2.1%',
    changeType: 'negative' as 'positive' | 'negative',
  },
];

const WelcomeBanner: React.FC<{ onGenerate: () => void; loading: boolean }> = ({ onGenerate, loading }) => {
  return (
    <div className="bg-primary/20 p-6 rounded-xl border border-primary/30 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Welcome back, Admin!</h2>
        <p className="text-text-secondary mt-1">
          Click the button to generate a creative idea for your next marketing campaign using Gemini.
        </p>
      </div>
      <button 
        onClick={onGenerate}
        disabled={loading}
        className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed"
      >
        {loading ? 'Generating...' : 'Generate Idea'}
      </button>
    </div>
  );
};

const NoRouterSelected: React.FC = () => {
    const { setRoute } = useRouter();
    const { routers } = useRouterManagement();

    return (
        <div className="text-center py-20 bg-card rounded-xl border border-border">
            <h2 className="text-2xl font-bold text-text-primary">No Router Selected</h2>
            {routers.length > 0 ? (
                 <p className="text-text-secondary mt-2">Please select a router from the dropdown in the header to view its dashboard.</p>
            ) : (
                <>
                    <p className="text-text-secondary mt-2">You haven't configured any routers yet.</p>
                    <button 
                        onClick={() => setRoute('settings')}
                        className="mt-4 bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Go to Settings
                    </button>
                </>
            )}
        </div>
    );
};


export const Dashboard: React.FC = () => {
    const { activeRouter } = useRouterManagement();
    const [generatedIdea, setGeneratedIdea] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!process.env.API_KEY) {
            setError('API key is not set in environment variables.');
            return;
        }
        setLoading(true);
        setError(null);
        setGeneratedIdea('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: 'Generate a short, catchy marketing slogan for a new SaaS product that helps teams collaborate.',
            });
            setGeneratedIdea(response.text);
        } catch (e) {
            console.error(e);
            setError('Failed to generate content. See console for details.');
        } finally {
            setLoading(false);
        }
    };

    if (!activeRouter) {
        return <NoRouterSelected />;
    }

  return (
    <div className="space-y-6">
      <WelcomeBanner onGenerate={handleGenerate} loading={loading} />
      
      {error && <p className="text-red-500 bg-red-500/10 p-4 rounded-lg">{error}</p>}
      
      {generatedIdea && (
        <div className="bg-card p-4 rounded-lg border border-border">
          <h3 className="font-semibold text-text-primary mb-2">Generated Marketing Idea:</h3>
          <p className="text-text-primary italic">"{generatedIdea}"</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((data, index) => (
          <Card key={index} {...data} />
        ))}
      </div>
    </div>
  );
};