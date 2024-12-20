import React, { useState } from 'react';
import { Clock, Tag, Eye, Pencil, Trash2 } from 'lucide-react';
import type { Task } from '../../types/task';
import { useTaskStore } from '../../store/useTaskStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { ViewTaskDialog } from './ViewTaskDialog';
import { EditTaskDialog } from './EditTaskDialog';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onEdit?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const priorityColors = {
    Low: 'bg-blue-100 text-blue-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800',
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTask(task.id);
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        onClick={onClick}
        className="p-4 transition-shadow duration-200 bg-white rounded-lg shadow-sm hover:shadow-md dark:shadow-zinc-400 dark:bg-gray-800"
      >
        {/* Header with Title and Actions */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="flex-1 font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
            {task.title}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsViewOpen(true)}
              className="p-1 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsEditOpen(true)}
              className="p-1 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDeleteAlert(true)}
              className="p-1 text-gray-500 rounded-full hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Priority Badge */}
        <div className="mb-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              priorityColors[task.priority.name as keyof typeof priorityColors]
            }`}
          >
            {task.priority.name}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <p className="mb-3 text-sm text-gray-600 line-clamp-2 dark:text-gray-300">
            {task.description}
          </p>
        )}

        {/* Footer with Due Date and Tags */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          {task.tags && task.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              <span>{task.tags.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* View Task Dialog */}
      <ViewTaskDialog
        task={task}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
      />

      {/* Edit Task Dialog */}
      <EditTaskDialog
        task={task}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      {/* Delete Task Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task
              "{task.title}" and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Task'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};