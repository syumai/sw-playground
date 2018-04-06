const { promisify } = require('util');

const fs = require('fs');
const basePath = './basic-progressive-blog';

const dataTxt = fs.readFileSync(`${basePath}/articlesData.json`);
const articles = JSON.parse(dataTxt);

const template = fs.readFileSync(`${basePath}/template.html`).toString();

const renderLinks = articles =>
  articles
    .map(
      ({ id, title }) => `<li>
  <a href="/sw-playground/basic-progressive-blog/articles/${id}.html">Article id: ${id}, title: ${title}</a>
</li>`
    )
    .join('\n');

const renderArticle = ({ id, title, date, content }, links) =>
  template
    .replace(/\{\{title\}\}/g, title)
    .replace(/\{\{date\}\}/g, new Date(date).toString())
    .replace(/\{\{content\}\}/g, content)
    .replace(/\{\{links\}\}/g, links);

const links = renderLinks(articles);

for (const article of articles) {
  const html = renderArticle(article, links);
  fs.writeFile(`${basePath}/articles/${article.id}.html`, html, err => {
    if (err) {
      return console.error(err);
    }
    console.log(`Generated ${basePath}/articles/${article.id}.html`);
  });
}
