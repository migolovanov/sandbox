const { send } = require('micro')
const { exec } = require('child_process')
const { router, get } = require('microrouter')

PATH='/opt/sandbox/'

const executeCmd = async (req, res) => {
  if (!req.query) { send(res, 404, '') }
  var msg = {
    error: true,
    message: 'Command error'
  }
  const data = {
    php: { path: '/usr/bin/php', key: PATH+'wrapper.php'},
    bash: { path: '/bin/bash.bak', key: PATH+'wrapper.sh'},
    python: { path: '/usr/bin/python', key: '-c'},
    python3: { path: '/usr/bin/python3', key: '-c'},
    ruby: { path: '/usr/bin/ruby', key: '-e'},
    perl: { path: '/usr/bin/perl', key: '-e'},
    javascript: { path: '/usr/bin/node', key: '-e'}
  }
  var cmd = {}
  for (var i in req.query) {
    if (data[i]) {
      cmd[i] = `${data[i].path} ${data[i].key} "${req.query[i]}"`
      cmd[i] = cmd[i].replace(/"/g,'\\"')
    }
  }
  
  if (cmd) {
    msg.message={}
    for (var j in cmd) {
      msg.message[j] = await new Promise(function (resolve, reject) {
            exec(cmd[j], {timeout: 20000}, (err, stdout, stderr) => {
              if (err) { resolve(err) }
              msg.error = false
              resolve({ 'stdout': stdout, 'stderr': stderr })
            })
        })
    }
  }

  send(res, 200, msg)
}

module.exports = router(
  get('/*', executeCmd)
)
