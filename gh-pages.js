const ghPages = require('gh-pages');

ghPages.publish(
  'build',
  {
    message: 'Auto-generated commit'
  },
  error => {
    if (error) {
      throw error;
    }
  }
);
