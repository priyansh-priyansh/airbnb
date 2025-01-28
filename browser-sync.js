const browserSync = require('browser-sync').create();
const nodemon = require('nodemon');

// Start BrowserSync server
browserSync.init({
  proxy: "http://localhost:8080", // The URL of your local server
  files: ["views/**/*.ejs", "public/**/*.*"], // Files to watch for changes
  port: 3000, // The port where BrowserSync will run
  notify: false // Disable notifications in the browser
});

// Start Nodemon to monitor for code changes
nodemon({
  script: 'app.js', // Your main server file
  ext: 'js ejs css', // File extensions to watch
}).on('restart', function () {
  console.log('Server restarted!');
  browserSync.reload(); // Reload browser when the server restarts
});