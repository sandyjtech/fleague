from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from config import db, bcrypt

# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = "users"    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    username = db.Column(db.String(15), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    _password = db.Column(db.String, nullable=False) 
        
    user_posts = db.relationship("Post", backref="user", cascade="delete")
    post_comments = db.relationship("Comment", backref="user", cascade="delete")
    my_team = db.relationship("FantasyTeam", backref="user", cascade="delete")
    my_players = association_proxy("my_team", "team_player")
    leagues = association_proxy('league_members', 'league')
    user_post_comments = association_proxy("Post", "post_comments")    
    serialize_rules = ("-user_posts",
                       "-post_comments",
                       "-my_team",
                       "-leagues.league_members.user", "-user_post_comments.post_comments",)
    
    @validates('email')
    def validate_email(self, key, email):
        if '@' not in email:
            raise ValueError("Invalid email format")
        return email
    
    @validates("password")
    def validate_password(self, key, value):
        if len(value) < 6:
            raise ValueError("Password must be at least 6 characters long.")

        if not any(char in "!@#$%^&*()_-+=<>?/~." for char in value):
            raise ValueError("Password must contain at least one special character.")

        if not any(char.isupper() for char in value):
            raise ValueError("Password must contain at least one uppercase letter.")

        if not any(char.isdigit() for char in value):
            raise ValueError("Password must contain at least one digit.")

        return value       
    
    @hybrid_property
    def password(self):
        return self._password

    @password.setter
    def password(self, plaintext_password):
      
        hashed_password = bcrypt.generate_password_hash(plaintext_password.encode("utf-8"))
        self._password = hashed_password.decode('utf-8')

    def check_password(self, plaintext_password): 
        return bcrypt.check_password_hash(self._password, plaintext_password.encode('utf-8'))
        
    def __repr__(self):
        return f'User (id={self.id}, username={self.username})'

class LeagueMember(db.Model, SerializerMixin):
    __tablename__ ="league_members"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    league_id = db.Column(db.Integer, db.ForeignKey('leagues.id'))
    role = db.Column(db.String)
      
class League(db.Model, SerializerMixin):
    __tablename__ = "leagues"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    name = db.Column(db.String, nullable=False)
    members = db.relationship(LeagueMember, backref="league")

    serialize_rules = ("-members",)

class Post(db.Model, SerializerMixin):
    __tablename__ = "posts"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_comments = db.relationship("Comment", backref="post", cascade="delete")
    serialize_rules = ("-post_comments.post.post_comments",)
     
class Comment(db.Model, SerializerMixin):
    __tablename__ = "comments"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    content = db.Column(db.String(255), nullable=False)    
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))    
    
    serialize_rules = ("-post.post_comments.post",)
    
class FantasyTeam(db.Model, SerializerMixin):
    __tablename__ = "fantasy_teams"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    name = db.Column(db.String())      
    team_players = db.relationship("FantasyPlayer", backref="fantasy_team")
    players = association_proxy("team_players", "player")
    
    
    serialize_rules = ("-team_players", "-fantasy_team",)

class FantasyPlayer(db.Model, SerializerMixin):
    __tablename__ = "fantasy_players"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    nfl_player_id = db.Column(db.String, db.ForeignKey("nfl_players.id"))
    fantasy_team_id = db.Column(db.Integer, db.ForeignKey("fantasy_teams.id"))
    is_benched = db.Column(db.Boolean)
    
    performances = db.relationship(
        "PlayerPerformance",
        primaryjoin="FantasyPlayer.id == PlayerPerformance.fantasy_player_id",
        backref="fantasy_player", cascade="delete"
    )
 
    serialize_rules = ("-performances.fantasy_player", "-performances",)

class PlayerPerformance(db.Model, SerializerMixin):
    __tablename__ = "player_performances"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    fantasy_player_id = db.Column(db.Integer, db.ForeignKey("fantasy_players.id"))
    week_num = db.Column(db.Integer)
    match_id = db.Column(db.String)
    ppr_points = db.Column(db.Float, default=0.0)
    standard_points = db.Column(db.Float, default=0.0)
    serialize_rules = ("-fantasy_player",)

class NFLPlayer(db.Model, SerializerMixin):
    __tablename__ = "nfl_players"
    id = db.Column(db.String, primary_key=True, unique=True, nullable=False)    
    fantasy_data_id = db.Column(db.Integer, nullable=True)
    espn_id = db.Column(db.String, nullable=True)
    stats_id = db.Column(db.String, nullable=True)
    status = db.Column(db.String, nullable=True)
    first_name = db.Column(db.String(255), index=True)  # Index this column
    last_name = db.Column(db.String(255), index=True)
    age = db.Column(db.Integer, nullable=True)
    height = db.Column(db.String, nullable=True)
    weight = db.Column(db.String, nullable=True)
    position = db.Column(db.String, nullable=True)
    college = db.Column(db.String, nullable=True)
    number = db.Column(db.Integer, nullable=True)
    team = db.Column(db.String, nullable=True)
    years_exp = db.Column(db.Integer, nullable=True)
    injury_status = db.Column(db.String, default="Active", nullable=True)

    # Add columns for additional fields from the API response
    hashtag = db.Column(db.String, nullable=True)
    # Add other fields as needed
    f_players = db.relationship("FantasyPlayer", backref="nfl_player", cascade="delete")
    fantasy_positions = db.relationship("NFLPlayerFantasyPosition", backref="nfl_player", cascade="delete")
    serialize_rules = ("-fantasy_positions", "-f_players.nfl_player", "-nfl_player.f_players",)
    
class NFLPlayerFantasyPosition(db.Model, SerializerMixin):
    __tablename__ = "nfl_player_fantasy_positions"
    id = db.Column(db.Integer, primary_key=True)
    nfl_player_id = db.Column(db.Integer, db.ForeignKey("nfl_players.id"))
    fantasy_position = db.Column(db.String)
