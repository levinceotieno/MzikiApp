
from flask import Flask, render_template, redirect, url_for, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_migrate import Migrate
import requests

app = Flask(__name__, static_url_path='/static')
app.secret_key = '0f1458de840d11bea92997376415cf66'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://mziki_user:rootmziki@localhost/mziki_player_db'
db = SQLAlchemy(app)
migrate = Migrate(app, db)
LASTFM_API_KEY = 'le3b907f32074f8a77ff09ed232225a132vi'

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

class ContactMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())

@app.before_request
def create_tables():
    db.create_all()

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.json.get('username')
        password = request.json.get('password')
        # Check if username or password is empty
        if not username or not password:
            return jsonify({'error': 'Username and password are required fields'}), 400
        # Check if password is at least four characters long
        if len(password) < 4:
            return jsonify({'error': 'Password must be at least four characters long'}), 400
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({'error': 'Username already exists'}), 400
        else:
            new_user = User(username=username)
            new_user.set_password(password)
            db.session.add(new_user)
            db.session.commit()
            session['user_id'] = new_user.id
            return jsonify({'message': 'User registered and logged in successfully'}), 200
    else:
        return jsonify({'error': 'Method not allowed'}), 405

@app.route('/index')
def index():
    if 'user_id' in session:
        # Fetch user_id from session
        user_id = session['user_id']
        # Fetch liked songs from the database
        liked_songs = Like.query.filter_by(user_id=user_id).all()
        return render_template('index.html', liked_songs=liked_songs)
    else:
        return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.json
        username = data.get('username')
        password = data.get('password')
        # check if the username exists in the database
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            session['user_id'] = user.id
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'error': 'Invalid username or password'}), 401
    else:
        # Handle GET request for login page
        return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('landing_page'))

@app.route('/')
def landing_page():
    return render_template("land.html")

@app.route('/contact-us', methods=['POST'])
def contact_us():
    # Handle the contact us form submission here
    name = request.form['name']
    email = request.form['email']
    message = request.form['message']

    # Optionally, you can save the message to your database or send an email

    return jsonify({'message': 'Message sent successfully'}), 200

@app.route('/api/like-song', methods=['POST'])
def like_song():
    # Get user ID from session
    user_id = session.get('user_id')
    if user_id:
        # Parse JSON data sent from frontend
        data = request.json
        song_id = data.get('song_id')

        # Check if the user has already liked the song
        existing_like = Like.query.filter_by(user_id=user_id, song_id=song_id).first()
        if existing_like:
            # Unlike the song (delete the existing like record)
            db.session.delete(existing_like)
            db.session.commit()
            return jsonify({'message': 'Song unliked successfully'}), 200
        else:
            # Like the song (create a new like record)
            new_like = Like(user_id=user_id, song_id=song_id)
            db.session.add(new_like)
            db.session.commit()
            return jsonify({'message': 'Song liked successfully'}), 200
    else:
        return jsonify({'error': 'User not logged in'}), 401

@app.route('/api/lastfm_info')
def get_lastfm_info():
    # Assuming you want information for a specific artist and song
    artist_name = request.args.get('artist')
    song_title = request.args.get('song')

    # Make a request to the Last.fm API
    api_key = '3b907f32074f8a77ff09ed232225a132'
    url = f'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key={api_key}&artist={artist_name}&track={song_title}&format=json'
    
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        # Extract relevant information from the response and return it
        # For example, you can return lyrics, duration, genre, etc.
        return jsonify(data)
    else:
        return jsonify({'error': 'Failed to fetch Last.fm info'}), 500

# Endpoint to get recommended songs from Last.fm API
@app.route('/api/lastfm_recommendations')
def lastfm_recommendations():
    artist = request.args.get('artist')
    genre = request.args.get('genre')

    # Make a request to the Last.fm API for song recommendations
    url = f'http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist={artist}&api_key={LASTFM_API_KEY}&format=json'
    response = requests.get(url)
    data = response.json()

    # Extract recommended songs from the Last.fm API response
    recommended_songs = []
    if 'similarartists' in data and 'artist' in data['similarartists']:
        similar_artists = data['similarartists']['artist']
        for similar_artist in similar_artists:
            recommended_songs.append({
                'title': similar_artist['name'],
                'artist': similar_artist['name'],  # You can customize this if needed
                'src': ''  # You can populate this with actual song URLs if available
            })

    return jsonify(recommended_songs)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

