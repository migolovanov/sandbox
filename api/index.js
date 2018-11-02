const fs = require('fs');
const { send, json } = require('micro')
const { exec } = require('child_process')
const { router, get, post } = require('microrouter')
const parse = require('urlencoded-body-parser');

PATH='/opt/sandbox/'

const executeCmd = async (req, res) => {

  var body = {}
  if (req.headers["content-type"]) {
    if (req.headers["content-type"].indexOf("application/x-www-form-urlencoded") != -1) {
      body = await parse(req)
    } else if (req.headers["content-type"].indexOf("application/json") != -1) {
      body = await json(req)
    }
  }

  var msg = {
    error: true,
    message: 'Command error'
  }
  const data = {
    php: { path: '/usr/bin/php', key: PATH+'wrapper.php'},
    bash: { path: '/bin/bash.real', key: PATH+'wrapper.sh'},
    python: { path: '/usr/bin/python', key: '-c'},
    python3: { path: '/usr/bin/python3', key: '-c'},
    ruby: { path: '/usr/bin/ruby', key: '-e'},
    perl: { path: '/usr/bin/perl', key: '-e'},
    javascript: { path: '/usr/bin/node', key: '-e'}
  }
  var cmd = {}

  args={}
  for (i in req.query) {
    args[i]=req.query[i]
  }
  if (body) {
    for (i in body) {
      args[i]=body[i]
    }
  }
  if (Object.keys(args).length == 0) { send(res, 404, '') }

  for (var i in args) {
    if (data[i]) {
      var command=args[i].replace(/(["$`\\])/g,'\\\\\\$1')
      command=`"${data[i].path} ${data[i].key} \\\"${command}\\\" && echo '---- LOG ----' && cat /data/logs.log"`
      cmd[i] = {
        "payload": args[i],
        "cmd": `docker run --rm --cpu-quota 50000 --stop-timeout 60 -v /data/files:/data/files 2d8ru/sandbox -c ${command}`
      }
      console.log(cmd[i].cmd)
    }
  }
  
  if (cmd) {
    msg.message={}
    for (var j in cmd) {
      msg.message[j] = await new Promise(function (resolve, reject) {
        exec(cmd[j].cmd, {timeout: 60000}, (err, stdout, stderr) => {
          if (err) {
            console.log(stderr)
            resolve(err)
          }
          msg.error = false
          resolve({ 'stdout': stdout, 'stderr': stderr })
        })
      })
      msg.message[j].cmd=cmd[j].payload
      if (msg.message[j].stdout) {
        [msg.message[j].stdout, msg.message[j].log]=msg.message[j].stdout.split("---- LOG ----\n")
        if (msg.message[j].log) {
          msg.message[j].log=msg.message[j].log.split("\n").filter(Boolean)
          for (var line in msg.message[j].log) {
            await fs.appendFile('/data/logs.log', msg.message[j].log[line] + "\n", function (err) {
              if (err) throw err
            });
          }
        }
      }
    }
  }

  send(res, 200, msg)
}

module.exports = router(
  get('/*', executeCmd),
  post('/*', executeCmd)
)
