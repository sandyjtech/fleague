#!/usr/bin/env python3
# app.py
# Remote library imports
from flask import abort, request, session
from sqlite3 import IntegrityError
from flask import Flask, make_response, jsonify, request, session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_
import random
import logging

# Local imports
from config import app,api, Resource, db
from models import User, LeagueMember,League, Post, Comment, FantasyTeam, FantasyPlayer, PlayerPerformance, NFLPlayer, NFLPlayerFantasyPosition 

####### Handling Authorization #####
class Signup(Resource):
    def post(self):
        req_json = request.get_json()
        try:
            new_user = User(
                username=req_json["username"],
                email=req_json["email"], 
                password=req_json["password"]                             
            )
            db.session.add(new_user)
            db.session.commit()
            session["user_id"] = new_user.id
            return make_response(new_user.to_dict(), 201)
        except:
            abort(422, "Invalid user data")
        db.session.add(new_user)
        db.session.commit()
        session["user_id"] = new_user.id
        return make_response(new_user.to_dict(), 201)
    
class Login(Resource):
    def post(self):
        req_json = request.get_json()
        username = req_json['username']
        password = req_json['password']

        # Retrieve the user instance using the provided username
        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            session['user_id'] = user.id
            return user.to_dict(), 200
        return {'error': 'Invalid username or password'}, 401

class Logout(Resource):

    def delete(self): # just add this line!
        session['user_id'] = None
        return {'message': '204: No Content'}, 204

class Authorized(Resource):
    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            return make_response(user.to_dict(), 200)
        else:
            return make_response({"Error": "User not found"}, 401)
