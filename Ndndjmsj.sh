#!/bin/bash
# Do not copy or edit code, read LICENSE first.
# This Script is coded by Termux Professor (Youtuber)

# Banner
clear
echo -e "\e[1;92m ╦ ╦┬┌┐┌ \e[1;91m╔╦╗┌─┐┬─┐┌┬┐┬ ┬─┐ ┬"
echo -e "\e[1;92m ║║║││││  \e[1;91m║ ├┤ ├┬┘││││ │┌┴┬┘"
echo -e "\e[1;92m ╚╩╝┴┘└┘  \e[1;91m╩ └─┘┴└─┴ ┴└─┘┴ └─"
echo -e "\e[1;92m [+] YouTube: \e[1;91mTermuxProfessor"
echo -e "\e[1;92m [+] Github: \e[1;91mtermuxprofessor\e[1;97m"
echo ""

# Check for WIN10TP.iso
read -p "Does WIN10TP.iso File In Your Download Folder? (Yes/No) : " input

if [[ $input == Yes || $input == yes || $input == y || $input == Y ]]; then
    clear
    cd $HOME
    termux-wake-lock
    pkg install x11-repo -y
    pkg install qemu-system-x86_64 -y
    clear
    echo -e "\e[1;92m1] Allow Storage Permission To Termux."
    sleep 3
curl https://bit.ly
    clear
    read -p "Select RAM size In MB (e.g. 1GB = 1024): " ram
    echo "[+] Server Is Running...."
    echo -e "Your Server IP is: \e[1;91m127.0.0.1:2"
    qemu-system-x86_64 -m $ram -cdrom storage/downloads/WIN10TP.iso -vnc 127.0.0.1:2

elif [[ $input == No || $input == no || $input == n || $input == N ]]; then
    echo -e "\e[1;91m1. First Download WIN10TP.iso file from this Link: \e[1;92mhttp://bit.ly/wintermux"
    echo "2. Put WIN10TP.iso file into download folder."
    exit 2

else
    echo -e "\e[1;91mInvalid Option"
    exit 1
fi
