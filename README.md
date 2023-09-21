# NFLeague App

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Usage](#usage)
   - [Running the App](#running-the-app)
   - [Accessing the Home Page](#accessing-the-home-page)
   - [Live Chat](#live-chat)
   - [Fantasy Team Creation](#fantasy-team-creation)
   - [Viewing Fantasy Teams](#viewing-fantasy-teams)
   - [Player and Team Stats](#player-and-team-stats)
   - [Posting and Commenting](#posting-and-commenting)
7. [Database Schema](#database-schema)
8. [Contributing](#contributing)
9. [License](#license)

## Introduction
The NFLeague app is a web-based platform that provides users with features such as live chat, fantasy team creation, player/team stats, posting/commenting, and more. This README serves as a guide to set up, configure, and use the app effectively.
![alt text](https://drive.google.com/file/d/1gMEKn4_LreNQUOpZ5E4LNUrJ4G-qzK1S/view?usp=sharing)



## Features
### Key Features:
- **Live Chat:** Engage in real-time conversations with other users.
- **Fantasy Team Creation:** Assemble your own fantasy team with drag-and-drop functionality.
- **Viewing Fantasy Teams:** Check your fantasy teams and player stats.
- **Player and Team Stats:** Access statistics from the previous year and upcoming schedule changes.
- **Posting and Commenting:** Share posts and comment on others' posts.
- **News Updates:** Stay informed with relevant news about your players and teams.

## Prerequisites
Before getting started, ensure you have the following prerequisites installed and configured:
- Python 
- Flask 
- MySQL or another relational database
- SQLAlchemy 
- Node.js (for frontend)
- Socket.io (for real-time features)
- Beautiful DND

## Installation
1. Clone this repository to your local machine:


git clone https://github.com/sandyjtech/fleague
cd fleague


The app will be accessible at http://localhost:3000.

- Accessing the Home Page
Visit the app's home page to see last year's stats and upcoming schedule changes.
- Live Chat
Use the live chat feature to engage in real-time conversations with other users.
- Fantasy Team Creation
Create your fantasy team by navigating to the fantasy team creation section.
Use drag-and-drop functionality to add players to your team.
- Viewing Fantasy Teams
Access your fantasy teams and view player stats from the frontend.
- Player and Team Stats
Retrieve player and team statistics, including those from the previous year and upcoming schedule changes.
- Posting and Commenting
Share posts and comment on posts made by other users.


## Database Schema

The NFLeague app utilizes SQLAlchemy to manage the database. Below is an overview of the database tables and their relationships:

1. **User**
   - Represents user data.
   - Columns:
     - `id`: Unique identifier for users.
     - `username`: User's username.
     - `email`: User's email address.
     - `_password`: Hashed password.
   - Relationships:
     - `user_posts`: Posts created by the user.
     - `post_comments`: Comments made by the user.
     - `my_team`: User's fantasy team.
     - `my_players`: User's fantasy team players.
     - `leagues`: Leagues the user is a member of.
     - `user_post_comments`: Comments on the user's posts.

2. **LeagueMember**
   - Represents membership details of users in leagues.
   - Columns:
     - `id`: Unique identifier for league members.
     - `user_id`: User associated with the membership.
     - `league_id`: League to which the user belongs.
     - `role`: Role or membership status in the league.

3. **League**
   - Represents leagues.
   - Columns:
     - `id`: Unique identifier for leagues.
     - `name`: Name of the league.
   - Relationships:
     - `members`: Members (users) of the league.

4. **Post**
   - Represents posts made by users.
   - Columns:
     - `id`: Unique identifier for posts.
     - `title`: Title of the post.
     - `content`: Content of the post.
     - `user_id`: User who created the post.
   - Relationships:
     - `post_comments`: Comments on the post.

5. **Comment**
   - Represents comments made by users on posts.
   - Columns:
     - `id`: Unique identifier for comments.
     - `content`: Content of the comment.
     - `post_id`: Post to which the comment belongs.
     - `user_id`: User who made the comment.

6. **FantasyTeam**
   - Represents fantasy teams created by users.
   - Columns:
     - `id`: Unique identifier for fantasy teams.
     - `user_id`: User who owns the fantasy team.
     - `name`: Name of the fantasy team.
   - Relationships:
     - `team_players`: Players on the fantasy team.

7. **FantasyPlayer**
   - Represents players selected for a fantasy team.
   - Columns:
     - `id`: Unique identifier for fantasy players.
     - `nfl_player_id`: Associated NFL player.
     - `fantasy_team_id`: Fantasy team to which the player belongs.
     - `is_benched`: Indicates if the player is benched.
   - Relationships:
     - `performances`: Performances of the player in fantasy leagues.

8. **PlayerPerformance**
   - Represents player performances in fantasy leagues.
   - Columns:
     - `id`: Unique identifier for player performances.
     - `fantasy_player_id`: Fantasy player associated with the performance.
     - `week_num`: Week number of the performance.
     - `match_id`: Match identifier.
     - `ppr_points`: Points scored in PPR format.
     - `standard_points`: Points scored in standard format.

9. **NFLPlayer**
   - Represents NFL players.
   - Columns:
     - `id`: Unique identifier for NFL players.
     - Various player attributes (e.g., name, age, team).
   - Relationships:
     - `f_players`: Fantasy players associated with the NFL player.
     - `fantasy_positions`: Positions of the NFL player in fantasy leagues.

10. **NFLPlayerFantasyPosition**
    - Represents the positions of NFL players in fantasy leagues.
    - Columns:
      - `id`: Unique identifier for NFL player positions.
      - `nfl_player_id`: Associated NFL player.
      - `fantasy_position`: Fantasy position of the NFL player.

These tables define the structure of the NFLeague database, allowing for the storage and management of user data, posts, comments, fantasy teams, player performances, and NFL player information.

## Contact Information
-LinkedIn: https://www.linkedin.com/in/sandra--gonzalez/
