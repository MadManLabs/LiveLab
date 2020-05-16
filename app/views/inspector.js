'use strict'
const html = require('choo/html')
//const RTCInspector = require('./components/RTCInspector.js')
const Video = require('./components/funvideocontainer.js')
const panel = require('./components/panel.js')


module.exports = inspectorComponent

//const inspector = RTCInspector()
// <!--${inspector.render({
//   htmlProps: {
//
//   },
//   pc: state.ui.inspector.pc,
//   trackId: state.ui.inspector.trackId
// })}-->
//const previewVid = VideoEl()

function inspectorComponent (state, emit) {
  if(state.ui.inspector !== null){
    var media = state.media.byId[state.ui.inspector]
    var title = html`<span class="i">Track Info: ${state.peers.byId[media.peerId].nickname}-${media.name} </span> `
  var innerContents =  html`<div class="pa2 w-100" style="word-wrap: break-word;font-size:11px">
    ${Video({
       htmlProps: {
         class: 'h4 w4'
       },
       index: 'inspector',
       stream: state.media.byId[state.ui.inspector].stream,
       id: state.ui.inspector
     })}
      ${Object.keys(media.settings).map((kind) => html`
        <div class="pb1"><span class="i">${kind}: </span>
        ${Object.keys(media.settings[kind]).map((setting) => html`<div class="pb1"><span class="i">${setting}:${media.settings[kind][setting]} </span>` )}
      </div>`)}

    ${ media.peerId ===  state.user.uuid ? html`<div class="f6 fr ma2 link ph3 pv2 mb2 white bg-dark-pink pointer dib dim" onclick=${() => (emit('peers:hangupTrack', state.ui.inspector))}>Hangup</div>` : null }

    </div>`
    return panel(
      {
        htmlProps: {
          class: "w-100"
        },
        contents: innerContents,
        closable: true,
        header:   title,
        onClose: () => { emit('ui:setInspectMedia', null) }
      }
    )
  } else {
    return ''
  }
}
