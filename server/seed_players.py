import json
from config import app, db
from models import NFLPlayer, NFLPlayerFantasyPosition
import requests

def fetch_player_data():
    url = 'https://api.sleeper.app/v1/players/nfl'
    response = requests.get(url)

    if response.status_code == 200:
        player_data = response.json()
        return player_data
    else:
        print('Failed to fetch player data')
        return None

def seed_nfl_player_data(player_data):
    with app.app_context():
        # Delete all existing records from NFLPlayer and NFLPlayerFantasyPosition tables
        NFLPlayer.query.delete()
        NFLPlayerFantasyPosition.query.delete()

        for player_id, player_info in player_data.items():
            # Extract relevant data from the API response
            fantasy_data_id = player_info.get('fantasy_data_id')
            espn_id = player_info.get('espn_id')
            stats_id = player_info.get('stats_id')
            status = player_info.get('status')
            first_name = player_info.get('first_name')
            last_name = player_info.get('last_name')
            age = player_info.get('age')
            height = player_info.get('height')
            weight = player_info.get('weight')
            position = player_info.get('position')
            college = player_info.get('college')
            number = player_info.get('number')
            team = player_info.get('team')
            years_exp = player_info.get('years_exp')
            injury_status = player_info.get('injury_status')
            hashtag = player_info.get('hashtag')  # Added hashtag field

            # Create a new NFLPlayer record
            player = NFLPlayer(
                id=player_id,
                fantasy_data_id=fantasy_data_id,
                espn_id=espn_id,
                stats_id=stats_id,
                status=status,
                first_name=first_name,
                last_name=last_name,
                age=age,
                height=height,
                weight=weight,
                position=position,
                college=college,
                number=number,
                team=team,
                years_exp=years_exp,
                injury_status=injury_status,
                hashtag=hashtag  # Added hashtag field
            )
            db.session.add(player)

            # Now, let's handle the fantasy positions associated with the NFL player
            fantasy_positions = player_info.get('fantasy_positions')
            if fantasy_positions is not None:  # Check if fantasy_positions is not None
                for position in fantasy_positions:
                    # Create a new NFLPlayerFantasyPosition record for each position
                    new_position = NFLPlayerFantasyPosition(
                        nfl_player_id=player_id,
                        fantasy_position=position
                    )
                    db.session.add(new_position)

        db.session.commit()

if __name__ == '__main__':
    player_data = fetch_player_data()
    if player_data:
        print(f"Fetched player data for {len(player_data)} players.")
        seed_nfl_player_data(player_data)
        print("Data seeding complete.")



    
# 0 0 * * * /usr/bin/python3 /path/to/your/script.py
# This will execute your script daily at 12:00 AM.

# Logging and Error Handling:
# Ensure that your script logs any errors or issues that might occur during the data fetching and seeding process. This will help you troubleshoot any problems that may arise.

# Run the Script Manually First:
# Before scheduling the script, run it manually to ensure that it fetches data correctly and seeds it into the database without any issues.

# Environment Configuration:
# Make sure your script has the necessary environment configuration, such as database connection settings, API endpoints, and any required API keys or tokens.

# Security:
# If the API requires authentication, ensure that you securely store any sensitive credentials or tokens and do not expose them in your code.

# Testing:
# Thoroughly test your script to handle various scenarios, such as API errors, database connection issues, and data integrity.

# By following these steps, you can create a script that fetches data from an API and seeds it into your database once a day, keeping your player data up-to-date.
    

