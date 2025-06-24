import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Idea } from '../../types';

interface ProgressStatsProps {
  ideas: Idea[];
}

export function ProgressStats({ ideas }: ProgressStatsProps) {
  const totalIdeas = ideas.length;
  const completedIdeas = ideas.filter(idea => idea.status === 'Completed').length;
  const inProgressIdeas = ideas.filter(idea => 
    ['Reading', 'Drafting', 'Writing'].includes(idea.status)
  ).length;
  const exploringIdeas = ideas.filter(idea => idea.status === 'Exploring').length;

  const completionRate = totalIdeas > 0 ? Math.round((completedIdeas / totalIdeas) * 100) : 0;

  const stats = [
    {
      label: 'Total Ideas',
      value: totalIdeas,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'In Progress',
      value: inProgressIdeas,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Completed',
      value: completedIdeas,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}