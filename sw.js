importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");

self.addEventListener('install', e => {
  e.waitUntil(caches.open('app-cache').then(c => {
    return c.addAll(['./', './index.html']);
  }));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => { return r || fetch(e.request); }));
});

// Configuração idêntica à do index.html para o Service Worker conectar
firebase.initializeApp({
  apiKey: "AIzaSyAXZQw3SlUgZHqtiYjn5X2iWx21PIl2eik",
  authDomain: "starsuperchat.firebaseapp.com",
  projectId: "starsuperchat",
  storageBucket: "starsuperchat.firebasestorage.app",
  messagingSenderId: "247526339931",
  appId: "1:247526339931:web:896309f890600cb813567e"
});

const messaging = firebase.messaging();

// Este é o verdadeiro "pique zap zap" para quando o app está minimizado/fechado
messaging.onBackgroundMessage((payload) => {
  console.log("[Service Worker] Recebeu mensagem em segundo plano: ", payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "https://cdn-icons-png.flaticon.com/512/3114/3114860.png",
    vibrate: [200, 100, 200, 100, 200], // Vibração dupla pesada
    tag: "chat-msg"
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});
