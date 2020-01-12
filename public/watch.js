/*global socket, video, config*/
let peerConnection;

socket.on('offer', function(id, description) {
	console.log('offer received...')
	peerConnection = new RTCPeerConnection(config);
	peerConnection.setRemoteDescription(description)
	.then(() => peerConnection.createAnswer())
	.then(sdp => peerConnection.setLocalDescription(sdp))
	.then(function () {
		console.log('submitting answer...')
		socket.emit('answer', id, peerConnection.localDescription);
	});
	peerConnection.ontrack = function(event) {
		console.log('stream received...')
		video.srcObject = event.streams[0];
	};
	peerConnection.onicecandidate = function(event) {
		console.log('on ice candidate...')
		if (event.candidate) {
			socket.emit('candidate', id, event.candidate);
		}
	};
});

socket.on('candidate', function(id, candidate) {
	console.log('candidate received...')
  peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
  .catch(e => console.error(e));
});

socket.on('connect', function() {
	console.log('connected...')
	socket.emit('watcher');
});

socket.on('broadcaster', function() {
	console.log('broadcaster received...')
  socket.emit('watcher');
});

socket.on('bye', function() {
	console.log('disconnected...')
	peerConnection.close();
});