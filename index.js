const express   = require('express');
const cors      = require('cors');
const validator = require('validator');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/register', (req, res) => {
  let { email, dob, password, website_url } = req.body;

  if (website_url && website_url.trim() !== '') {
    console.log('Bot detected!');
    return res.status(400).json({ message: 'Bot detected!' });
  }

  email    = validator.escape(email    || '');
  password = validator.escape(password || '');

  if (!validator.isEmail(validator.unescape(email))) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }

  const dobDate = new Date(dob);
  const today   = new Date();
  if (isNaN(dobDate.getTime()) || dobDate >= today) {
    return res.status(400).json({ message: 'Date of birth cannot be in the future.' });
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(validator.unescape(password))) {
    return res.status(400).json({ message: 'Weak password. Min 8 chars, one uppercase and one number.' });
  }

  console.log('New registration:', validator.unescape(email));
  return res.status(200).json({ message: 'Registration successful!' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
