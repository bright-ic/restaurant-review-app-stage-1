const filesToCache = [
    "./",
    "./index.html",
    "./restaurant.html",
    "./css/styles.css",
    "./data/restaurants.json",
    "./js/dbhelper.js",
    "./js/main.js",
    "./js/restaurant_info.js",
    "./img/1.jpg",
    "./img/2.jpg",
    "./img/3.jpg",
    "./img/4.jpg",
    "./img/5.jpg",
    "./img/6.jpg",
    "./img/7.jpg",
    "./img/8.jpg",
    "./img/9.jpg",
    "./img/10.jpg"
];
const appCacheName = "resturant-review-app-cache-v1";

/**************************Service worker Install event listener ******************************************/
// install service worker
self.addEventListener('install', event => {
    event.waitUntil(
        // creating/opening cache
        caches.open(appCacheName).then(cache => {
            console.log('service worker installed succesfully');
            return cache.addAll(filesToCache); // add app shell to cache
        })
    );
});

/**************************Service worker Activate event listener ******************************************/
self.addEventListener('activate', event =>{
    event.waitUntil(
    // try to delete old caches for this app.
      caches.keys().then( cacheNames => {
        console.log('service worker activated successfully');
        return Promise.all(
          cacheNames.filter(cacheName => {
            return cacheName.startsWith('resturant-review-app-cache-') && appCacheName !== cacheName;
          }).map( cacheName => {
            if(appCacheName !== cacheName){
                return caches.delete(cacheName);
            }
          })
        );
      })
    );
});

/**************************Service worker Fetch event listener ******************************************/
self.addEventListener('fetch', event => {
    
   const requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
         if (requestUrl.pathname === './') {
            event.respondWith(caches.match("./index.html"));
            return;
        }
        if (requestUrl.pathname === './index.html') {
            event.respondWith(caches.match("./index.html"));
            return;
        }
        if (requestUrl.pathname === '/restaurant.html') {
            event.respondWith(caches.match("./restaurant.html"));
            return;
        }
    }

    event.respondWith(serveFromCatchOrNetwork(event.request));
});

/****************nETWORK FETCHING SCRIPT*************************************************/
 serveFromCatchOrNetwork = request => {
    const storageUrl = request.url;

    return caches.open(appCacheName).then(cache =>{
        return cache.match(storageUrl).then(response =>{
            if(response) {
                return response;
            }
            else {
                return fetch(request).then(networkResponse =>{
                    cache.put(storageUrl, networkResponse.clone());
                    return networkResponse;
                });
            }
            
        //return response || networkfetch;
      });
    });
} 
/*************************************************************************************************************/
