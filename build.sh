#!/bin/bash
/bin/kill -9 $(ps -ef | egrep -i index.js |awk {'print'}) 2> /dev/null
source /home/tha81756/nodevenv/thanhtanvet/16/bin/activate && cd /home/tha81756/thanhtanvet
npm i && npm start &
