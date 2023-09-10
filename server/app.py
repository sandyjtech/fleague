#!/usr/bin/env python3
# app.py
# Remote library imports
from flask import abort, request, session
from sqlite3 import IntegrityError
from flask import Flask, make_response, jsonify, request, session
from sqlalchemy.exc import IntegrityError

# Local imports
from config import app,api, Resource, db
from models import User, LeagueMember,League, Post, Comment, FantasyTeam, FantasyPlayer, PlayerPerformance, NFLPlayer, NFLPlayerFantasyPosition 

# Define API resources
class PostResource(Resource):
    def get(self):
        posts = [p.to_dict() for p in Post.query.all()]
        return make_response(posts, 200)
    
class CommentResource(Resource):
    def post(self):
        data = request.get_json()
        try:
            new_comment = Comment(**data)
        except:
            return make_response({"errors" : ["validations errors"]}, 400)
        db.session.add(new_comment)
        db.session.commit()
        return make_response(new_comment.to_dict(rules=("-post_comments.post",)), 200)
            
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
            return make_response({"error": "Comments not found for this blog"}, 404)
        return make_response([comment.to_dict() for comment in comments], 200)
 
class NFLPlayersResource(Resource):
    def get(self):
        players = [player.to_dict() for player in NFLPlayer.query.all()]
        return make_response(players, 200)   
    
# Add API resources to the API
api.add_resource(PostResource, '/api/posts')
api.add_resource(CommentResource, '/api/comments')
api.add_resource(CommentByIDResource, '/api/comments/<int:id>')
api.add_resource(CommentsByPostIdResource, '/api/post-comment/<int:post_id>')
api.add_resource(NFLPlayersResource, '/api/players')-
if __name__ == '__main__':
    app.run(port=5555, debug=True)
