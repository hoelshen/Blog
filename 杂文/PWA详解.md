# service worker 控制网络请求？

## service 特点

1.运行在它自己的全局脚本上下文中

2.不绑定到具体的网页

3.无法修改网页中的元素， 因为它无法访问 dom

4.只能使用 https

Service Worker 是一种在浏览器后台运行的脚本，能够拦截网络请求、管理缓存，并实现离线功能。以下是关于 Service Worker 和离线缓存的核心知识点：

### 1. **Service Worker 基础**

- **独立运行**：Service Worker 在独立线程中运行，不影响主线程。
- **事件驱动**：通过事件监听和响应进行操作。
- **HTTPS 要求**：生产环境中必须使用 HTTPS，本地开发可通过 `localhost` 或 `127.0.0.1` 使用。

### 2. **生命周期**

- **注册**：通过 `navigator.serviceWorker.register()` 注册。
- **安装**：`install` 事件用于缓存资源。
- **激活**：`activate` 事件用于清理旧缓存。
- **运行**：激活后，Service Worker 可拦截 `fetch` 事件。

### 3. **离线缓存实现**

- **缓存资源**：在 `install` 事件中，使用 `caches.open()` 和 `cache.addAll()` 缓存资源。
- **拦截请求**：在 `fetch` 事件中，通过 `caches.match()` 返回缓存响应，或通过网络获取并缓存新资源。

### 4. **缓存策略**

- **Cache First**：优先使用缓存，缓存未命中时请求网络。
- **Network First**：优先请求网络，失败时使用缓存。
- **Stale-While-Revalidate**：先返回缓存，同时更新缓存。
- **Cache Only**：仅使用缓存。
- **Network Only**：仅使用网络。

### 5. **更新与清理**

- **更新 Service Worker**：浏览器会检查新版本并触发 `install` 事件。
- **清理旧缓存**：在 `activate` 事件中删除旧缓存。

### 6. **调试**

- **Chrome DevTools**：通过 `Application` 面板查看和调试 Service Worker 及缓存。

### 7. **应用场景**

- **离线访问**：缓存关键资源，支持离线使用。
- **性能优化**：通过缓存减少网络请求，提升加载速度。
- **后台同步**：在网络恢复后同步数据。

### 示例代码

```javascript
// 注册 Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => console.log("Service Worker 注册成功"))
    .catch((error) => console.log("注册失败:", error));
}

// sw.js
const CACHE_NAME = "my-site-cache-v1";
const urlsToCache = ["/", "/styles/main.css", "/script/main.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
```

### 总结

Service Worker 是实现离线缓存和提升 Web 应用性能的关键工具。通过合理使用缓存策略，可以显著改善用户体验。

## 如何使用 service worker 提升首屏速度？

使用 Service Worker 提升首屏速度的核心思路是**缓存关键资源**，减少网络请求的依赖，从而加快页面加载。以下是具体方法和实现步骤：

---

### 1. **缓存关键资源**

首屏速度的提升依赖于快速加载关键资源（如 HTML、CSS、JavaScript 和字体文件）。可以通过 Service Worker 在安装阶段预缓存这些资源。

#### 实现步骤：

- 在 `install` 事件中，将关键资源缓存到 Cache Storage。
- 在 `fetch` 事件中，优先从缓存中返回资源。

#### 示例代码：

```javascript
const CACHE_NAME = "v1";
const urlsToCache = [
  "/", // 首页 HTML
  "/styles/main.css", // 关键 CSS
  "/scripts/main.js", // 关键 JavaScript
  "/images/logo.png", // 关键图片
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

---

### 2. **使用缓存优先策略**

对于首屏渲染所需的关键资源，可以采用 **Cache First** 策略，优先从缓存中加载资源，避免网络请求的延迟。

#### 实现步骤：

- 在 `fetch` 事件中，先检查缓存中是否存在请求的资源。
- 如果缓存命中，直接返回缓存内容；否则再发起网络请求。

#### 示例代码：

```javascript
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // 从缓存返回
      }
      return fetch(event.request); // 从网络请求
    })
  );
});
```

---

### 3. **预加载关键资源**

在页面加载时，可以通过 Service Worker 预加载后续页面所需的资源（如其他页面的 HTML 或 JavaScript），从而加快后续页面的加载速度。

#### 实现步骤：

- 在 `fetch` 事件中，动态缓存非关键资源。
- 在页面加载完成后，通过 JavaScript 触发 Service Worker 预加载资源。

#### 示例代码：

```javascript
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // 从缓存返回
      }
      return fetch(event.request).then((response) => {
        // 动态缓存非关键资源
        if (
          event.request.url.includes("/api/") ||
          event.request.url.includes("/images/")
        ) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    })
  );
});
```

---

### 4. **优化缓存策略**

根据资源类型选择合适的缓存策略：

- **关键资源**：使用 Cache First 策略。
- **非关键资源**：使用 Network First 或 Stale-While-Revalidate 策略。
- **动态内容**：使用 Network First 策略，确保内容最新。

#### Stale-While-Revalidate 示例：

```javascript
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // 更新缓存
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });
      // 返回缓存内容，同时更新缓存
      return cachedResponse || fetchPromise;
    })
  );
});
```

---

### 5. **减少主线程阻塞**

Service Worker 可以拦截请求并返回缓存内容，减少主线程的网络请求负担，从而提升页面响应速度。

#### 实现步骤：

- 将静态资源（如图片、CSS、JavaScript）缓存到 Service Worker。
- 在页面加载时，直接从缓存中加载资源，避免网络延迟。

---

### 6. **结合 HTTP/2 和 Server Push**

- 使用 HTTP/2 的多路复用特性，减少网络请求的开销。
- 结合 Server Push，将关键资源推送到客户端，进一步提升首屏速度。

---

### 7. **调试与监控**

- 使用 Chrome DevTools 的 **Application** 面板查看 Service Worker 和缓存状态。
- 使用 Lighthouse 工具分析首屏性能，检查 Service Worker 是否有效提升加载速度。

---

### 总结

通过 Service Worker 缓存关键资源、优化缓存策略、预加载资源以及减少主线程阻塞，可以显著提升首屏加载速度。关键在于：

1. 缓存首屏渲染所需的关键资源。
2. 使用合适的缓存策略（如 Cache First）。
3. 动态缓存非关键资源，优化后续页面加载。

通过合理使用 Service Worker，可以大幅提升 Web 应用的性能和用户体验。
