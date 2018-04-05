const template = `
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Dummy router - page: {{currentPage}}</title>
</head>

<body>
  <main>
    <h1>Dummy router</h1>

    <section>
      <div class="description">
        <ul>
          <li>
            This page responds to any routes.
          </li>
          <li>
            <a href="https://github.com/syumai/sw-playground/tree/master/dummy-router">View code on GitHub</a>
          </li>
        </ul>
      </div>
    </section>

    <section id="content">
      <h2>Current page: {{currentPage}}</h2>
      <a href="/sw-playground/dummy-router/pages/{{nextPage}}.html">NextPage: {{nextPage}}</a>
    </section>
  </main>
</body>

</html>
`;

self.addEventListener('install', e => {
  console.log('Install event:', e);
});

self.addEventListener('activate', e => {
  console.log('Activate event:', e);
});

self.addEventListener('fetch', async e => {
  console.log('Fetch event:', e);

  const url = e.request.url;
  if (url.includes('pages')) {
    const urlParts = url.split('/');
    const currentPage = parseInt(urlParts[urlParts.length - 1], 10);
    const nextPage = currentPage + 1;
    const html = template
      .replace(/\{\{currentPage\}\}/g, currentPage)
      .replace(/\{\{nextPage\}\}/g, nextPage);
    const response = new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
    e.respondWith(response);
  }
});
