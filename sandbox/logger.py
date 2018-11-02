#!/usr/bin/python
import re
import sys
import hashlib
import requests
from datetime import datetime

for i in sys.argv:
    if re.match("^http", i, re.I):
        r=requests.get(i)
        m = hashlib.md5()
        m.update(r.content)
        with open("/data/files/{}".format(m.hexdigest()),"w") as f:
            f.write(r.content)
        with open("/data/logs.log", "a") as f:
            f.write("{} {} {} /data/files/{}\n".format(datetime.now(),i,r.status_code,m.hexdigest()))
        print(r.content)
