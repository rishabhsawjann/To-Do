'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTodosStore } from '@/stores/todos';
import { useAuthStore } from '@/stores/auth';
import { isWithinNextHours, formatTime, formatDateTime } from '@/lib/time';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const { todos } = useTodosStore();
  const { user } = useAuthStore();

  const userTodos = todos.filter(todo => todo.userId === user?.uid);
  
  // Get upcoming todos in next 4 hours
  const upcomingTodos = userTodos.filter(todo => 
    !todo.completed && isWithinNextHours(todo.scheduledAt, 4)
  );
  
  // Get completed todos from today only
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
  
  const completedTodos = userTodos
    .filter(todo => {
      if (!todo.completed || !todo.completedAt) return false;
      const completedDate = new Date(todo.completedAt);
      return completedDate >= todayStart && completedDate < todayEnd;
    })
    .sort((a, b) => new Date(b.completedAt || '').getTime() - new Date(a.completedAt || '').getTime())
    .slice(0, 10);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-96 max-w-none max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>All Notifications</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-6 overflow-y-auto max-h-[calc(80vh-120px)] pr-2">
          {/* Due in next 4 hours */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Due in next 4 hours</h3>
              <Badge variant="secondary">{upcomingTodos.length}</Badge>
            </div>
            
            {upcomingTodos.length === 0 ? (
              <p className="text-sm text-gray-500">No upcoming todos in the next 4 hours</p>
            ) : (
              <div className="space-y-3">
                {upcomingTodos.map((todo) => (
                  <Card key={todo.id} className="border-l-4 border-l-yellow-500">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{todo.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {formatTime(todo.scheduledAt)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-gray-600 mb-2">{todo.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-yellow-600 font-medium">Soon</span>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(todo.scheduledAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Completed */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Completed Today</h3>
              <Badge variant="secondary">{completedTodos.length}</Badge>
            </div>
            
            {completedTodos.length === 0 ? (
              <p className="text-sm text-gray-500">No completed todos today</p>
            ) : (
              <div className="space-y-3">
                {completedTodos.map((todo) => (
                  <Card key={todo.id} className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{todo.title}</CardTitle>
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Completed
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-gray-600 mb-2">{todo.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-green-600 font-medium">Done</span>
                        <span className="text-xs text-gray-500">
                          {todo.completedAt ? formatDateTime(todo.completedAt) : 'Recently'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
