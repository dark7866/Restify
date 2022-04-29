#!/bin/bash
serve -s frontend/build &
source backend/venv/bin/activate
python3 backend/manage.py runserver
