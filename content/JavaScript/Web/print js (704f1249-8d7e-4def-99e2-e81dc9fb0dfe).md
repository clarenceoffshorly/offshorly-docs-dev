# Print in JavaScript #

This markdown file demonstrates how to use the `print` functionality in JavaScript.

## Console Logging ##

In JavaScript, we typically use `console.log()` to print output to the console. Here's an example:

```javascript
console.log('Hello, World!');
```

## Printing to the Browser ##

To print content to the browser, you can use `document.write()`. However, this method is generally discouraged for modern web development. Instead, you can manipulate the DOM to add content:

```javascript
document.getElementById('output').textContent = 'Hello, World!';
```

## Printing a Web Page ##

To trigger the browser's print dialog, you can use the `window.print()` method:

```javascript
window.print();
```

Remember to use these methods appropriately based on your specific use case and development context.
