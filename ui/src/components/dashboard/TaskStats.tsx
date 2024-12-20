import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';

export const TaskStats = () => {
  const tasks = useTaskStore((state) => state.tasks);

  const stats = [
    {
      label: 'Completed Tasks',
      value: tasks.filter((t) => t.status.name === 'Done').length,
      icon: CheckCircle2,
      color: 'text-green-500',
    },
    {
      label: 'In Progress',
      value: tasks.filter((t) => t.status.name === 'In Progress').length,
      icon: Clock,
      color: 'text-blue-500',
    },
    {
      label: 'High Priority',
      value: tasks.filter((t) => t.priority.name === 'High').length,
      icon: AlertCircle,
      color: 'text-red-500',
    },
  ];

  return (
      <div className="space-y-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-gray-600 dark:text-gray-300">
                {stat.label}
              </span>
            </div>
            <span className="text-2xl font-semibold">{stat.value}</span>
          </motion.div>
        ))}
      </div>
  );
};