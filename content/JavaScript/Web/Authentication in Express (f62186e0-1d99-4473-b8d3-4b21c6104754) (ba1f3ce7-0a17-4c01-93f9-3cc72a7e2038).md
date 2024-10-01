# Authentication in Express #

Authentication is a crucial aspect of web applications, ensuring that users are who they claim to be. This guide demonstrates how to implement basic authentication in an Express.js application using JSON Web Tokens (JWT).

## Setting up dependencies ##

First, install the necessary packages:

```bash
npm install express jsonwebtoken bcrypt
```

## Creating the Express server ##

Set up a basic Express server:

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

## User registration ##

Implement a route for user registration:

```javascript
const users = [];

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { username, password: hashedPassword };
    users.push(user);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});
```

## User login ##

Create a login route to authenticate users and issue JWT tokens:

```javascript
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ username: user.username }, SECRET_KEY, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});
```

## Protecting routes ##

Create a middleware to verify JWT tokens and protect routes:

```javascript
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}
```

Use the middleware to protect routes:

```javascript
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Access granted to protected route', user: req.user });
});
```

## Conclusion ##

This basic authentication system demonstrates how to implement user registration, login, and route protection using JWT in an Express application.
Remember to store user data securely in a database and use environment variables for sensitive information like the SECRET_KEY in a production environment.
