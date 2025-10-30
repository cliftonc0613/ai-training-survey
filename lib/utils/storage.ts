// Storage utilities for localStorage and IndexedDB

const DB_NAME = 'ai-training-survey-db';
const DB_VERSION = 1;
const STORE_NAMES = {
  USERS: 'users',
  QUIZ_RESPONSES: 'quiz_responses',
  OFFLINE_QUEUE: 'offline_queue',
} as const;

/**
 * Initialize IndexedDB database
 */
export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event: any) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORE_NAMES.USERS)) {
        const userStore = db.createObjectStore(STORE_NAMES.USERS, { keyPath: 'id' });
        userStore.createIndex('resumeToken', 'resumeToken', { unique: true });
      }

      if (!db.objectStoreNames.contains(STORE_NAMES.QUIZ_RESPONSES)) {
        const responseStore = db.createObjectStore(STORE_NAMES.QUIZ_RESPONSES, {
          keyPath: 'id',
        });
        responseStore.createIndex('userId', 'userId', { unique: false });
        responseStore.createIndex('synced', 'synced', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_NAMES.OFFLINE_QUEUE)) {
        const queueStore = db.createObjectStore(STORE_NAMES.OFFLINE_QUEUE, { keyPath: 'id' });
        queueStore.createIndex('synced', 'synced', { unique: false });
        queueStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

/**
 * Generic IndexedDB operations
 */
export const indexedDB = {
  async get<T>(storeName: string, key: string): Promise<T | undefined> {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async getAll<T>(storeName: string): Promise<T[]> {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async getByIndex<T>(storeName: string, indexName: string, value: any): Promise<T[]> {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async set<T>(storeName: string, value: T): Promise<void> {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(value);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async delete(storeName: string, key: string): Promise<void> {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async clear(storeName: string): Promise<void> {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
};

/**
 * LocalStorage utilities with JSON serialization
 */
export const localStorage = {
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  },
};

/**
 * Storage keys constants
 */
export const STORAGE_KEYS = {
  CURRENT_USER: 'current_user',
  RESUME_TOKEN: 'resume_token',
  QUIZ_SESSION: 'quiz_session',
  OFFLINE_MODE: 'offline_mode',
} as const;

/**
 * Check if storage is available
 */
export function isStorageAvailable(type: 'localStorage' | 'indexedDB'): boolean {
  if (typeof window === 'undefined') return false;

  try {
    if (type === 'localStorage') {
      const test = '__storage_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    }

    if (type === 'indexedDB') {
      return 'indexedDB' in window;
    }

    return false;
  } catch (e) {
    return false;
  }
}

export { STORE_NAMES };
