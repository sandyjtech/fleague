"""added rules

Revision ID: ebe9fe35024d
Revises: a164c696dc56
Create Date: 2023-09-19 17:18:45.165587

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ebe9fe35024d'
down_revision = 'a164c696dc56'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('nfl_players', schema=None) as batch_op:
        batch_op.drop_index('ix_nfl_players_first_name')
        batch_op.create_index(batch_op.f('ix_nfl_players_first_name'), ['first_name'], unique=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('nfl_players', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_nfl_players_first_name'))
        batch_op.create_index('ix_nfl_players_first_name', ['first_name'], unique=False)

    # ### end Alembic commands ###
