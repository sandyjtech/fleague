"""updated table nfl_player

Revision ID: be0a0b040313
Revises: 1b4ae395bab5
Create Date: 2023-09-07 16:30:29.386406

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'be0a0b040313'
down_revision = '1b4ae395bab5'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('nfl_players', schema=None) as batch_op:
        batch_op.drop_column('player_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('nfl_players', schema=None) as batch_op:
        batch_op.add_column(sa.Column('player_id', sa.VARCHAR(), nullable=True))

    # ### end Alembic commands ###
