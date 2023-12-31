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
from config import app,api, Resource, db, socketio
from models import User, LeagueMember,League, Post, Comment, FantasyTeam, FantasyPlayer, PlayerPerformance, NFLPlayer, NFLPlayerFantasyPosition

####### Authorization #####
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
        user = FantasyPlayer.query.filter_by(id=id).first()
        if not user:
            return make_response({"error": "User not found"}, 404)
        db.session.delete(user)
        db.session.commit()
        return make_response("", 204)
    
    def patch(self, id):
        data = request.get_json()
        user = User.query.get(id)
        if not user:
            return make_response({"error": "user not found"}, 404)
        try:
            for attr, value in data.items():
                setattr(user, attr, value)
        except:
            return make_response({"errors": ["validation errors"]}, 400)
        db.session.add(user)
        db.session.commit()
        return make_response(user.to_dict(), 202)
api.add_resource(UserDetailsById, '/users/<int:id>')
class VerifyPassword(Resource):
    def post(self, user_id):
        req_json = request.get_json()
        current_password = req_json.get("current_password")
        user = User.query.get(user_id)

        if not user:
            abort(404, "User not found")

        if user.check_password(current_password):
            return {"message": "Password verification successful"}, 200

        return {"error": "Incorrect password"}, 401
api.add_resource(VerifyPassword, '/users/<int:user_id>/verify-password')

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

class FantasyPlayersByUserIDResource(Resource):
    def get(self, user_id):
        try:
            # Find the FantasyTeam associated with the user_id
            fantasy_team = FantasyTeam.query.filter_by(user_id=user_id).first()

            if not fantasy_team:
                return {"message": "Fantasy team not found for this user."}, 404

            # Get the FantasyPlayers associated with the FantasyTeam
            players = fantasy_team.team_players

            # Serialize the players into a list of dictionaries
            serialized_players = [player.to_dict(rules=("-user",)) for player in players]

            return {"players": serialized_players}, 200
        except Exception as e:
            return {"error": str(e)}, 500
api.add_resource(FantasyPlayersByUserIDResource, "/api/fantasy_players_by_user_id/<int:user_id>")

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


class PlayersPerformanceByUserIDResource(Resource):
    def get(self, user_id):
        # Fetch the fantasy team for the given user_id
        team = FantasyTeam.query.filter_by(user_id=user_id).first()

        if not team:
            # Handle the case where the user does not have a fantasy team
            return make_response(jsonify({"message": "Fantasy team not found for this user."}), 404)

        # Get the player IDs in the team
        player_ids_in_team = [fantasy_player.nfl_player_id for fantasy_player in team.team_players]

        # Fetch all player performances from the database for players in the team
        performances = PlayerPerformance.query.filter(PlayerPerformance.fantasy_player_id.in_(player_ids_in_team)).all()

        # Create a list of dictionaries containing performance and player information
        performance_data = []
        for performance in performances:
            player = NFLPlayer.query.get(performance.fantasy_player_id)
            fantasy_player = FantasyPlayer.query.filter_by(nfl_player_id=performance.fantasy_player_id).first()
            if player:
                performance_data.append({
                    "team_name": team.name,
                    "first_name": player.first_name,
                    "last_name": player.last_name,
                    "team": player.team,
                    "position": player.position,
                    "standard_points": performance.standard_points,
                    "ppr_points": performance.ppr_points,
                    "match_id": performance.match_id,
                    "week_num": performance.week_num,
                    "is_benched": fantasy_player.is_benched  # Include is_benched attribute
                })

        return make_response(jsonify(performance_data), 200)
api.add_resource(PlayersPerformanceByUserIDResource, "/api/performance_by_user/<int:user_id>")

class PlayerPerformances(Resource):
   def get(self):
        # Fetch all player performances from the database
        performances = PlayerPerformance.query.all()

        # Create a list of dictionaries containing performance and player information
        performance_data = []
        for performance in performances:
            player = NFLPlayer.query.get(performance.fantasy_player_id)
            if player:
                performance_data.append({
                    "first_name": player.first_name,
                    "last_name": player.last_name,
                    "team": player.team,
                    "position": player.position,
                    "standard_points": performance.standard_points,
                    "ppr_points": performance.ppr_points,
                    "match_id": performance.match_id,
                    "week_num": performance.week_num,
                })

        response = make_response(jsonify(performance_data), 200)
        return response
api.add_resource(PlayerPerformances, "/api/player_performances")
#leaderboard
class Leaderboard(Resource):
    def get(self):
        # Fetch all users
        users = User.query.all()

        # Create a dictionary to store the performance data for all users
        performance_data = {}

        for user in users:
            # Fetch the fantasy team for the current user
            team = FantasyTeam.query.filter_by(user_id=user.id).first()

            if not team:
                # Handle the case where the user does not have a fantasy team
                continue  # Skip this user and move to the next one if not available

            # Get the player IDs in the team
            player_ids_in_team = [fantasy_player.nfl_player_id for fantasy_player in team.team_players]

            # Fetch all player performances from the database for players in the team
            performances = PlayerPerformance.query.filter(PlayerPerformance.fantasy_player_id.in_(player_ids_in_team)).all()

            # Create a list of dictionaries containing performance information for this user
            user_performance_data = []
            for performance in performances:
                player = NFLPlayer.query.get(performance.fantasy_player_id)
                fantasy_player = FantasyPlayer.query.filter_by(nfl_player_id=performance.fantasy_player_id).first()
                if player:
                    user_performance_data.append({
                        "first_name": player.first_name,
                        "last_name": player.last_name,
                        "team": player.team,
                        "position": player.position,
                        "standard_points": performance.standard_points,
                        "ppr_points": performance.ppr_points,
                        "match_id": performance.match_id,
                        "week_num": performance.week_num,
                        "is_benched": fantasy_player.is_benched
                    })

            # Add the user's performance data to the dictionary with their username as the key
            performance_data[user.username] = user_performance_data

        return make_response(jsonify(performance_data), 200)
api.add_resource(Leaderboard, "/api/leaderboard")

@socketio.on('message')
def handle_message(message):
    print('Received message:', message)
    socketio.emit('message', message)

@socketio.on('send_message')
def handle_message(data):
    message = data['message']
    username = data['username']
    print(f'Received message from {username}: {message}')
    socketio.emit('receive_message', {'message': message, 'username': username})

    
@socketio.on('message')
def handle_message(message):
    socketio.send(message)
    
if __name__ == '__main__':
    socketio.run(app, debug=True, port=5555)
    
