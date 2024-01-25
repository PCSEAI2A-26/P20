from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

@app.route('/')
def index():
    return render_template('Login.html')

@app.route('/signup')
def signup():
    return render_template('Signup.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        return redirect(url_for('home'))
    else:
        return render_template('Login.html')

@app.route('/register', methods=['POST'])
def register():
    username = request.form.get('username')
    password = request.form.get('password')

    hashed_password = generate_password_hash(password)

    with app.app_context():
        new_user = User(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

    return redirect(url_for('home'))

@app.route('/home')
def home():
    return render_template('main.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)







