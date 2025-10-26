'use client';

import { useState, useEffect } from 'react';
import { Alert, Transition } from '@mantine/core';
import { IconWifi, IconWifiOff, IconCloudUpload } from '@tabler/icons-react';

interface OfflineIndicatorProps {
  queueCount?: number;
  onRetry?: () => void;
}

export default function OfflineIndicator({ queueCount = 0, onRetry }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showSyncMessage, setShowSyncMessage] = useState(false);

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowSyncMessage(true);

      // Trigger retry if callback provided
      if (onRetry) {
        onRetry();
      }

      // Hide sync message after 5 seconds
      setTimeout(() => {
        setShowSyncMessage(false);
      }, 5000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowSyncMessage(false);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onRetry]);

  return (
    <>
      {/* Offline Indicator */}
      <Transition mounted={!isOnline} transition="slide-down" duration={300}>
        {(styles) => (
          <Alert
            icon={<IconWifiOff size={18} />}
            title="You're offline"
            color="orange"
            style={{
              ...styles,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              borderRadius: 0,
            }}
          >
            Don't worry! Your responses are being saved locally and will sync when you're back
            online.
            {queueCount > 0 && ` (${queueCount} item${queueCount > 1 ? 's' : ''} pending)`}
          </Alert>
        )}
      </Transition>

      {/* Sync Message */}
      <Transition mounted={showSyncMessage} transition="slide-down" duration={300}>
        {(styles) => (
          <Alert
            icon={<IconCloudUpload size={18} />}
            title="Back online!"
            color="green"
            style={{
              ...styles,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              borderRadius: 0,
            }}
          >
            Syncing your saved responses...
          </Alert>
        )}
      </Transition>
    </>
  );
}
