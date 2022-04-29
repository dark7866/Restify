#!/bin/bash
cd frontend/
npm install
npm run build
cd ../backend
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirments.txt
python3 manage.py makemigrations
python3 manage.py migrate
