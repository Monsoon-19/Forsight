import React, { useState } from 'react';
import axios from 'axios';
import { useMetrics } from '../hooks/useMetricsSimulator';
import { Activity, Lock, Mail } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useMetrics();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isRegister) {
        await axios.post('http://localhost:5000/api/auth/register', { email, password });
        setIsRegister(false);
        setError('Registration successful. Please login.');
      } else {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        login(res.data.accessToken);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-[#080f17] flex flex-col justify-center items-center font-sans">
      <div className="mb-8 flex items-center gap-2">
        <Activity className="w-8 h-8 text-[#4e8eff]" />
        <span className="text-2xl font-bold tracking-tight text-white">Foresight</span>
      </div>

      <div className="bg-[#151c24] border border-[#2a2e38] rounded-xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6 text-center">
          {isRegister ? 'Create an Account' : 'Sign in to Foresight'}
        </h2>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#8c909f] mb-1.5 uppercase">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8c909f] absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d141c] border border-[#2a2e38] rounded pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4e8eff] transition-colors"
                placeholder="operator@foresight.app"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8c909f] mb-1.5 uppercase">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8c909f] absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0d141c] border border-[#2a2e38] rounded pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4e8eff] transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#4e8eff] hover:bg-[#3a75db] text-white font-semibold py-2.5 rounded transition-colors mt-2"
          >
            {isRegister ? 'Register' : 'Authenticate'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#8c909f]">
          {isRegister ? 'Already have an account?' : 'Need an account?'}
          <button 
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="ml-2 text-[#4e8eff] hover:underline"
          >
            {isRegister ? 'Sign in' : 'Create one'}
          </button>
        </div>
      </div>
    </div>
  );
};
