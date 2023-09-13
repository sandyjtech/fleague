"""added relationship changes

Revision ID: e893b43bf271
Revises: fb5a950846de
Create Date: 2023-09-13 08:54:43.712815

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e893b43bf271'
down_revision = 'fb5a950846de'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('fantasy_players', schema=None) as batch_op:
        batch_op.add_column(sa.Column('nfl_player_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('is_benched', sa.Boolean(), nullable=True))
        batch_op.create_foreign_key(batch_op.f('fk_fantasy_players_nfl_player_id_nfl_players'), 'nfl_players', ['nfl_player_id'], ['id'])
        batch_op.drop_column('team')
        batch_op.drop_column('name')
        batch_op.drop_column('position')

    with op.batch_alter_table('nfl_players', schema=None) as batch_op:
        batch_op.drop_index('ix_nfl_players_first_name')
        batch_op.create_index(batch_op.f('ix_nfl_players_first_name'), ['first_name'], unique=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('nfl_players', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_nfl_players_first_name'))
        batch_op.create_index('ix_nfl_players_first_name', ['first_name'], unique=False)

    with op.batch_alter_table('fantasy_players', schema=None) as batch_op:
        batch_op.add_column(sa.Column('position', sa.VARCHAR(), nullable=True))
        batch_op.add_column(sa.Column('name', sa.VARCHAR(), nullable=True))
        batch_op.add_column(sa.Column('team', sa.VARCHAR(), nullable=True))
        batch_op.drop_constraint(batch_op.f('fk_fantasy_players_nfl_player_id_nfl_players'), type_='foreignkey')
        batch_op.drop_column('is_benched')
        batch_op.drop_column('nfl_player_id')

    # ### end Alembic commands ###
