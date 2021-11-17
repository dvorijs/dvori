#!/bin/bash
set -e

if [[ -z $1 ]]; then
  echo "Enter Package name: "
  read -r PACKAGE_NAME
else
  PACKAGE_NAME=$1
fi

read -p "Creating $PACKAGE_NAME - are you sure? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Creating $PACKAGE_NAME ..."
  mkdir -p ./packages/$PACKAGE_NAME/{src,tests}
  touch ./packages/$PACKAGE_NAME/tests/index.test.js
  npm init -w ./packages/$PACKAGE_NAME -y
fi