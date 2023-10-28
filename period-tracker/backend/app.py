from flask_cors import CORS
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask import jsonify

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///c:\\Users\\leela\\aprendizaje\\GitHub\\period-tracker\\period-tracker\\backend\\mydb.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.DateTime)


@app.route('/update_date', methods=['POST'])
def update_date():
    start_date_str = request.get_json().get('start_date')
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')

    user = User.query.get(1)  # Assuming there's only one user
    if user is None:
        user = User(start_date=start_date)
        db.session.add(user)
    else:
        user.start_date = start_date

    db.session.commit()
    return 'Date updated successfully'

@app.route('/get_date', methods=['GET'])
def get_date():
    user = User.query.get(1)  # Assuming there's only one user
    if user is not None:
        dates = [user.start_date.strftime('%Y-%m-%d')]
        return jsonify({'dates': dates})
    else:
        return jsonify({'dates': []})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
