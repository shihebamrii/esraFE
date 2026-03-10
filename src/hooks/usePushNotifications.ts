"use client";

import { useEffect, useState } from 'react';
import { NotificationService } from '@/features/notifications/api';
import { useAuthStore } from '@/store/authStore';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  // Make sure we only subscribe when user is authenticated
  useEffect(() => {
    if (isAuthenticated && isSupported) {
      subscribeToPush();
    }
  }, [isAuthenticated, isSupported]);

  const registerServiceWorker = async () => {
    try {
      await navigator.serviceWorker.register('/sw.js');
    } catch (err: any) {
      console.error('Service Worker registration failed', err);
      setError(err);
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      const existingSub = await registration.pushManager.getSubscription();
      if (existingSub) {
        setSubscription(existingSub);
        // Resend to backend to ensure it's linked to current user
        await NotificationService.subscribe(existingSub);
        return;
      }

      // Need new subscription
      const vapidRes = await NotificationService.getVapidKey();
      const publicVapidKey = vapidRes.data.publicKey;
      
      const newSub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });
      
      setSubscription(newSub);
      await NotificationService.subscribe(newSub);

    } catch (err: any) {
      console.error('Push subscription failed:', err);
      setError(err);
    }
  };

  const requestPermission = async () => {
    if (!isSupported) return false;
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await subscribeToPush();
      return true;
    }
    return false;
  };

  return { isSupported, subscription, error, requestPermission };
}
