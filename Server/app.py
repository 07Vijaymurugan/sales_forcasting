from flask import Flask, make_response
import psycopg2
from flask import jsonify, request
from flask_cors import CORS
from forecast import forecast
import pandas as pd
from io import StringIO
import json

app = Flask(__name__)
CORS(app)
# connect to the PostgreSQL database
conn = psycopg2.connect(
    host="localhost",
    database="sales",
    user="postgres",
    password="2002"
)

# create a cursor object
cur = conn.cursor()

# define the table name
table_name = "users"

@app.route('/login', methods=['POST'])
def login():
    # get the request data
    data = request.get_json()
    username = data['username']
    password = data['password']

    # search for the user in the database
    cur.execute(f"SELECT * FROM {table_name} WHERE id = %s AND password = %s", (username, password))
    user = cur.fetchone()

    if user:
        return jsonify({'success': True, 'message': username})
    else:
        return jsonify({'success': False, 'message': 'User not found!!'})
    

@app.route("/register", methods=["POST"])
def register():
    # get the request data
    data = request.get_json()

    # extract the user data
    id = data['id']
    name = data['name']
    password = data['password']
    email = data['email']
    gender = data['gender'] 
    
    # check if the user already exists
    cur.execute(f"SELECT * FROM {table_name} WHERE id = %s", (id,))
    existing_user = cur.fetchone()

    if existing_user:
        return jsonify({'success': False, 'message': 'User already exists'})

    # insert the user data into the database
    cur.execute(
        f"INSERT INTO {table_name} (id, name, password, email, gender) VALUES (%s, %s, %s, %s, %s)",
        (id, name, password, email, gender)
    )
    
    conn.commit()

    return jsonify({'success': True, 'message': 'Successfully Registered!!'})

@app.route('/upload', methods=['POST'])
def upload_file():
    uploaded_file = request.files['file']
    selectedProduct = request.form['product']
    selectedInterval = request.form['interval']
    enteredPeriod = request.form['period']
    username=request.form['user_id']
    csv_data = uploaded_file.read()
    csv_bytes = bytes(csv_data)
    data = csv_data.decode('utf-8')
    file = StringIO(data)
    df=pd.read_csv(file)
    period = int(enteredPeriod)
    if selectedInterval == 'daily':
        period=int(enteredPeriod)
    elif selectedInterval == 'weekly':
        period=int(enteredPeriod)*7
    elif selectedInterval == 'monthly':
        period=int(enteredPeriod)*30
    elif selectedInterval == 'yearly':
        period=int(enteredPeriod)*365
    result_df = forecast(df,period,selectedProduct)
    result_csv = result_df.to_csv(index=False)
    # print(result_csv)
    cur.execute(f"INSERT INTO csvfile (user_id, csv_file) VALUES (%s, %s)", (username,csv_bytes))
    conn.commit()
    return jsonify({'success': True, 'message': 'File uploaded successfully!', 'csv': result_csv})