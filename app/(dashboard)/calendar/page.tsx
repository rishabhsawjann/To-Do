'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTodosStore } from '@/stores/todos';
import { useSessionStore } from '@/stores/session';
import { formatDateTime, formatTime } from '@/lib/time';
import { TodoForm } from '@/components/TodoForm';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const { getTodosByUser, addTodo } = useTodosStore();
  const { currentUserId } = useSessionStore();
  
  const todos = getTodosByUser(currentUserId);

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add previous month's days
    for (let i = startingDay - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      days.push({ date: currentDate, isCurrentMonth: true });
    }
    
    // Add next month's days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  // Get todos for a specific date
  const getTodosForDate = (date: Date) => {
    return todos.filter(todo => {
      const todoDate = new Date(todo.scheduledAt);
      return todoDate.toDateString() === date.toDateString();
    });
  };

  // Check if date has todos
  const hasTodos = (date: Date) => {
    return getTodosForDate(date).length > 0;
  };

  // Check if date is today
  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  // Check if date is selected
  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const calendarDays = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCreateTodo = (todoData: any) => {
    if (selectedDate) {
      addTodo({
        ...todoData,
        userId: currentUserId,
        scheduledAt: selectedDate.toISOString()
      });
    }
  };

  const selectedDateTodos = selectedDate ? getTodosForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-sm text-gray-500">View and manage your todos by date</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="bg-green-600 hover:bg-green-700">
          <Plus size={16} className="mr-2" />
          Add Todo
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                    <ChevronLeft size={16} />
                  </Button>
                  <h2 className="text-xl font-semibold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <Button variant="outline" size="sm" onClick={goToNextMonth}>
                    <ChevronRight size={16} />
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {calendarDays.map(({ date, isCurrentMonth }, index) => {
                  const dayTodos = getTodosForDate(date);
                  const hasTodosOnDay = hasTodos(date);
                  const isTodayDate = isToday(date);
                  const isSelectedDate = isSelected(date);
                  
                  return (
                    <div
                      key={index}
                      onClick={() => handleDateClick(date)}
                      className={`
                        p-2 min-h-[80px] border border-gray-100 cursor-pointer transition-all
                        hover:bg-gray-50 hover:border-gray-200
                        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                        ${isTodayDate ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                        ${isSelectedDate ? 'bg-blue-50 border-blue-200' : ''}
                        ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                      `}
                    >
                      <div className="text-sm font-medium mb-1">
                        {date.getDate()}
                      </div>
                      
                      {/* Todo indicators */}
                      {hasTodosOnDay && (
                        <div className="space-y-1">
                          {dayTodos.slice(0, 2).map(todo => (
                            <div
                              key={todo.id}
                              className={`
                                text-xs p-1 rounded truncate
                                ${todo.completed 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                                }
                              `}
                            >
                              {todo.title}
                            </div>
                          ))}
                          {dayTodos.length > 2 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{dayTodos.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon size={20} />
                <span>
                  {selectedDate 
                    ? selectedDate.toLocaleDateString('en-GB', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })
                    : 'Select a date'
                  }
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Todos</span>
                    <Badge variant="secondary">{selectedDateTodos.length}</Badge>
                  </div>
                  
                  {selectedDateTodos.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No todos scheduled for this date
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedDateTodos.map(todo => (
                        <div
                          key={todo.id}
                          className={`
                            p-3 rounded-lg border
                            ${todo.completed 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-white border-gray-200'
                            }
                          `}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`text-sm font-medium ${
                                todo.completed ? 'text-green-800 line-through' : 'text-gray-900'
                              }`}>
                                {todo.title}
                              </h4>
                              {todo.description && (
                                <p className="text-xs text-gray-600 mt-1">{todo.description}</p>
                              )}
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge 
                                  variant={todo.completed ? 'default' : 'outline'}
                                  className={todo.completed ? 'bg-green-100 text-green-800' : ''}
                                >
                                  {todo.completed ? 'Completed' : formatTime(todo.scheduledAt)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => setIsFormOpen(true)} 
                    className="w-full mt-4 bg-green-600 hover:bg-green-700"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Todo for this date
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  Click on a date to view details
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Todos</span>
                <span className="font-semibold">{todos.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">
                  {todos.filter(t => t.completed).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="font-semibold text-yellow-600">
                  {todos.filter(t => !t.completed).length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Todo Form Modal */}
      <TodoForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateTodo}
      />
    </div>
  );
}
