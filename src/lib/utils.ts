
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatNaira = (amount: number | string | null | undefined): string => {
  if (!amount) return '₦0';
  
  const numericAmount = typeof amount === 'string' 
    ? parseFloat(amount.replace(/[^\d.-]/g, '')) 
    : amount;
    
  if (isNaN(numericAmount)) return '₦0';
    
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};
