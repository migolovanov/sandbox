cmd=${@/eval/}
if [[ -z "$cmd" ]]
then
    cmd=$(cat)
    echo "$(date --iso-8601=seconds) BASH EXEC $cmd" >> /data/logs.log
    eval $cmd
else
    cmd="${cmd//bash/bash.real}"
    if [[ $cmd == "-c "* ]]
    then
        cmd=${cmd:3:${#cmd}}
    fi
    echo "$(date --iso-8601=seconds) BASH EXEC $cmd" >> /data/logs.log
    eval $cmd
fi
