
from werkzeug.security import generate_password_hash

password = 'your_password'
hashed_password = generate_password_hash(password)

print(hashed_password)

