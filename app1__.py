from flask import Flask, render_template, request, url_for, redirect, session,jsonify
from pymongo import MongoClient
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, create_refresh_token,  get_jwt
import bcrypt
# from waitress import serve
from flask_cors import CORS
from bson import ObjectId


app = Flask(__name__)
cors = CORS(app, origins='*', supports_credentials=True, expose_headers=['Content-Type'])
app.secret_key = "testing"

# Connect to your MongoDB database
def MongoDB():
    client = MongoClient("mongodb+srv://admin:1234@cluster0.o0dcqvb.mongodb.net/?retryWrites=true&w=majority")
    db_records = client.get_database('records')
    employer_records = db_records.employer
    applicant_records = db_records.applicant
    jd_records = db_records.jd
    result_records = db_records.result
    return employer_records, applicant_records, jd_records, result_records

employer_records, applicant_records, jd_records, result_records = MongoDB()

# Configure Flask JWT Extended
app.config["JWT_SECRET_KEY"] = "secret_key"
jwt = JWTManager(app)

# Routes

@app.route("/signup", methods=['POST', 'GET'])
def index():
    message = ''
    if request.method == "POST":
        data = request.get_json()
        user = data.get("fullname")
        email = data.get("email")
        employer = data.get("employer")
        password1 = data.get("password1")
        password2 = data.get("password2")

        if not user or not email or not employer or not password1 or not password2:
            message = 'Please fill in all the fields'
            return {'message': 'Please fill in all the fields'}

        if password1 != password2:
            message = 'Passwords do not match'
            return {'message': 'Passwords do not match'}

        email_found = employer_records.find_one({"email": email})

        if email_found:
            message = 'This email already exists in the database'
            return {'message': 'This email already exists in the database'}
        else:
            hashed = bcrypt.hashpw(password2.encode('utf-8'), bcrypt.gensalt())
            user_input = {'name': user, 'employer': employer, 'email': email, 'password': hashed}
            employer_records.insert_one(user_input)

            user_data = employer_records.find_one({"email": email})
            new_email = user_data['email']

            # Create access token and refresh token
            access_token = create_access_token(identity=email, fresh=True)
            refresh_token = create_refresh_token(identity=email)

            return jsonify(access_token)

@app.route("/login", methods=["POST", "GET"])
def login():
    message = 'Please login to your account'
    if request.method == "POST":
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        email_found = employer_records.find_one({"email": email})
        if email_found != None:
            email_val = email_found['email']
            passwordcheck = email_found['password']

            if bcrypt.checkpw(password.encode('utf-8'), passwordcheck):
                session["email"] = email_val
                access_token = create_access_token(identity=email)
                refresh_token = create_refresh_token(identity=email)
                return jsonify(access_token)
        else:
            message = 'Email not found'
            return  {'message': 'This email does not exists in the database'}, 401

@app.route('/dashboard/<r_id>', methods=["POST", "GET"])
def dashboard(r_id):
    if request.method == "POST":
        data = request.get_json()
        j_id = jd_records.insert_one(data).inserted_id
        return str(j_id)
    if request.method == 'GET':
        jds = []
        for x in jd_records.find({},{"_id":0, "jd":1, "weights":1, "r_id": r_id }):
            jds.append(x)
        return jsonify(jds)

@app.route('/job/<j_id>', methods=["POST", "GET"])
def job(j_id):
    if request.method == 'GET':
        job_details = jd_records.find_one({"_id":ObjectId(j_id)},{"jd":1, "weights":1})
        applicant_details = applicant_records.find_one({"j_id":str(j_id)}, {"name":1, "email":1, "phone":1, "candidate_score":1, "status":1})
        del job_details['_id']
        del applicant_details['_id']
        return jsonify(job_details | applicant_details)
    
if __name__ == "__main__":
    # serve(app, host='0.0.0.0', port=5000)
    app.run(port=5001)