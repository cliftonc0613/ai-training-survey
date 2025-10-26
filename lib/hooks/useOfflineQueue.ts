import { useState, useEffect, useCallback } from 'react';
import type { OfflineQueueItem } from '../types';
import { indexedDB, STORE_NAMES } from '../utils/storage';
import { db } from '../supabaseClient';

interface UseOfflineQueueReturn {
  queue: OfflineQueueItem[];
  isOnline: boolean;
  isSyncing: boolean;
  addToQueue: (item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'retryCount' | 'synced'>) => Promise<void>;
  processQueue: () => Promise<void>;
  clearQueue: () => Promise<void>;
  getQueueSize: () => number;
  getPendingCount: () => number;
}

export function useOfflineQueue(): UseOfflineQueueReturn {
  const [queue, setQueue] = useState<OfflineQueueItem[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Monitor online/offline status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Set initial status
    updateOnlineStatus();

    // Add event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Load queue from IndexedDB on mount
  useEffect(() => {
    loadQueue();
  }, []);

  // Auto-process queue when coming online
  useEffect(() => {
    if (isOnline && queue.some((item) => !item.synced)) {
      processQueue();
    }
  }, [isOnline]);

  const loadQueue = useCallback(async () => {
    try {
      const items = await indexedDB.getAll<OfflineQueueItem>(STORE_NAMES.OFFLINE_QUEUE);
      setQueue(items);
    } catch (error) {
      console.error('Error loading offline queue:', error);
    }
  }, []);

  const addToQueue = useCallback(
    async (item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'retryCount' | 'synced'>) => {
      const queueItem: OfflineQueueItem = {
        ...item,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        retryCount: 0,
        synced: false,
      };

      try {
        await indexedDB.set(STORE_NAMES.OFFLINE_QUEUE, queueItem);
        setQueue((prev) => [...prev, queueItem]);

        // Try to sync immediately if online
        if (isOnline) {
          processQueue();
        }
      } catch (error) {
        console.error('Error adding item to offline queue:', error);
        throw error;
      }
    },
    [isOnline]
  );

  const processQueue = useCallback(async () => {
    if (!isOnline || isSyncing) {
      return;
    }

    setIsSyncing(true);

    try {
      const pendingItems = queue.filter((item) => !item.synced);

      for (const item of pendingItems) {
        try {
          // Sync based on item type
          if (item.type === 'user') {
            const userData = item.data as any;
            await db.createUser({
              id: userData.id,
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
              resume_token: userData.resumeToken,
              created_at: userData.createdAt,
              updated_at: userData.updatedAt,
            });
          } else if (item.type === 'response') {
            const responseData = item.data as any;
            await db.createQuizResponse(responseData);
          }

          // Mark as synced
          const updatedItem = { ...item, synced: true };
          await indexedDB.set(STORE_NAMES.OFFLINE_QUEUE, updatedItem);

          setQueue((prev) =>
            prev.map((qItem) => (qItem.id === item.id ? updatedItem : qItem))
          );
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);

          // Increment retry count
          const updatedItem = { ...item, retryCount: item.retryCount + 1 };
          await indexedDB.set(STORE_NAMES.OFFLINE_QUEUE, updatedItem);

          setQueue((prev) =>
            prev.map((qItem) => (qItem.id === item.id ? updatedItem : qItem))
          );

          // Stop processing if we hit max retries
          if (updatedItem.retryCount >= 5) {
            console.warn(`Item ${item.id} exceeded max retry count`);
          }
        }
      }
    } catch (error) {
      console.error('Error processing offline queue:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [queue, isOnline, isSyncing]);

  const clearQueue = useCallback(async () => {
    try {
      await indexedDB.clear(STORE_NAMES.OFFLINE_QUEUE);
      setQueue([]);
    } catch (error) {
      console.error('Error clearing offline queue:', error);
      throw error;
    }
  }, []);

  const getQueueSize = useCallback(() => {
    return queue.length;
  }, [queue]);

  const getPendingCount = useCallback(() => {
    return queue.filter((item) => !item.synced).length;
  }, [queue]);

  return {
    queue,
    isOnline,
    isSyncing,
    addToQueue,
    processQueue,
    clearQueue,
    getQueueSize,
    getPendingCount,
  };
}
