'use strict'

const html = require('choo/html')
const Modal = require('./components/modal.js')
const Dropdown = require('./components/dropdown.js')
const Video = require('./components/funvideocontainer.js')
// const radioSelect = require('./components/radioSelect.js')
const settingsUI = require('./components/settingsUI.js')
const input = require('./components/smallInput.js')

module.exports = addMedia

const audioDropdown = Dropdown()
const videoDropdown = Dropdown()

function addMedia (devices, emit, opts) {
  var showElement = opts.showElement
  var audioinput = devices.audioinput
  var videoinput = devices.videoinput
  var defaultAudio = devices.default.inputDevices.audio
  var defaultVideo = devices.default.inputDevices.video



  return html`

  ${Modal({
    show: showElement,
    header: "Add New Media to Current Call",
    contents: html`<div id="add broadcast" class="pa3 f6 fw3">
    <div class="mt2">
    ${input('Label', 'Label', {
      value: devices.default.name,
      class: 'w8',
      onkeyup: (e) => {
        emit('devices:setBroadcastName', e.target.value)
      }
    })}
    </div>

    ${videoDropdown.render({
      value: 'Video:  ' + (defaultVideo === null ? '' : videoinput.byId[defaultVideo].label),
      options: videoinput.all.map((id) => (
        {
          value: id,
          label: videoinput.byId[id].label
        }
      )),
      onchange: (value) => {
        emit('devices:setDefaultVideo', value)
      }
    })}

    <div class="w-100 db flex mt2">
    <div class="w10 h10 dib fl">

    ${Video({
      htmlProps: {
        class: 'w-100 h-100',
        style: 'object-fit:contain;'
      },
      index: "addMedia",
      track: devices.default.previewTracks.video,
      id: devices.default.previewTracks.video === null ? null : devices.default.previewTracks.video.id
    })}
    </div>
    <div class="w-60 dib fl pa4">
    <h4>Apply constraints</h4>
    <p>
    Note: Actual resolution and frame rate depend on the capabilities of your camera or input device.
    </p>
    <p>
    Use these fields to apply constraints to the media stream. Your device will attempt to meet those constraints, and display the resulting stream to the left.
    </p>

    ${Object.keys(devices.default.constraints.video).map((constraint) => input(constraint, "",
    {
      value: devices.default.constraints.video[constraint],
      onkeyup: (e) => updateBroadcastConstraint(constraint, e.srcElement.value)
    })
  )}

  </div>
  </div>
  <div class="mt2 mb4 i">Actual video dimensions:  ${devices.default.trackInfo.video.width}x${devices.default.trackInfo.video.height}, ${devices.default.trackInfo.video.frameRate}fps</div>
  ${opts.addNewStream && opts.addNewStream === true? html`
    <div class="f6 link dim ph3 pv2 mb2 dib white bg-gray pointer" onclick=${() => (emit('devices:toggleSettings'))}>Cancel</div>
    <div class="f6 link dim ph3 pv2 mb2 dib white bg-dark-pink pointer" onclick=${() => (emit('devices:addNewMediaToBroadcast'))}>Add Media</div>` : ''}
    </div>`,
    close: () => (emit('devices:toggleSettings', false))
  })}
  `
  //
  // <p>
  // See <a href="https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API/Constraints"> Media Streams documentation </a> for more information about constraints and settings.
  // </p>

  function setBroadcastKind(e){
    emit('devices:setBroadcastKind', e.target.value)
  }

  function updateBroadcastConstraint(constraint, value){
    console.log('updating', constraint, value)
    emit('devices:updateBroadcastConstraint', {
      kind: 'video',
      constraint: constraint,
      value: parseInt(value)
    })
  }

  function updateBroadcastConstraints(updateObject){
    emit('devices:updateBroadcastConstraints', updateObject)
  }


}
