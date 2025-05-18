import { useState, useEffect } from 'react';
import axios from 'axios';
import { Page } from '@/types/page';

const API_URL = 'http://localhost:8000/api/page';

export function usePages() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPages = async () => {      
        setIsLoading(true);
        setError(null);
        await axios.get<Page[]>(API_URL)
        .then((response) => {
            setPages(response.data);
        })
        .catch((err) => {
            console.error('Axios error fetching pages:', err.response?.data || err.message);
            setError(err.response && err.response.data != null ? err.response.data : err.message);
            setPages([]);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };
    fetchPages();
  }, [refreshTrigger]);

  return { pages, isLoading, error, setRefreshTrigger };
} 