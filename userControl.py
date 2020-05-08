# -*- coding: utf-8 -*-
"""
Created on Thu May  7 16:00:01 2020

@author: elifaskvav
"""

from flask import Flask, jsonify
from flask import make_response
from flask import request
import requests as rs
import urllib
from bs4 import BeautifulSoup
from urllib.request import urlopen
import json
import MySQLdb
import jwt
import datetime
from functools import wraps
import hashlib, binascii, os




def token_required(token):
    
    invalid_msg = {
        'message': 'Invalid token. Registeration and / or authentication required',
        'authenticated': False
    }
    expired_msg = {
        'message': 'Expired token. Reauthentication required.',
        'authenticated': False
       }

    try:
        
        data = decode_auth_token(token)
        if str(data)=="Signature expired. Please log in again.":
            return jsonify(expired_msg)
        elif str(data)=="Invalid token. Please log in again.":
            return jsonify(invalid_msg)
        else:    
            return True

    except:
        print('')
        return  jsonify('false')


def encode_auth_token(username):

    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=300),
            'iat': datetime.datetime.utcnow(),
            'sub': username
        }
        return jwt.encode(
            payload,
            app.config.get('SECRET_KEY'),
            algorithm='HS256'
        )
    except Exception as e:
        return e
  
    
def decode_auth_token(auth_token):

    try:
        payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'))
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return 'Signature expired. Please log in again.'
    except jwt.InvalidTokenError:
        return 'Invalid token. Please log in again.'
    
def hash_password(password):
    """Hash a password for storing."""
    salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
    pwdhash = hashlib.pbkdf2_hmac('sha512', password.encode('utf-8'), 
                                salt, 100000)
    pwdhash = binascii.hexlify(pwdhash)
    return (salt + pwdhash).decode('ascii')

def verify_password(stored_password, provided_password):
    """Verify a stored password against one provided by user"""
    salt = stored_password[:64]
    stored_password = stored_password[64:]
    pwdhash = hashlib.pbkdf2_hmac('sha512', 
                                  provided_password.encode('utf-8'), 
                                  salt.encode('ascii'), 
                                  100000)
    pwdhash = binascii.hexlify(pwdhash).decode('ascii')
    return pwdhash == stored_password


app = Flask(__name__)
app.config['SECRET_KEY'] = 'xxx'

@app.route("/userSave",methods=['POST'])
def setUsers():
    
    tx_data = request.json
    required_fields = ["name", "surname","phone", "tc","username", "passwd"]

            
    db = MySQLdb.connect(host="localhost",  # your host 
                         user="root",       # username
                         passwd="toor",     # password
                         db="blockchainUser")   # name of the database

    # Create a Cursor object to execute queries.
    cur = db.cursor()
    print(tx_data['name'])
    # Select data from table using SQL query.
    name=tx_data.get("name")
    surname=tx_data.get("surname")
    phone=tx_data.get("phone")
    tc=tx_data.get("tc")
    username=tx_data.get("username")
    passwd=tx_data.get("passwd")
    print(passwd)
    sql = "INSERT INTO blockchainUserTable (name, surname, phone, tc, username, passwd) VALUES(%s,%s,%s,%s,%s,%s)"
    #val=(name,surname,phone,tc,username,passwd,)
    #val=(format(str(name)),format(str(surname)),format(str(phone)),format(str(tc)),format(str(username)),format(str(passwd)),)
    val=(format(str(tx_data['name'])),format(str(tx_data['surname'])),format(str(tx_data['phone'])),format(str(tx_data['tc'])),format(str(tx_data['username'])),format(str(hash_password(tx_data['passwd']))) )
    #cur.execute("INSERT INTO blockchainUserTable (name, surname, phone, tc, username, passwd) VALUES(½s,½s,%s,%s,%s,%s)",(name,surname,phone,tc,username,passwd,))
    cur.execute(sql,val)
    db.commit()
    print(cur.rowcount, "record inserted.")

    return json.dumps("success")


x=""
@app.route("/login",methods=['POST'])
def login():
    
    tx_data = request.json
    username=tx_data['username']
    password=tx_data['passwd']
            
    db = MySQLdb.connect(host="localhost",  # your host 
                         user="root",       # username
                         passwd="toor",     # password
                         db="blockchainUser")   # name of the database

    # Create a Cursor object to execute queries.
    cur = db.cursor()
    query_string="SELECT passwd FROM blockchainUserTable WHERE username= %s"
    cur.execute(query_string, (username,))
    rows = cur.fetchall()
    for row in rows:
        print(row[0])
        global x
        x=row[0]
    deger=verify_password(x, tx_data['passwd'])
    if deger==True:
        """
        token = jwt.encode({
            'user': username,
            'password': password,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
        }, app.config['SECRET_KEY'])
        """
        token=encode_auth_token(username)
    else:
        token = 'Invalid username or password'

    #return jsonify({'token': token})
    return jsonify({'token': token.decode('UTF-8')})



@app.route("/test",methods=['POST'])
def test():
    auth_headers = request.headers.get('Authorization', '')#.split()
    print(auth_headers)
    msg=token_required(auth_headers)
    if msg==True:
        return jsonify('mdklm')
    else:
        return msg;
    



@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'HTTP 404 Error': 'The content you looks for does not exist. Please check your request.'}), 404)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

