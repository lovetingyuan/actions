const https = require('https');

function get(url) {
  const { promise, resolve, reject } = new (function () {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  })();
  https
    .get(url, res => {
      let body = '';
      if (res.statusCode !== 200) {
        return reject(res.statusCode);
      }
      res.on('data', chunk => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    })
    .on('error', reject);
  return promise;
}

function post(url, data) {
  const { hostname, pathname, search } = new URL(url);
  data = JSON.stringify(data);
  const { promise, resolve, reject } = new (function () {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  })();
  const options = {
    hostname,
    port: 443,
    path: pathname + search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const response = [];
  const req = https.request(options, res => {
    if (res.statusCode !== 200) {
      reject(res.statusCode);
    } else {
      res.on('data', d => {
        response.push(d.toString('utf8'));
      });
      res.on('end', () => {
        resolve(JSON.parse(response.join('')));
      });
      res.on('error', reject);
    }
  });

  req.on('error', reject);

  req.write(data);
  req.end();
  return promise;
}

module.exports = {
  get,
  post,
};
