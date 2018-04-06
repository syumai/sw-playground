const initialize = () => {
  const status = document.getElementById('status');
  const content = document.getElementById('content');
  const articleList = document.getElementById('articleList');

  const setStatus = msg => (status.textContent = msg);
  const setContent = msg => (content.textContent = msg);

  const renderLinks = articles =>
    articles
      .map(
        ({ id, title }) => `<li>
  <a href="/sw-playground/basic-progressive-blog/articles/${id}.html">Article id: ${id}, title: ${title}</a>
</li>`
      )
      .join('\n');

  const activate = async () => {
    setStatus('Active');
    const response = await fetch('articlesData.json');
    const articles = await response.json();
    const links = renderLinks(articles);
    articleList.insertAdjacentHTML('afterbegin', links);
  };

  const initializeServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('sw.js', {
        scope: './',
      });

      let serviceWorker;
      if (registration.installing) {
        serviceWorker = registration.installing;
        setStatus('Installing');
      } else if (registration.waiting) {
        serviceWorker = registration.waiting;
        setStatus('Waiting');
      } else if (registration.active) {
        serviceWorker = registration.active;
        activate();
      }

      if (serviceWorker) {
        console.log(serviceWorker.state);
        serviceWorker.addEventListener('statechange', e => {
          console.log(e.target.state);
          if (e.target.state === 'activated') {
            activate();
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (navigator.serviceWorker) {
    initializeServiceWorker();
  } else {
    setContent('Service Worker is not supported on this browser.');
  }
};

document.addEventListener('DOMContentLoaded', initialize);