api.add_resource(Authorized, '/authorized')   
api.add_resource(Signup, "/signup")
api.add_resource(Login, "/login")
api.add_resource(Logout, '/logout')
#UserDetails###########################################
class UserDetailsById(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            raise ValueError("User not found")        
        return make_response(user.to_dict(), 200)
    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({"error": "User not found"}, 404)
        db.session.delete(user)
        db.session.commit()
        return make_response("", 204)
api.add_resource(UserDetailsById, '/users/<int:id>')
#Posts#####################################
class PostResource(Resource):
    def get(self):
        posts = [p.to_dict() for p in Post.query.all()]
        return make_response(posts, 200)
    def post(self):
        data = request.get_json()
        try:
            new_post = Post(**data)
        except:
            return make_response({"errors" : ["validations errors"]}, 400)
        db.session.add(new_post)
        db.session.commit()
        return make_response(new_post.to_dict(rules=("-post_comments.post.post_comments",)), 200)
         
class PostResourceById(Resource):
     def patch(self, id):
        data = request.get_json()
        post = Post.query.get(id)
        if not post:
            return make_response({"error": "Post not found"}, 404)

        try:
            for attr, value in data.items():
                setattr(post, attr, value)
        except:
            return make_response({"error": ["validation error"]}, 400)

        db.session.add(post)
        db.session.commit()
        return make_response(post.to_dict(), 202)
    
     def delete(self, id):
        post = Post.query.filter_by(id=id).first()
        if not post:
            return make_response({"error": "Post not found"}, 404)
        db.session.delete(post)
        db.session.commit()
        return make_response("", 204)
#Comments#####################################    
class CommentResource(Resource):
    def post(self):
        data = request.get_json()
        try:
            new_comment = Comment(**data)
        except:
            return make_response({"errors" : ["validations errors"]}, 400)
        db.session.add(new_comment)
        db.session.commit()
        return make_response(new_comment.to_dict(rules=("-post.post_comments.post",)), 200)
            
class CommentByIDResource(Resource):
    def get(self, id):
        comment = Comment.query.get(id)
        if not comment:
            return make_response({"error": "Comment not found"}, 404)
        return make_response(comment.to_dict(), 200)
    
    def patch(self, id):
        data = request.get_json()
        comment = Comment.query.get(id)
        if not comment:
            return make_response({"error": "Comment not found"}, 404)

        try:
            for attr, value in data.items():
                setattr(comment, attr, value)
        except:
            return make_response({"error": ["validation error"]}, 400)

        db.session.add(comment)
        db.session.commit()
        return make_response(comment.to_dict(), 202)
    
    def delete(self, id):
        comment = Comment.query.filter_by(id=id).first()
        if not comment:
            return make_response({"error": "Comment not found"}, 404)
        db.session.delete(comment)
        db.session.commit()
        return make_response("", 204)        
                 
class CommentsByPostIdResource(Resource):
    def get(self, post_id):
        comments = Comment.query.filter_by(post_id=post_id).all()
        if not comments:
            return make_response({"error": "Comments not found for this post"}, 404)
        return make_response([comment.to_dict() for comment in comments], 200)
       
class CommentByIDResource(Resource):
    def get(self, id):
        comment = Comment.query.get(id)
        if not comment:
            return make_response({"error": "Comment not found"}, 404)
        return make_response(comment.to_dict(), 200)
    
    def patch(self, id):
        data = request.get_json()
        comment = Comment.query.get(id)
        if not comment:
            return make_response({"error": "Comment not found"}, 404)

        try:
            for attr, value in data.items():
                setattr(comment, attr, value)
        except:
            return make_response({"error": ["validation error"]}, 400)

        db.session.add(comment)
        db.session.commit()
        return make_response(comment.to_dict(), 202)
    
    def delete(self, id):
        comment = Comment.query.filter_by(id=id).first()
        if not comment:
            return make_response({"error": "Comment not found"}, 404)
        db.session.delete(comment)
        db.session.commit()
        return make_response("", 204)        
                 
class CommentsByPostIdResource(Resource):
    def get(self, post_id):
        comments = Comment.query.filter_by(post_id=post_id).all()
        if not comments:
            return make_response({"error": "Comments not found for this post"}, 404)
        return make_response([comment.to_dict() for comment in comments], 200)
api.add_resource(PostResource, '/api/posts')
api.add_resource(PostResourceById, '/api/post/<int:id>')
api.add_resource(CommentResource, '/api/comments')
api.add_resource(CommentByIDResource, '/api/comments/<int:id>')
api.add_resource(CommentsByPostIdResource, '/api/post-comment/<int:post_id>')
#All NFL Players##################################### 
class NFLPlayersResource(Resource):
    def get(self):
        page = request.args.get('page', default=1, type=int)
        page_size = request.args.get('pageSize', default=10, type=int)
        
        # Calculate offset and limit based on pagination parameters
        offset = (page - 1) * page_size
        limit = page_size
        
        # Query all players from the database
        all_players = NFLPlayer.query.all()
        
        # Randomly shuffle the players
        random.shuffle(all_players)
        
        # Get the subset of players based on pagination
        players_subset = all_players[offset:offset + limit]
        
        # Return paginated player data as a JSON response
        return make_response([player.to_dict(rules=("-fantasy_positions",)) for player in players_subset], 200)
     
#All Players without Pagination adn Search Bar
class NFLPlayersSearchResource(Resource):
    def get(self):
        search_query = request.args.get('query', type=str)

        # Query the database to search for players based on the search query
        players = NFLPlayer.query.filter(
            or_(
                NFLPlayer.first_name.ilike(f"%{search_query}%"),
                NFLPlayer.last_name.ilike(f"%{search_query}%")
            )
        ).all()

        # Return the search results as a JSON response
        return make_response([player.to_dict(rules=("-fantasy_positions",)) for player in players], 200)

api.add_resource(NFLPlayersSearchResource, '/api/players/search')

class PlayersById(Resource):
    def get(self, id):
        player = NFLPlayer.query.filter_by(id=id).first()
        if not player:
            raise ValueError("Could not find pet")
        return make_response(player.to_dict(), 200)    
api.add_resource(PlayersById, '/api/players/<int:id>', endpoint='api/players/<int:id>')

#Create myu Fantasy Players and Fantasy Team
class FantasyPlayersResource(Resource):
    def get(self):
        players = [p.to_dict() for p in FantasyPlayer.query.all()]
        return make_response(players, 200)

    def post(self):
        data = request.get_json()
        try:
            new_player = FantasyPlayer(**data)
            db.session.add(new_player)
            db.session.commit()
            return make_response(new_player.to_dict(rules=("-performances",)), 200)
        except Exception as e:
            logging.error(f"Error in post method: {str(e)}")
            return make_response({"errors": [str(e)]}, 400)
        
api.add_resource(FantasyPlayersResource, '/api/fantasy_players')        
class FantasyPlayerByID(Resource):
    def get(self, id):
        player = FantasyPlayer.query.filter_by(id=id).first()
        if not player:
            raise ValueError("Could not find pet")
        return make_response(player.to_dict(), 200)
    def delete(self, id):
        player = FantasyPlayer.query.filter_by(id=id).first()
        if not player:
            return make_response({"error": "Comment not found"}, 404)
        db.session.delete(player)
        db.session.commit()
        return make_response("", 204)    
api.add_resource(FantasyPlayerByID, '/api/fantasy_players/<int:id>')

class PlayerPerformanceByNflId(Resource):
    def get(self, nfl_player_id):
        # Query the database to get the FantasyPlayer by nfl_player_id
        player = FantasyPlayer.query.filter_by(nfl_player_id=nfl_player_id).first()

        if not player:
            return make_response({"error": "Player not found"}, 404)

        # Query the database to get the performances of the player
        performances = PlayerPerformance.query.filter_by(fantasy_player_id=player.id).all()

        return make_response({
            "player": player.to_dict(),
            "performances": [performance.to_dict() for performance in performances]
        }, 200)     
api.add_resource(PlayerPerformanceByNflId, '/api/player_by_nfl_id/<string:nfl_player_id>')  
     
class FantasyTeamResource(Resource):
    def get(self):
        teams = [t.to_dict() for t in FantasyTeam.query.all()]
        return make_response(teams, 200)
    def post(self):
        data = request.get_json()
        try:
            new_team = FantasyTeam(**data)
        except:
            return make_response({"errors" : ["validations errors"]}, 400)
        db.session.add(new_team)
        db.session.commit()
        return make_response(new_team.to_dict(rules=("-team_players",)), 200)
api.add_resource(FantasyTeamResource, '/api/fantasy_teams')       

api.add_resource(NFLPlayersResource, '/api/players')       

class FantasyTeamById(Resource):
    def delete(self, id):
        team = FantasyTeam.query.filter_by(id=id).first()
        if not team:
            return make_response({"error": "Comment not found"}, 404)
        db.session.delete(team)
        db.session.commit()
        return make_response("", 204) 
api.add_resource(FantasyTeamById, '/api/fantasy_teams/<int:id>')
   
class FantasyPlayersByUserIDResource(Resource):
    
    def get(self, user_id):
        team = FantasyTeam.query.filter_by(user_id=user_id).first()
    
        if not team:
                return make_response({"error": "Fantasy team not found for this user"}, 404)

        # Get the team name
        team_name = team.name

        players = FantasyPlayer.query\
            .join(FantasyTeam)\
            .filter(FantasyTeam.user_id == user_id)\
            .all()
        
        if not players:
            return make_response({"error": "Fantasy players not found for this user"}, 404)

        # Create a list to store player details
        player_details = []

        for player in players:
            nfl_player = player.nfl_player

            player_detail = {
                'fantasy_player_id': player.id,
                'nfl_player_id': nfl_player.id,
                'first_name': nfl_player.first_name,
                'last_name': nfl_player.last_name,
                'team': nfl_player.team,
                'position': nfl_player.position,                
            }
            
            player_details.append(player_detail)

        # Include the team name in the response
        response_data = {
            'team_name': team_name,
            'players': player_details,
        }

        return make_response(response_data, 200)
api.add_resource(FantasyPlayersByUserIDResource, "/api/player_by_userid/<int:user_id>")

##Player Scores
class PlayerPerformances(Resource):
    def all_scores():
    # Fetch all player performances from the database
        performances = PlayerPerformance.query.all()

    # Define the headers for the table
        headers = ['First Name', 'Last Name', 'Position', 'Team', 'Standard Points', 'PPR Points']

    # Create a list of dictionaries with player information
        player_data = [
            {
            'First Name': performance.fantasy_player.nfl_player.first_name,
            'Last Name': performance.fantasy_player.nfl_player.last_name,
            'Position': performance.fantasy_player.nfl_player.position,
            'Team': performance.fantasy_player.nfl_player.team,
            'Standard Points': performance.standard_points,
            'PPR Points': performance.ppr_points
            }
            for performance in performances
        ]
   
    def post(self):
        data = request.get_json()
        try:
            new_team = PlayerPerformance(**data)
        except:
            return make_response({"errors" : ["validations errors"]}, 400)
        db.session.add(new_team)
        db.session.commit()
        return make_response(new_team.to_dict(rules=("-team_players",)), 200)
api.add_resource(PlayerPerformances, "/api/player_performances")
class PlayerPerformancesByPlayerId(Resource):
    def get(self, player_id):
        scores = PlayerPerformance.query.filter_by(fantasy_player_id=player_id).all()
        if not scores:
            return make_response({"error": "Scores not found for this player"}, 404)
        return make_response([scores.to_dict() for scores in scores], 200)
api.add_resource(PlayerPerformancesByPlayerId, "/api/player_performances/<int:player_id>")

if __name__ == '__main__':
    app.run(port=5555, debug=True)
