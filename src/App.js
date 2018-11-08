import React, { Component } from 'react';
import Peer from 'peerjs';


class App extends Component {
  constructor(props){
    super(props)
    this.state ={conversations:[]}
  }

  componentDidMount(){
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    const {location} = window;
    const self = this;
    this.peer = new Peer({key: 'lwjd5qra8257b9', debug: 2});   
    
    this.peer.on('open', id=>{
      console.log('open', id)
      self.setState({id})
    });

    this.peer.on('call', call=>{
      navigator.getUserMedia({video: true, audio: true}, function(stream) {
        call.answer(stream);
        call.on('stream', rStream=>{
          console.log('stream', rStream)
          self.setState({video_url: window.URL.createObjectURL(rStream)})
        })
      })
    })
  }

  onTextChange(key, evt){
    let state = this.state;
    state[key] = evt.target.value;
    this.setState(state);
  }
  call(){
    const{peer_id} = this.state;
    const self = this;

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    navigator.getUserMedia({video: true, audio: true}, function(stream) {
      var call = self.peer.call(peer_id, stream);
      call.on('stream', function(remoteStream) {
        self.setState({video_url: window.URL.createObjectURL(remoteStream)})
      });
    }, function(err) {
      console.log('Failed to get local stream' ,err);
    });
  }

  send(){
    let {conversations, message} = this.state;
    conversations.push(`me: ${message}`);
    this.p.send(message)
    message = ""
    this.setState({conversations, message});

  }

  render() {
    const {id, peer_id, conversations, message, video_url} = this.state;
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {id? <p>{id}</p>: null}
        <textarea placeholder='Peer id' value={peer_id} onChange={this.onTextChange.bind(this, 'peer_id')}></textarea>
        <button onClick={this.call.bind(this)}>call</button>

        {video_url? <video src={video_url} autoPlay={true} ></video>:null}
      </div>
    );
  }
}

export default App;
