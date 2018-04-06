const initialize = () => {
  const status = document.getElementById('status');
  const content = document.getElementById('content');

  const setStatus = msg => (status.textContent = msg);
  const setContent = msg => (content.textContent = msg);

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
        setStatus('Active');
      }

      if (serviceWorker) {
        console.log(serviceWorker.state);
        serviceWorker.addEventListener('statechange', e => {
          console.log(e.target.state);
          if (e.target.state === 'activated') {
            setStatus('Active');
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
