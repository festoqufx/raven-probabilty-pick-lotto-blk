const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

function generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols) {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let charset = '';
  if (includeUppercase) charset += uppercase;
  if (includeLowercase) charset += lowercase;
  if (includeNumbers) charset += numbers;
  if (includeSymbols) charset += symbols;

  if (charset === '') return '';

  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

app.post('/generate-password', (req, res) => {
  const { length, includeUppercase, includeLowercase, includeNumbers, includeSymbols } = req.body;
  const password = generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols);
  res.json({ password });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});