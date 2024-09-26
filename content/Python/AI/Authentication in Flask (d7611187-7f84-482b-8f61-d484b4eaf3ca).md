# Authentication in Flask #

Flask provides several options for implementing authentication in your web applications. This guide covers basic authentication using Flask-Login, a popular extension for managing user sessions.

## Installation ##

First, install Flask and Flask-Login:

```bash
pip install flask flask-login
```

## Basic Setup ##

Here's a basic setup for authentication in Flask:

```python
from flask import Flask, render_template, redirect, url_for, request, flash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this!

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

# This is a mock database. In a real application, you'd use a proper database.
users = {
    1: User(1, 'user1', generate_password_hash('password1')),
    2: User(2, 'user2', generate_password_hash('password2'))
}

@login_manager.user_loader
def load_user(user_id):
    return users.get(int(user_id))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = next((user for user in users.values() if user.username == username), None)
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('protected'))
        flash('Invalid username or password')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/protected')
@login_required
def protected():
    return f'Logged in as: {current_user.username}'

if __name__ == '__main__':
    app.run(debug=True)
```

## HTML Template ##

Create a `login.html` template in your `templates` folder:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login</title>
  </head>
  <body>
    <h1>Login</h1>
    {% with messages = get_flashed_messages() %} {% if messages %}
    <ul>
      {% for message in messages %}
      <li>{{ message }}</li>
      {% endfor %}
    </ul>
    {% endif %} {% endwith %}
    <form method="POST">
      <input type="text" name="username" placeholder="Username" required />
      <input type="password" name="password" placeholder="Password" required />
      <input type="submit" value="Login" />
    </form>
  </body>
</html>
```

## Key Concepts ##

1. **User Model**: The `User` class inherits from `UserMixin`, which provides default implementations for Flask-Login's requirements.

2. **LoginManager**: This manages the login process and integrates with Flask.

3. **login_required**: This decorator protects routes that require authentication.

4. **current_user**: This proxy provides access to the currently logged-in user.

5. **login_user** and **logout_user**: These functions manage user sessions.

6. **Password Hashing**: Always hash passwords before storing them. This example uses Werkzeug's `generate_password_hash` and `check_password_hash`.

Remember to replace the mock database with a proper database system in a production environment. Also, ensure to use HTTPS in production to protect user credentials during transmission.
