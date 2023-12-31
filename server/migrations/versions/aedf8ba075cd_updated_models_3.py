"""updated models 3

Revision ID: aedf8ba075cd
Revises: f074354ee45d
Create Date: 2023-09-14 14:25:14.929488

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'aedf8ba075cd'
down_revision = 'f074354ee45d'
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
