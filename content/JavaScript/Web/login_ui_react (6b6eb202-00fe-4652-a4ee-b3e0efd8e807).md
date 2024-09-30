# Login UI in React #

This documentation provides a simple example of a Login UI component in React. The component includes input fields for username and password, a login button, and basic styling.

## Component Structure ##

The `LoginUI` component is a functional component that uses React hooks to manage state for the username and password inputs. It also includes a form submission handler.

```jsx
import React, { useState } from 'react';
import './LoginUI.css';

const LoginUI = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Login submitted:', { username, password });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginUI;
```

## Styling ##

To style the component, create a `LoginUI.css` file in the same directory:

```css
.login-container {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
```

## Usage ##

To use this component in your React application, import it into the desired parent component or page:

```jsx
import React from 'react';
import LoginUI from './LoginUI';

const App = () => {
  return (
    <div>
      <h1>Welcome to My App</h1>
      <LoginUI />
    </div>
  );
};

export default App;
```

## Customization ##

This example provides a basic structure for a login UI in React. You can further customize the component by adding additional features such as:

- Form validation
- Error messages
- Integration with your authentication system
- Remember me functionality
- Password reset option

Remember to implement proper security measures when handling user credentials in a real-world application.
