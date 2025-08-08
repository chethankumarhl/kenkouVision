import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

export function getInitials(name) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Add the missing getStatusColor function
export function getStatusColor(status) {
  switch (status) {
    case 'CRITICAL':
      return 'text-red-700 bg-red-100 border-red-200';
    case 'STABLE':
      return 'text-green-700 bg-green-100 border-green-200';
    case 'DISCHARGED':
      return 'text-gray-700 bg-gray-100 border-gray-200';
    case 'ACTIVE':
      return 'text-blue-700 bg-blue-100 border-blue-200';
    default:
      return 'text-gray-700 bg-gray-100 border-gray-200';
  }
}
