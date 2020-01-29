#!/bin/bash
TARGET='quiz_admin'
IMAGE_TAG='quiz_admin_image'
FROM_IMAGE='quiz_admin_image'
RUNOPT="-p 19500:8080 --link quiz-mongo:mongo -v "$PWD"/.:/home/node/app"

if [ "$#" -ne "1" ]; then
	echo "Bad number of arguments"
	echo "Usage: start.sh <option> "
	echo "option: run | start | stop | build | shell | log | remove | remove_image"
	exit
fi

if [ "$1" == "run"  ]; then
	# echo "Runnnig $TARGET with options $RUNOPT"
	# if [ -z  $DB_USER ] || [ -z  $DB_PASSWORD ]; then
	# 	echo "Please set DB_USER and DB_PASSWORD env variables"
	# 	exit
	# fi
	docker run -d $RUNOPT  --name "$TARGET" "$FROM_IMAGE" /bin/bash /home/node/app/docker_start.sh
elif [ "$1" == "start"  ]; then
	echo "start"
	docker start "$TARGET"
elif [ "$1" == "stop"  ]; then
	echo "stop"
	docker stop "$TARGET"
elif [ "$1" == "build"  ]; then
	echo "building"
	docker build -t "$IMAGE_TAG" .
elif [ "$1" == "shell"  ]; then
	echo "shell"
	#docker exec -it  "$TARGET" /bin/bash
	docker run -it $RUNOPT  --name "$TARGET" "$FROM_IMAGE" /bin/bash
elif [ "$1" == "logs"  ]; then
	echo "Connecting to container log"
	docker logs -f  "$TARGET"
elif [ "$1" == "remove"  ]; then
	echo "Removing container"
	docker rm -f  "$TARGET"
elif [ "$1" == "remove_image"  ]; then
	echo "Removing container"
	docker rmi  "$IMAGE_TAG"
else
	echo "Nothing to do unrecognized command"
fi

