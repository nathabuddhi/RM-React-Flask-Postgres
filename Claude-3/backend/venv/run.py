# run.py
from app import create_app, db
from app.models.user import MsUser

app = create_app()

# Shell context for Flask CLI
@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'MsUser': MsUser}

if __name__ == '__main__':
    app.run(debug=True)