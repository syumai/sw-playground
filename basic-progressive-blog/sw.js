const CACHE_NAME = 'basic-progressive-blog-v1';
const resources = [
  '/index.html',
  '/template.html',
  '/index.js',
  '/articlesData.json',
];

const renderLinks = articles =>
  articles
    .map(
      ({ id, title }) => `<li>
  <a href="/sw-playground/basic-progressive-blog/articles/${id}.html">Article id: ${id}, title: ${title}</a>
</li>`
    )
    .join('\n');
let template;

const renderArticle = async ({ id, title, date, content }, links) => {
  if (!template) {
    template = await loadTemplate();
  }
  template
    .replace(/\{\{title\}\}/g, title)
    .replace(/\{\{date\}\}/g, new Date(date).toString())
    .replace(/\{\{content\}\}/g, content)
    .replace(/\{\{links\}\}/g, links);
};

const openCache = async () => await caches.open(CACHE_NAME);

const basePath = 'sw-playground/basic-progressive-blog';

const loadResourceFromCache = async resourcePath => {
  const cache = await openCache();
  return await cache.match(resourcePath);
};

const loadTemplate = async () => {
  const response = await loadResourceFromCache('template.html');
  if (response) {
    return await response.text();
  } else {
    return null;
  }
};

const loadArticles = async () => {
  const response = await loadResourceFromCache('articlesData.json');
  if (response) {
    return await response.json();
  } else {
    return null;
  }
};

self.addEventListener('install', e => {
  console.log('Install event:', e);
  e.waitUntil(async () => {
    const cache = await openCache();
    return cache.addAll(resources);
  });
});

self.addEventListener('activate', async e => {
  console.log('Activate event:', e);
});

let articles;

self.addEventListener('fetch', e => {
  console.log('Fetch event:', e);

  const url = e.request.url;

  if (url.includes('articles/')) {
    e.respondWith(
      (async () => {
        if (!articles) {
          articles = await loadArticles();
        }
        const urlParts = url.split('/');
        const id = parseInt(urlParts[urlParts.length - 1], 10);
        const article = articles.find(article => article.id === id);
        let response;
        if (article) {
          const links = renderLinks(articles);
          const html = renderArticle(article, links);
          return new Response(html, {
            status: 200,
            headers: {
              'Content-Type': 'text/html',
            },
          });
        } else {
          return new Response(
            JSON.stringify({ status: 404, message: 'Article was not found' }),
            {
              status: 404,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        }
      })()
    );
  }
});
