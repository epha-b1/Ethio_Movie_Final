# Ethio_Movie_Final
---
Ethio Movie Final is a movie website that allows users to search for movies and TV shows, read reviews, and watch trailers. It also provides information

---
Before install the package remove package-lock.json 

## 1. To access api
    cd api
    npm install --legacy-peer-deps
    npm start

if you want to setup by your environmental variable modify the .env file

    MONGO_URL = mongodb://127.0.0.1:27017/ethio_movie
    SECRET_KEY = epha
    PORT = 8800
    CHAPA_AUTH_KEY = CHASECK_TEST-J8PEIEntxkQ3v0GvxuzukNzgREwQyhJX


    EMAIL_USERNAME= write your email
    EMAIL_PASSWORD= email password

Our api End-point
          
    For Authentication :
        Login :   http://localhost:8800/api/auth/login  || Method = POST
        Sign-Up : http://localhost:8800/api/auth/register || Method = POST

    For Users managment :
        Forget-password : http://localhost:8800/api/users/forgot-password || Method = POST
        Reset-password : http://localhost:8800/api/users/reset-password || Method = POST
        To-get all user :http://localhost:8800/api/users || Method = GET

    For Movies :
        Get Movies  : http://localhost:8800/api/movies || Method = GET
        Create Movies  : http://localhost:8800/api/movies || Method = Post
    
    For Series :
        Get Series-movies  : http://localhost:8800/api/serious || Method = GET
        Create Series-movies  : http://localhost:8800/api/serious || Method = Post

    For Subscription :
        To Subscirbe  : http://localhost:8800/api/movies || Method = POST
        
    
---

## 2. To access Admin-Dasheboard
    cd admin
    npm install --legacy-peer-deps  
    npm start
---    
## 3. To access Content-Creator-Dashboard
    cd contentCreator
    npm install --legacy-peer-deps  
    npm start
---    
## 4. To access EthioView Client 
    cd client
    npm install --legacy-peer-deps
    npm start