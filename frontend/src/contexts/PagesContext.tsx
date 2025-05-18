import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import axios from 'axios';
import { Page } from '@/types/page';
import { usePages as useOriginalPagesHook } from '@/hooks/usePages'; // Renaming to avoid conflict
import { deletePage as deletePageApi } from "@/api/pageApi";
import { toast } from "sonner";

interface PagesContextProps {
  pages: Page[];
  isLoadingPages: boolean;
  pagesError: string | null;
  setRefreshPagesTrigger: React.Dispatch<React.SetStateAction<number>>;
  handleDeletePage: (pageId: number) => Promise<void>;
  // If new page creation also needs to trigger refresh, setRefreshPagesTrigger is already available.
}

const PagesContext = createContext<PagesContextProps | undefined>(undefined);

export const PagesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    pages,
    isLoading: isLoadingPages,
    error: pagesError,
    setRefreshTrigger: setRefreshPagesTrigger,
  } = useOriginalPagesHook();

  const handleDeletePage = useCallback(
    async (pageId: number) => {
      try {
        await deletePageApi(pageId);
        toast.success(`Page ${pageId} deleted successfully!`);
        setRefreshPagesTrigger((prev) => prev + 1);
      } catch (error: any) {
        console.error("Failed to delete page:", error);
        toast.error(`Failed to delete page ${pageId}: ${error.message || 'Unknown error'}`);
        // Re-throw if calling components need to handle it, otherwise not necessary
        // throw error; 
      }
    },
    [setRefreshPagesTrigger]
  );

  const contextValue = {
    pages,
    isLoadingPages,
    pagesError,
    setRefreshPagesTrigger,
    handleDeletePage,
  };

  return <PagesContext.Provider value={contextValue}>{children}</PagesContext.Provider>;
};

export const usePagesContext = (): PagesContextProps => {
  const context = useContext(PagesContext);
  if (context === undefined) {
    throw new Error('usePagesContext must be used within a PagesProvider');
  }
  return context;
}; 