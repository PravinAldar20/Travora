import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { Destination } from '../types';

interface DestinationContextType {
  activeDestination: Destination | null;
  destinations: Destination[];
  isLoading: boolean;
  setDestinationById: (id: string) => void;
  setActiveDestination: (dest: Destination) => void;
}

const DestinationContext = createContext<DestinationContextType | undefined>(undefined);

export const DestinationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [activeDestination, setActiveDestination] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch available destinations from backend
    api.get('/places/destinations')
      .then(res => {
        if (res.data.success && res.data.destinations) {
          setDestinations(res.data.destinations);
          // Default to Tokyo, Japan or first destination
          const tokyo = res.data.destinations.find((d: Destination) => d.id === 'tokyo-japan');
          setActiveDestination(tokyo || res.data.destinations[0] || null);
        }
      })
      .catch(err => {
        console.error('Failed to load destinations:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const setDestinationById = (id: string) => {
    const found = destinations.find(d => d.id === id || d.city.toLowerCase() === id.toLowerCase());
    if (found) {
      setActiveDestination(found);
    }
  };

  return (
    <DestinationContext.Provider
      value={{
        activeDestination,
        destinations,
        isLoading,
        setDestinationById,
        setActiveDestination,
      }}
    >
      {children}
    </DestinationContext.Provider>
  );
};

export const useDestination = (): DestinationContextType => {
  const context = useContext(DestinationContext);
  if (!context) {
    throw new Error('useDestination must be used within a DestinationProvider');
  }
  return context;
};
