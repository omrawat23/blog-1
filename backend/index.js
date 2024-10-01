const express = require('express');
const mongoose = require("mongoose")
const cors = require('cors');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const { initializeApp } = require('firebase/app');
const { getAuth, verifyIdToken } = require('firebase/auth');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const PostModel  = require('./models/Post'); 
const User = require('./models/User'); 
const admin = require('firebase-admin');

const serviceAccount = {
  "type": "service_account",
  "project_id": "blog-4b077",
  "private_key_id": "84bc0765766cd9af8bb75a436d0926c3e74f2978",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCy9xRzX+8j+d8y\nFnuKL2K075jVxnTbvHIRAjyuQIgqlUDOjs0H2amfzVilfhB9XQu5b4FGUw0KkDiK\nglRMcsUeNM2qg9xV7pS32xYTTsZ0w9gXEsnj85SWCBfZJpKZVUV1fQyzFUlRsCaY\npu63fDjIWmqp0ZVCk5yqgQaVQBvNHqFP/RGqMhdfuwtao9gGMGS4L5V0m3oRVH1f\n4quB8Qv47R1iEhXWUIf7KV6VTw5UN0Tyhr3gzs9/ByYKzXxoAhj+oUPYhVto1LyZ\n+K0zeHKf6kWqXz+czN+weQtSeyjSIkMirDC3Hjt617VgAeHAPKSpYeClzsBYMVAm\n64hXycpNAgMBAAECggEAClFxhedhj8bvxeEC9Wge/kSUILsk8KhQQUfKPNeuohnh\n1ybnjkzP2U1LD5uRktDDBMl3gBj4twOyptW1y4SQddngg7S/htrPCzyf7LQNgBzs\ngAQOzMw15GKKEXSGXj3K1+fCTC7tf76ysvlo6P5J/c8suCbDvsdo8HGo8gD0uWIy\ngOuCdOnFtAIS+TCSQOhIS9o3x5I/ELFeeQl7HSEo3cJjqkjf2suIsXN8xf8Ut2Yq\nBeRZdSYvoV7dISFdMfZHMXMU5ZUujb3TlSMUYLP2cLLre51Tqa3/W/Xb+T0RSddT\n6+5IjphlnbZ9DvMUwSEMifWZ1HUCO4sGKaN/X8DPwQKBgQDf1ej8mQvhf7+IBC1C\nYkteY8KAD93hDYdFUzyp7VJL18R35K9aL5EC4f2enb5ipGdYKe0cqTq80INaNmUX\nK5BkKxXcQeugfF6nO2msVhohZbzk9bsUGEjqDnb3Ksj8ncQsJcbaZLDIyqhpsV4F\n2pYzom71/hBkPTUO3InHjwmTIQKBgQDMro0hEHTLav2DUeMPFjB8g3qOpknnAFEe\n0Xhu0qDZ4XRukLE2x1ghrHNzK+nInj0cttLsjqEyqBzY8Kkk4jwJVMvY0v7xKgWX\n9p3OXtpTwcq4CQn7adgjb5YE53+YGvyTxOKYFVGNyA9mahmHqtret3d0DUfQs+I5\ndEaEGHK9rQKBgAzNCvoHNqq6x5Vbx8rYHD9VrTXtsl7Ai0/npryBGgfEWzQQHAco\nWT609fAwTUcO5+oe27Sb6QQLWLe8DKP6ldNks2dZTcRr2G3v8+crNWtbiiX996j6\nipD4Ks2P4Naxnxp3PpwWzhVtoZwJzLrA+X4SeA4RbZaN+Y7UBf0nrQCBAoGAOO3D\nqxKcqYdUg5XfBW8yhS88gziVDX71ERFJ4ekLfA5NCAOOhqHjTVpdsgbguz/n13iy\nKcFx7Fj9zQkCwpN6B05idCgbaJA7hgy9z4xqRSl9bLp24EqMJy7+Ftcckf3PinoU\nXCBx0nF2dxHDkAxhW9jDjK+07cNahIhmpI74OvECgYAtPy50b1coXAuymwoZQom7\ndzBmgLYW7VRG+YepnSzB64G72FueKP8BiYiH4rEEygAAOMdsXoxjJmGp9A9/pI2d\nMAh2UDklXoShoR2YOZsLGTGFAhQv9j7xO+J+6TNopjRvU+frE4DdZ6e+snGFiTzN\nTlvx97oaDaHrtm+Il5XSZQ==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-2d52z@blog-4b077.iam.gserviceaccount.com",
  "client_id": "101622316768603770488",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2d52z%40blog-4b077.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://blog-4b077-default-rtdb.firebaseio.com"
});



// Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyDuB5MlwLBSOgjxEy01p8VeewDDODUKWUY',
    authDomain: 'blog-4b077.firebaseapp.com',
    projectId: 'blog-4b077',
    storageBucket: 'blog-4b077.appspot.com',
    messagingSenderId: '1005872541111',
    appId: '1:1005872541111:web:6fba90552d6a8e6636cc32',
  };

initializeApp(firebaseConfig);
const app = express();
const storage = getStorage();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://or63529:wLuePpf02OQrK4Qr@cluster0.vrmua9i.mongodb.net/');

// Multer setup for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Middleware to authenticate requests
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.sendStatus(403);
  }
};

// Route to verify token and create/update user
app.post('/verifyToken', authenticateToken, async (req, res) => {
  try {
    const { uid, email, name } = req.user;

    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({
        uid,
        email,
        Username: name,
      });
    } else {
      user.email = email;
      user.Username = name;
    }

    await user.save();

    res.status(200).json({ message: 'User authenticated and saved', user });
  } catch (error) {
    console.error('Error in /verifyToken:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET posts for a specific user
app.get('/user/:userId/posts',authenticateToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const posts = await PostModel.find({ author: userId })
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20);
      
      console.log(posts); 
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching posts' });
  }
});


// POST a new post for a specific user
app.post('/user/:userId/post', upload.single('file'), authenticateToken, async (req, res) => {
  const { userId } = req.params; // Extract userId from URL
  const { title, summary, content } = req.body; // Extract fields from body

  console.log('User info:', req.user); // Log user info for debugging

  try {
    // Ensure the logged-in user is the same as the userId in the URL
    if (req.user.uid !== userId) {
      return res.status(403).json({ error: 'You are not authorized to create a post for this user' });
    }

    // Handle file upload if present
    let imageUrl;
    if (req.file) {
      const storageRef = ref(storage, `images/${Date.now()}_${req.file.originalname}`);
      await uploadBytes(storageRef, req.file.buffer);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Create the post document
    const postDoc = await PostModel.create({
      userId: req.user.uid, // Save the user's UID as userId
      title,
      summary,
      content,
      cover: imageUrl || null, // Use uploaded image URL if available
      author: req.user.uid,     // Author is the UID of the logged-in user
    });

    res.status(201).json(postDoc); // Respond with the created post
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'An error occurred while creating the post' });
  }
});


// PUT to update a specific user's post
app.put('/user/:userId/post/:id', upload.single('file'), authenticateToken, async (req, res) => {
 const { userId, id } = req.params; 
  const { title, summary, content } = req.body; // Extract fields from body


  try {
    // Ensure the logged-in user is the author of the post
    const postDoc = await PostModel.findById(id);
    if (!postDoc) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    if (postDoc.author.toString() !== userId) {
      return res.status(403).json({ error: 'You are not authorized to update this post' });
    }

    // Handle file upload if present
    let imageUrl = postDoc.cover; // Retain existing cover if no new file
    if (req.file) {
      const storageRef = ref(storage, `images/${Date.now()}_${req.file.originalname}`);
      await uploadBytes(storageRef, req.file.buffer);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Update the post document
    await postDoc.updateOne({ title, summary, content, cover: imageUrl });
    res.json(postDoc); // Respond with the updated post
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'An error occurred while updating the post' });
  }
});

//Delete a post for specific user
app.delete('/user/:userId/post/:id', authenticateToken, async (req, res) => {
  const { userId, id } = req.params;

  try {
    // Find the post by ID
    const postDoc = await PostModel.findById(id);
    if (!postDoc) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Ensure the logged-in user is the author of the post
    if (postDoc.author.toString() !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this post' });
    }

    // Delete the post document
    await postDoc.remove(); // or use await PostModel.findByIdAndDelete(id);
    
    res.json({ message: 'Post deleted successfully' }); // Respond with success message
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'An error occurred while deleting the post' });
  }
});



// GET a specific post
app.get('/post/:id', authenticateToken, async (req, res) => {
  const { id } = req.params; 


  // Validate the ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid post ID' });
  }

  try {
    const postDoc = await PostModel.findById(id).populate('author', ['username']);
    
    if (!postDoc) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(postDoc);
  } catch (error) {
    console.error('Error retrieving post:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the post' });
  }
});




// Server setup
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));