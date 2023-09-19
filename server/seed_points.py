import datetime
import json
from config import app, db
from models import NFLPlayer, PlayerPerformance
import requests

# Fetch data and seed for one player at a time
def fetch_and_seed_player(player_id):
    current_date = datetime.date.today()
    url = f'https://api.sleeper.com/stats/nfl/player/{player_id}?season_type=regular&season={current_date.year}&grouping=week'
    response = requests.get(url)

    if response.status_code == 200:
        player_scores = response.json()
        seed_player_scores(player_id, player_scores)
        print(f'Successfully fetched and seeded data for player ID {player_id}')
    else:
        print(f'Failed to fetch player data for player ID {player_id}')

def seed_player_scores(player_id, player_scores):
    with app.app_context():
        # Delete existing records for the player from PlayerPerformance table
        PlayerPerformance.query.filter_by(fantasy_player_id=player_id).delete()

        for week, player_info in player_scores.items():
            if player_info is not None and any(player_info.values()):
                date = player_info.get('date')
                stats = player_info.get('stats', {})
                pts_ppr = stats.get('pts_ppr', 0)
                pts_std = stats.get('pts_std', 0)

                player = PlayerPerformance(
                    fantasy_player_id=player_id,
                    week_num=week,
                    match_id=date,
                    ppr_points=pts_ppr,
                    standard_points=pts_std,
                )
                db.session.add(player)

        db.session.commit()
        print(f'Successfully seeded data for player ID {player_id}')

if __name__ == '__main__':
    with app.app_context():
        # Get all player IDs from the database
        player_ids = [player.id for player in NFLPlayer.query.all()]

        for player_id in player_ids:
            fetch_and_seed_player(player_id)

        print("Data seeding complete.")
