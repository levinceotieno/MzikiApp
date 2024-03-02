
from flask import Flask, render_template, redirect, url_for, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__, static_url_path='/static')
app.secret_key = '0f1458de840d11bea92997376415cf66'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://mziki_user:rootmziki@localhost/mziki_player_db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    likes = db.relationship('Like', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    song_id = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())

class Song(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    artist = db.Column(db.String(255), nullable=False)
    src = db.Column(db.String(255), nullable=False)

# API routes for web client communication
@app.route('/api/recommended_songs')
def get_recommended_songs():
    if 'user_id' not in session:
        return jsonify({'error': 'User not logged in'}), 401

    user_id = session['user_id']
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    liked_songs = [like.song_id for like in user.likes]
    if not liked_songs:
        return jsonify({'error': 'No liked songs found'}), 404

    recommended_songs = []
    for song_id in liked_songs:
        song = Song.query.get(song_id)
        if song:
            recommended_songs.append({
                'title': song.title,
                'artist': song.artist,
                'src': song.src
            })

    return jsonify(recommended_songs)

@app.route('/api/like_song/<int:song_id>', methods=['POST'])
def like_song(song_id):
    if 'user_id' not in session:
        return jsonify({'error': 'User not logged in'}), 401

    user_id = session['user_id']
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Check if the song is already liked by the user
    if Like.query.filter_by(user_id=user_id, song_id=song_id).first():
        return jsonify({'error': 'Song already liked'}), 400

    # Add the song to the user's liked songs
    like = Like(user_id=user_id, song_id=song_id)
    db.session.add(like)
    db.session.commit()

    return jsonify({'message': 'Song liked successfully'})

# Add more API routes as needed

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return 'Username already exists'
        else:
            new_user = User(username=username)
            new_user.set_password(password)
            db.session.add(new_user)
            db.session.commit()
            return 'User registered successfully'
    else:
        return render_template('register.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        session['user_id'] = user.id
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect('/')

@app.route('/')
def index():
    if 'user_id' in session:
        return render_template('index.html')
    else:
        return redirect(url_for('login'))

@app.route('/contact-us', methods=['POST'])
def contact_us():
    # Handle the contact us form submission here
    name = request.form['name']
    email = request.form['email']
    message = request.form['message']

    # Optionally, you can save the message to your database or send an email

    return jsonify({'message': 'Message sent successfully'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

