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


def to_dict(self):
    rv = dict(self.payload or ())
    rv['message'] = self.message
    return rv

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
    try:
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
    
        return json.dumps("successfully registered user")
    except (MySQLdb.Error, MySQLdb.Warning) as e:
        try:      
            print("exceptinosssss")
            print(e)
            error=str(e)
            response = jsonify(error)
            response.status_code = 200
            return response
        except IndexError:
            error=str(e)
            response = jsonify(error)
            return response
    except TypeError as e:
        print(e)
        error=str(e)
        response = jsonify(error)
        return response
    except ValueError as e:
        print(e)
        error=str(e)
        response = jsonify(error)
        return response
    finally:
        cur.close()
        db.close()


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



@app.route("/userIp",methods=['POST'])
def userIp():
    try:
        tx_data = request.json
        print(tx_data)
        required_fields = ["username", "ip"]           
        db = MySQLdb.connect(host="localhost",  user="root",passwd="toor",db="blockchainUser")  
        cur = db.cursor()
        username=tx_data.get("username")
        ipAddress=tx_data.get("ipAddress")
        sql = "INSERT INTO ipTable (username, ipAddress) VALUES(%s,%s)"    
        val=(format(str(tx_data['username'])),format(str(tx_data['ipAddress'])) )
        cur.execute(sql,val)
        db.commit()
        print(cur.rowcount, "record inserted.")
        return json.dumps("success")
    except (MySQLdb.Error, MySQLdb.Warning) as e:
        try:
            print("exceptinosssss")
            print(e)
            error=str(e)
            response = jsonify(error)
            response.status_code = 200
            return response
        except IndexError:
            error=str(e)
            response = jsonify(error)
            return response
    except TypeError as e:
        print(e)
        error=str(e)
        response = jsonify(error)
        return response
    except ValueError as e:
        print(e)
        error=str(e)
        response = jsonify(error)
        return response
    finally:
        cur.close()
        db.close()
    



@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'HTTP 404 Error': 'The content you looks for does not exist. Please check your request.'}), 404)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

