
from flask import Flask, render_template, request, redirect, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# Create Flask application instance
app = Flask(__name__, static_url_path='/static')
app.secret_key = 'your_secret_key'

# Configure SQLAlchemy to connect to MySQL database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://mziki_user:rootmziki@localhost/mziki_player_db'

# Initialize SQLAlchemy extension
db = SQLAlchemy(app)

# Define User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    likes = db.relationship('Like', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Define Like model
class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    song_id = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())

# Registration route
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        # Check if username already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return 'Username already exists'
        else:
            # Create new user and add to database
            new_user = User(username=username)
            new_user.set_password(password)
            db.session.add(new_user)
            db.session.commit()
            return 'User registered successfully'
    else:
        return render_template('register.html')  # Render registration form for GET requests

# Login route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            session['user_id'] = user.id
            return redirect('/')  # Redirect to home page after successful login
        else:
            return 'Invalid username or password'  # Display error message if login fails
    else:
        return render_template('login.html')  # Render login form for GET requests

# Logout route
@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect('/')  # Redirect to home page after logout

# Home route
@app.route('/')
def index():
    if 'user_id' in session:
        # Fetch user details from session and perform actions for logged-in user
        return 'Logged in as user ID: ' + str(session['user_id'])
    else:
        return 'Not logged in'

# Run the Flask application
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)

