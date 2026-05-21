self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || "RozKhata Reminder";
  const options = {
    body: data.body || "You have upcoming transactions.",
    icon: 'https://i.ibb.co/rKwQVx0x/1000049684-removebg-preview.png',
    badge: 'https://i.ibb.co/rKwQVx0x/1000049684-removebg-preview.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
