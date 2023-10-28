import os
from sqlalchemy import create_engine
from app import User


# Use an absolute path to the database file
db_path = os.path.join(os.path.dirname(__file__), 'mydb.db')
db_uri = 'sqlite:///{}'.format(db_path)

engine = create_engine(db_uri)
User.metadata.create_all(engine)

print(db_uri)
