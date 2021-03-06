# apt-maintenance-account (client-side/frontend)  
A web application is developed with a target on Apartment Maintenance Account App and with a real intension on exploring:  
1. Angular Framework,  
2. Authentication using JSON Web Token (JWT),  
3. Authorization using Role Based Access Control (RBAC),  
4. RxJS operators such as Observable,  
5. Base or Foundation code for future projects  

## Demo  
For a demo of this application, please click [here](http://eastgate.in/apt-maint-acct-demo).  
(Note: For login, a guest user-id and password are pre-filled.  The guest has read-only permissions. On the login screen just click on Submit button)  

## Installations (for backend installations refer   [here](https://github.com/mohankumaranna/apt-maintenance-account-backend))  
_Step 1:_  Clone or Download this front-end application into a folder.  
_Step 2:_  `npm install`.  
_Step 3:_  Make necessary updates in the environment files, such as API_URL to /my-apt.  
_Step 4:_  `ng build --prod -bh '/my-apt/'`. It creates 'dist' folder with deployable files.  
_Step 5:_  Copy this 'dist' folder into the hosting site and rename it to 'my-apt' or whatever name selected in the previous step.  
_Step 6:_  On the browser, enter url, say http://www.myhost.com/my-apt.  It shows the home page of this application.  

## License  
MIT  
