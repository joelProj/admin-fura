.DEFAULT_GOAL := build
.PHONY: build

PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

info:
	@echo "Available make commands:"
	@echo
	@echo "  $$ make"
	@echo "  $$ make dev"
	@echo "  $$ make watch"
	@echo "  $$ make start"
	@echo
	@echo "  $$ make todo"
	@echo "  $$ make depcheck"
	@echo "  $$ make info"
	@echo


build:
	webpack --config webpack.config.js

watch:
	webpack --watch --config webpack.config.js

run: build
	node server.js

dev:
	make watch &
	nodemon --watch api --watch lib --watch models server.js

todo:
	notes api/ lib/ models/ src/ || echo 'Install notes with npm install -g'

depcheck:
	depcheck

security:
	snyk wizard

security-test:
	snyk test

snyk-protect:
	snyk protect

####################################
## SERVER TARGETS

start:
	pm2 start process.yml
	pm2 dump

stop:
	pm2 stop process.yml

restart:
	@make stop
	@make start
