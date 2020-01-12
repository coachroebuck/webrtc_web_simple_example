let React = require('react');

function Content(props) {
  return (
    <html lang="en">
    <head>
    	<title>Viewer</title>
    	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    	<link href="./public/main.css" rel="stylesheet" />
    </head>
    <body>
    <video webkit-playsinline="true"
    playsinline autoplay controls></video>
    <script src="/socket.io/socket.io.js"></script>
    <script src="./public/index.js"></script>
    <script src="./public/watch.js"></script>
    </body>
    </html>

  );
}

module.exports = Content;
