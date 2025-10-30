import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconAlertCircle, IconInfoCircle } from '@tabler/icons-react';

export const notify = {
  success: (message: string, title = 'Success') => {
    notifications.show({
      title,
      message,
      color: 'green',
      icon: <IconCheck size={18} />,
      autoClose: 5000,
    });
  },

  error: (message: string, title = 'Error') => {
    notifications.show({
      title,
      message,
      color: 'red',
      icon: <IconX size={18} />,
      autoClose: 7000,
    });
  },

  warning: (message: string, title = 'Warning') => {
    notifications.show({
      title,
      message,
      color: 'orange',
      icon: <IconAlertCircle size={18} />,
      autoClose: 6000,
    });
  },

  info: (message: string, title = 'Info') => {
    notifications.show({
      title,
      message,
      color: 'blue',
      icon: <IconInfoCircle size={18} />,
      autoClose: 5000,
    });
  },

  // Quiz-specific notifications
  quizSubmitted: () => {
    notifications.show({
      title: 'Survey Submitted!',
      message: 'Thank you for completing the survey. Your responses have been saved.',
      color: 'green',
      icon: <IconCheck size={18} />,
      autoClose: 5000,
    });
  },

  quizSaved: () => {
    notifications.show({
      title: 'Progress Saved',
      message: 'Your quiz progress has been saved. You can continue later using your resume token.',
      color: 'blue',
      icon: <IconCheck size={18} />,
      autoClose: 4000,
    });
  },

  offline: () => {
    notifications.show({
      id: 'offline-notification',
      title: 'You\'re Offline',
      message: 'Your responses will be saved locally and synced when you\'re back online.',
      color: 'orange',
      icon: <IconAlertCircle size={18} />,
      autoClose: false,
      withCloseButton: true,
    });
  },

  backOnline: () => {
    notifications.hide('offline-notification');
    notifications.show({
      title: 'Back Online!',
      message: 'Syncing your saved responses...',
      color: 'green',
      icon: <IconCheck size={18} />,
      autoClose: 3000,
    });
  },

  syncComplete: (count: number) => {
    notifications.show({
      title: 'Sync Complete',
      message: `Successfully synced ${count} item${count > 1 ? 's' : ''}.`,
      color: 'green',
      icon: <IconCheck size={18} />,
      autoClose: 4000,
    });
  },

  syncFailed: (error: string) => {
    notifications.show({
      title: 'Sync Failed',
      message: `Failed to sync responses: ${error}`,
      color: 'red',
      icon: <IconX size={18} />,
      autoClose: 7000,
    });
  },
};
