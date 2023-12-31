"""added cascade delete to all tables

Revision ID: 6e45207f270e
Revises: d2d5ecdcaf54
Create Date: 2023-09-18 09:41:13.595092

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6e45207f270e'
down_revision = 'd2d5ecdcaf54'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('nfl_players', schema=None) as batch_op:
        batch_op.drop_index('ix_nfl_players_last_name')
        batch_op.create_index(batch_op.f('ix_nfl_players_first_name'), ['first_name'], unique=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('nfl_players', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_nfl_players_first_name'))
        batch_op.create_index('ix_nfl_players_last_name', ['last_name'], unique=False)

    # ### end Alembic commands ###
