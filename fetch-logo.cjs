const https = require('https');

https.get('https://claude.ai/api/artifacts/053a7263-d944-4964-a0d8-8d1c7789714c/content', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(data);
  });
}).on('error', (err) => {
  console.error(err);
});
