
from werkzeug.security import generate_password_hash

password = 'LEVIgrande@21'
hashed_password = generate_password_hash(password)

print(hashed_password)

