# Sandbox
This sandbox can be used via API to execute PHP or Bash code in docker container. Detailed description could be found in [following article](https://waf.ninja/sandbox/)

# Docker
You can build docker container with following command
```
docker build . -f Dockerfile
```
or use already prepared one
```
docker run --rm --cpu-quota 50000 --stop-timeout 60 -v /data/files:/data/files 2d8ru/sandbox -c "/opt/sandbox/wrapper.sh \"echo 1\""
docker run --rm --cpu-quota 50000 --stop-timeout 60 -v /data/files:/data/files 2d8ru/sandbox -c "php /opt/sandbox/wrapper.php \"die('test');\""
```

# API install
To install go to api folder
```
cd api
npm install
./node_modules/micro/bin/micro.js index.js -l tcp://localhost:3000
```
Then you can send request to API with `php` or `bash` parameters
```
GET /?php=die(system("ls%26%26wget+http%3a//google.com>/dev/null"))%3b HTTP/1.1
Host: sandbox
Connection: close
```
and get similar response
```
{
   "error":false,
   "message":{
      "php":{
         "stdout":"bin\nboot\ndata\ndev\netc\nhome\nlib\nlib64\nmedia\nmnt\nopt\nproc\nroot\nrun\nsbin\nsrv\nsys\ntmp\nusr\nvar\nvar",
         "stderr":"",
         "cmd":"die(system(\"ls&&wget http://google.com>/dev/null\"));",
         "log":[
            "2018-10-25T15:34:54+00:00 PHP EXEC: ls&&wget http://google.com>/dev/null",
            "2018-10-25T15:34:54+00:00 BASH EXEC -c ls&&wget http://google.com>/dev/null",
            "2018-10-25 15:34:54.977360 http://google.com 200 /data/files/87cfa963345b55fbb75fa7c11b769dac"
         ]
      }
   }
}
```
