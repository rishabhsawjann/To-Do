'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Todo } from '@/types';
import { isFuture } from '@/lib/time';

interface TodoFormProps {
  isOpen: boolean;
  onClose: () => void;
  todo?: Todo | null;
  onSubmit: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
}

export function TodoForm({ isOpen, onClose, todo, onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description);
      // Convert ISO string to datetime-local format
      const date = new Date(todo.scheduledAt);
      const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setScheduledAt(localDateTime);
    } else {
      // Set default to current time + 1 hour
      const now = new Date();
      now.setHours(now.getHours() + 1);
      const localDateTime = now.toISOString().slice(0, 16);
      setScheduledAt(localDateTime);
    }
    setErrors({});
  }, [todo, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!scheduledAt) {
      newErrors.scheduledAt = 'Due date and time is required';
    } else if (!isFuture(scheduledAt)) {
      newErrors.scheduledAt = 'Due date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const todoData = {
      userId: todo?.userId || '',
      title: title.trim(),
      description: description.trim(),
      scheduledAt: new Date(scheduledAt).toISOString(),
      completed: todo?.completed || false
    };

    onSubmit(todoData);
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setScheduledAt('');
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{todo ? 'Edit Todo' : 'Add Todo'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="scheduledAt">Due Date *</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className={errors.scheduledAt ? 'border-red-500' : ''}
            />
            {errors.scheduledAt && (
              <p className="text-sm text-red-500 mt-1">{errors.scheduledAt}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {todo ? 'Update Todo' : '+ Create Todo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
