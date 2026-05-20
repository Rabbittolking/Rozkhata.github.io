import { db } from './db';

// Ask for notification permission
export const askNotificationPermission = async () => {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }
  return false;
};

// Send a test notification
export const sendNotification = (title: string, options?: NotificationOptions) => {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    // Note: To show notifications on mobile (especially Android) from a web app when it's closed/in background, 
    // a registered ServiceWorker is typically required.
    // For demonstration, we'll try to use the ServiceWorker registration if available.
    navigator.serviceWorker.getRegistration().then(registration => {
      if (registration) {
        registration.showNotification(title, {
          icon: 'https://i.ibb.co/rKwQVx0x/1000049684-removebg-preview.png',
          ...options
        });
      } else {
        new Notification(title, {
          icon: 'https://i.ibb.co/rKwQVx0x/1000049684-removebg-preview.png',
          ...options
        });
      }
    }).catch((err) => {
      new Notification(title, {
        icon: 'https://i.ibb.co/rKwQVx0x/1000049684-removebg-preview.png',
        ...options
      });
    });
  }
};

// A mock background checker
export const scheduleRemindersCheck = () => {
  // Check every hour (simplified to 1 minute for demo)
  setInterval(async () => {
    try {
      const txs = await db.transactions.toArray();
      const customers = await db.customers.toArray();
      const customerMap = customers.reduce((acc, c) => {
         if (c.id) acc[c.id] = c;
         return acc;
      }, {} as Record<number, any>);

      const today = new Date();
      
      txs.forEach(tx => {
        if (tx.dueDate && tx.type === 'udhaar') {
          const cust = customerMap[tx.customerId];
          if (cust && cust.netBalance > 0) {
            const dueDate = new Date(tx.dueDate);
            const timeDiff = dueDate.getTime() - today.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            // If due tomorrow or today
            if (daysDiff === 1 || daysDiff === 0) {
              const notifiedKey = `notified_${tx.id}_${today.toDateString()}`;
              if (!localStorage.getItem(notifiedKey)) {
                sendNotification(`Reminder: Collection from ${cust.name}`, {
                  body: `Amount ₹${tx.amount} is ${daysDiff === 0 ? 'due today' : 'due tomorrow'}.`,
                });
                localStorage.setItem(notifiedKey, 'true');
              }
            }
          }
        }
      });
    } catch (e) {
      console.error(e);
    }
  }, 60 * 1000); 
};
