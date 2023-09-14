"""added relationship in users table

Revision ID: 57daa3993187
Revises: a0b49d1f62e9
Create Date: 2023-09-14 09:05:07.003466

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '57daa3993187'
down_revision = 'a0b49d1f62e9'
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