importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");

// DICA: Toda vez que você fizer uma atualização gigante no site, mude este número (ex: app-cache-v3)
const CACHE_NAME = 'app-cache-v3';

self.addEventListener('install', e => {
  self.skipWaiting(); // Força o novo Service Worker a pular a fila e instalar imediatamente
  e.waitUntil(caches.open(CACHE_NAME).then(c => {
    return c.addAll(['./', './index.html']);
  }));
});

self.addEventListener('activate', e => {
  // Limpa o cache antigo e assume o controle na mesma hora
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) 
  );
});

self.addEventListener('fetch', e => {
  // Estratégia "Network First": Tenta buscar o arquivo fresquinho na internet primeiro. 
  // Se o usuário estiver offline ou a internet falhar, ele pega do cache.
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
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
  
  // Agora lemos de payload.data porque mudamos para envio de pacote silencioso
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon || "https://cdn-icons-png.flaticon.com/512/3114/3114860.png",
    vibrate: [200, 100, 200, 100, 200],
    tag: "chat-msg",
    renotify: true, // <-- AGORA SIM O CELULAR VAI APITAR E VIBRAR!
    data: { url: payload.data.url }
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Permite que o app abra ao clicar na notificação quando minimizado
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const urlToOpen = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow(urlToOpen);
    })
  );
});
