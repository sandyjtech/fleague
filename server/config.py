# Standard library imports

# Remote library imports
import secrets
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_socketio import SocketIO  # Import Flask-SocketIO

# Instantiate app, set attributes
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Secret Key
app.secret_key = secrets.token_hex(16)

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
db.init_app(app)
migrate = Migrate(app, db)

# Instantiate CORS
CORS(app, resources={r"/socket.io/*": {"origins": "http://localhost:3000"}})

# Instantiate REST API
api = Api(app)

# Instantiate Flask-Bcrypt
bcrypt = Bcrypt(app)

# Instantiate Flask-SocketIO
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")
