import { useMemo } from 'react';

export const useFormattedDateTime = () => {
  const now = new Date();
  
  const formattedDate = useMemo(() => {
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  }, [now]);

  const formattedTime = useMemo(() => {
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }, [now]);

  return { date: formattedDate, time: formattedTime };
};