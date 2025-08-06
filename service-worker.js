// 캐시 이름 정의
const CACHE_NAME = 'todo-list-cache-v1';
// 캐시할 파일 목록
const urlsToCache = [
  '/',
  'index.html'
];

// 1. 서비스 워커 설치
self.addEventListener('install', event => {
  // 설치 과정이 끝날 때까지 기다림
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('캐시가 열렸습니다.');
        // 정의된 파일들을 캐시에 추가
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. 요청(fetch) 이벤트 처리
self.addEventListener('fetch', event => {
  event.respondWith(
    // 먼저 캐시에서 일치하는 요청이 있는지 확인
    caches.match(event.request)
      .then(response => {
        // 캐시에 응답이 있으면 캐시된 값을 반환
        if (response) {
          return response;
        }
        // 캐시에 없으면 네트워크를 통해 요청을 보냄
        return fetch(event.request);
      })
  );
});

// 3. 서비스 워커 활성화 및 이전 캐시 정리
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 화이트리스트에 없는 이전 버전의 캐시는 삭제
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
