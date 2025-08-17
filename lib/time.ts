export function isFuture(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return date > now;
}

export function isWithinNextHours(dateString: string, hours: number = 4): boolean {
  const date = new Date(dateString);
  const now = new Date();
  const futureTime = new Date(now.getTime() + hours * 60 * 60 * 1000);
  return date >= now && date <= futureTime;
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((date.getTime() - now.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 0) return 'Overdue';
  if (diffInMinutes < 60) return `in ${diffInMinutes} minutes`;
  if (diffInMinutes < 1440) return `in ${Math.floor(diffInMinutes / 60)} hours`;
  return `in ${Math.floor(diffInMinutes / 1440)} days`;
}
