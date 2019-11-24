/* eslint-disable no-console */

let storageKey = 'temp'
let tileSize
let world
let camera

function rleEncode (level) {
  const out = []
  let prev
  let amount = 0
  for (const val of level) {
    if (val === prev) {
      amount++
    } else {
      if (prev !== undefined) {
        out.push(prev)
        out.push(amount)
      }
      prev = val
      amount = 1
    }
  }
  out.push(prev)
  out.push(amount)
  return out
}

function rleDecode (levelData) {
  const pairs = levelData.reduce((result, value, index, array) => {
    if (index % 2 === 0) {
      result.push(array.slice(index, index + 2))
    }
    return result
  }, [])
  const level = []
  for (const val of pairs) {
    for (let i = 0; i < val[1]; i++) {
      level.push(val[0])
    }
  }
  return level
}

function saveLevelString (world) {
  const rleWorld = { ...world }
  rleWorld.map = rleEncode(world.map)
  const dataAsString = JSON.stringify(rleWorld)
  /*  const dataEl = document.querySelector('.levelData')
  dataEl.innerText = dataAsString */
  localStorage.setItem(storageKey, dataAsString)
  console.log('saved as')
  console.log(rleWorld.map)
  console.log(rleDecode(rleWorld.map))
}


let brush = 1

export const editor = {
  startEditor: function startEditor (canvas, scale, newWorld, newTileSize, newPlayer, newStorageKey, newCamera) {
    storageKey = newStorageKey
    tileSize = newTileSize
    world = newWorld
    camera = newCamera
    function getMouseXYFromEvent (e) {
      const x = event.offsetX * canvas.width / canvas.offsetWidth / scale
      const y = event.offsetY * canvas.height / canvas.offsetHeight / scale
      return { x, y }
    }

    function mouseMove (e) {
      if (!window.editMode) return
      const pos = getMouseXYFromEvent(e)
      pos.x += camera.pos.x - canvas.width / 2 / scale
      pos.y += camera.pos.y - canvas.height / 2 / scale
      const tile = { x: Math.floor(pos.x / tileSize), y: Math.floor(pos.y / tileSize) }
      const i = tile.x + tile.y * world.width
      if (tile.x < 0 || tile.y < 0 || tile.x >= world.width || tile.y >= world.height) return
      if (e.buttons === 1) {
        world.map[i] = brush
        saveLevelString(world)
      }
      if (e.buttons === 2) {
        world.map[i] = 0
        saveLevelString(world)
      }
    }

    canvas.addEventListener('mousemove', mouseMove)
    canvas.addEventListener('mousedown', mouseMove)
    canvas.addEventListener('contextmenu', function (e) {
      if (window.editMode) e.preventDefault()
    })

    const brushes = {
      '1': 1,
      '2': 6,
      '3': 7,
      '4': 16,
      '5': 17,
      '6': 2,
      '7': 15,
      '8': 8
    }

    window.addEventListener('keydown', function (e) {
      brush = brushes[e.key] || brush
    })
  },
  rleDecode,
  rleEncode
}
