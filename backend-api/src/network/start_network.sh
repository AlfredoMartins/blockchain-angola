#!/bin/sh

argv=$1

declare -a pids=()
declare full_node_pid="-1"

# Print the MAIN MENU
printHeader(){
    clear
    now=`date`
    echo "======================================================================"
    echo "Made by: MARTINS Alfredo | ELTE, Budapest $now"
    echo "======================================================================"
    echo ":: WELCOME TO THE ELECTION DATA CENTER ::"
    echo "OPTIONS:"
        echo "\t:: X - Start the full node ::"
        echo "\t:: A <NUMBER> - Add a new or more nodes ::"
        echo "\t:: L - List nodes ::"
        echo "\t:: S <ID_0, ID_1, ... > - Stop nodes ::"
        echo "\t:: E - Stop & Exit the server ::"
    
    askOption
}

resetPids() {
    for index in "${!pids[@]}"; do
        kill $index 
    done
}

startFullNode(){
    #Kill the existing full node
    if [ "$full_node_pid" != "-1" ]; then
        echo "\t Sorry. It is not allowed to have more than 1 full node running!"
    else
        tsnd --respawn src/network.ts 3010 & # Start Node.js server in the background
        pids+=($!) # Append the new PID
        full_node_pid=$!
        echo "Server started and running! Verify by listing the nodes \"L\" command."
    fi

    sleep 2
    printHeader
}

addNewNode(){
    local parameter="$1"
    
    isNumber=`echo $parameter | grep "\<[0-9]\+\([0-9]\+\)*\>" -o`
    numberOfNodes=`echo $isNumber | wc -w`

    if [ "$numberOfNodes" -gt 0 ]; then
        if [ "$parameter" -gt 4 ]; then
            parameter=4 # Lets limit the number of clients running
        fi

        for ((counter=0; counter<$parameter; counter++)); do
            node client.js & # Execute client-side Node.js script
            pids+=($!) # Append the new PID
            echo "New node started and running! Verify by listing the nodes \"L\" command."
        done
    else
        echo "Invalid parameter. Please enter a valid number !!!"
    fi

    sleep 2
    printHeader
}

listNodes(){
    echo "Node PIDs of background processes:"
    for index in "${!pids[@]}"; do
        if [ "$full_node_pid" = "${pids[$index]}" ]; then
            echo "\tNode $index -> PID ${pids[$index]} [FULL NODE]"
        else
            echo "\tNode $index -> PID ${pids[$index]}"
        fi
    done

    sleep 5
    printHeader
}

removePid() {
    local currentPid="$1"

    remaining_pids=()
    for pid in "${pids[@]}"; do
        if [ "$pid" != "$currentPid" ]; then
            remaining_pids+=("$pid")
        fi
    done

    pids=("${remaining_pids[@]}")
}

stopNodes(){
    local arrayString="$1"
    IFS=' ' read -r -a string_array <<< "$arrayString"

    echo "${pids[@]}"

    for pid in "${pids[@]}"; do
        kill $pid
        removePid $pid
        echo "\tNode $index stopped sucessfully! :)"
        listNodes
    done

    sleep 3
    printHeader
}

printfInvalidOperation(){
    echo "!!! ALERT !!!"
    echo "==> Invalid operation <=="
}

dismiss(){
    echo "Network shut down :). Any further requests will be denied ..."
    echo "THANK YOU FOR USING MY SCRIPT :) $(date)"
    echo "Copyright© ELTE 2024, MARTINS Alfredo"
    exit 0
}

askOption() {
    printf "Enter the option: "
    read OPTION
    OPTION=$(echo "$OPTION" | tr 'a-z' 'A-Z') # Convert to UPPERCASE
    FIRST_CHAR="${OPTION:0:1}"

    echo ""

    if [ "$OPTION" = "X" ]; then
        startFullNode
    elif [ "$FIRST_CHAR" = "A" ]; then
        addNewNode "${OPTION:1}"
    elif [ "$OPTION" = "L" ]; then
        listNodes
    elif [ "$FIRST_CHAR" = "S" ]; then
        stopNodes "${OPTION:1}"
    elif [ "$OPTION" = "E" ]; then
        dismis
    else
        printfInvalidOperation
        sleep 1
        printHeader
    fi
}


echo "$FILE"

# The script execution starts here ...

if [ $# -eq 0 ]; then
    echo "Wait, you forgot to pass the parameter via the terminal line. Please do it next time. :)"
elif [ "$1" = "$default" ]; then
    startFullNode
else
    printHeader
fi

wait