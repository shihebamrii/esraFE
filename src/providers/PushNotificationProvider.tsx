"use client";

import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useEffect } from "react";
import { useAuthStore } from '@/store/authStore';

export function PushNotificationProvider() {
  const { requestPermission, isSupported, error } = usePushNotifications();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Only ask for permission if supported and user is logged in
    // This will trigger the subscription flow if they grant permission
    if (isSupported && isAuthenticated) {
      if (Notification.permission === 'default') {
        // You might want to show a custom UI before requesting permission
        // but for now we'll just request it
        requestPermission();
      }
    }
  }, [isSupported, isAuthenticated, requestPermission]);

  // Log errors if any
  useEffect(() => {
    if (error) {
      console.error('Push Notification Setup Error:', error);
    }
  }, [error]);

  return null;
}
