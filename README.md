# Aroma Lab — Flask MVP

## Run
```bash
pip install flask
python app.py
```
Open http://127.0.0.1:5000/

## Routes
- `/` Landing page (Hero, Features, Contact)
- `/login` Admin login (username: `admin`, password: `1234`)
- `/admin` Protected — Product CRUD (create/read/update/delete)
- `/pos` POS prototype

## Files
```
aroma_lab/
├── app.py                  # Flask backend
├── aroma_lab_en.db         # SQLite database
├── aroma_lab_sqlite_en.sql # Schema (reference)
└── templates/
    ├── landing.html
    ├── login.html
    ├── admin.html
    └── pos.html
```
