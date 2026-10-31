// server.js - Full-Stack Linktree Clone Application Server (Self-Contained & Cloud-Ready)
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// -------------------------------------------------------------
// Embedded Database Engine (Ensures zero missing-module errors on Cloud/Render)
// -------------------------------------------------------------
const DB_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DB_DIR)) {
  try { fs.mkdirSync(DB_DIR, { recursive: true }); } catch (e) {}
}
const DB_FILE = path.join(DB_DIR, 'database.json');

function hashPassword(password, salt) {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex');
  }
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

function verifyPassword(password, storedHash, salt) {
  const { hash } = hashPassword(password, salt);
  return hash === storedHash;
}

function getDefaultData() {
  const alexAuth = hashPassword('password123');
  const sarahAuth = hashPassword('password123');
  const demoAuth = hashPassword('demo123');

  return {
    users: [
      {
        id: 'u_alex',
        username: 'alex',
        email: 'alex@example.com',
        passwordHash: alexAuth.hash,
        passwordSalt: alexAuth.salt,
        name: 'Alex Rivera',
        bio: 'Tech enthusiast, UI designer & coffee addict ☕ Creating sleek digital experiences.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        verified: true,
        theme: 'charcoal',
        buttonStyle: 'rounded',
        font: 'Inter',
        socialPlacement: 'top',
        socials: {
          instagram: 'https://instagram.com',
          youtube: 'https://youtube.com',
          twitter: 'https://x.com',
          github: 'https://github.com',
          spotify: 'https://spotify.com',
          email: 'alex@example.com'
        },
        views: 1420,
        createdAt: new Date().toISOString()
      },
      {
        id: 'u_sarah',
        username: 'sarah',
        email: 'sarah@example.com',
        passwordHash: sarahAuth.hash,
        passwordSalt: sarahAuth.salt,
        name: 'Sarah Chen ✨',
        bio: 'Indie Musician & Visual Artist. New single "Midnight Rain" out everywhere now! 🎵',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
        verified: true,
        theme: 'sunset',
        buttonStyle: 'soft',
        font: 'Poppins',
        socialPlacement: 'top',
        socials: {
          spotify: 'https://spotify.com',
          youtube: 'https://youtube.com',
          tiktok: 'https://tiktok.com',
          instagram: 'https://instagram.com'
        },
        views: 890,
        createdAt: new Date().toISOString()
      },
      {
        id: 'u_demo',
        username: 'demo',
        email: 'demo@example.com',
        passwordHash: demoAuth.hash,
        passwordSalt: demoAuth.salt,
        name: 'Demo Creator',
        bio: 'Welcome to my Linktree! Everything you need in one clean link.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        verified: false,
        theme: 'clean',
        buttonStyle: 'shadow',
        font: 'Inter',
        socialPlacement: 'bottom',
        socials: {
          twitter: 'https://x.com',
          github: 'https://github.com'
        },
        views: 310,
        createdAt: new Date().toISOString()
      }
    ],
    links: [
      {
        id: 'l_alex_1',
        userId: 'u_alex',
        title: '🚀 Check out my New Portfolio 2026',
        url: 'https://dribbble.com',
        icon: 'folder',
        active: true,
        order: 0,
        clicks: 421,
        createdAt: new Date().toISOString()
      },
      {
        id: 'l_alex_2',
        userId: 'u_alex',
        title: '📺 Latest YouTube: How to Build Clean Web Apps',
        url: 'https://youtube.com',
        icon: 'youtube',
        active: true,
        order: 1,
        clicks: 310,
        createdAt: new Date().toISOString()
      },
      {
        id: 'l_alex_3',
        userId: 'u_alex',
        title: '🎨 Figma Design UI Kit (Free Download)',
        url: 'https://figma.com',
        icon: 'palette',
        active: true,
        order: 2,
        clicks: 580,
        createdAt: new Date().toISOString()
      },
      {
        id: 'l_alex_4',
        userId: 'u_alex',
        title: '☕ Support my work on Buy Me a Coffee',
        url: 'https://buymeacoffee.com',
        icon: 'coffee',
        active: true,
        order: 3,
        clicks: 110,
        createdAt: new Date().toISOString()
      },
      {
        id: 'l_sarah_1',
        userId: 'u_sarah',
        title: '🎧 Stream "Midnight Rain" on Spotify',
        url: 'https://spotify.com',
        icon: 'music',
        active: true,
        order: 0,
        clicks: 340,
        createdAt: new Date().toISOString()
      },
      {
        id: 'l_sarah_2',
        userId: 'u_sarah',
        title: '🎟️ Summer Tour 2026 - Tickets & VIP Passes',
        url: 'https://ticketmaster.com',
        icon: 'ticket',
        active: true,
        order: 1,
        clicks: 215,
        createdAt: new Date().toISOString()
      },
      {
        id: 'l_sarah_3',
        userId: 'u_sarah',
        title: '👕 Official Merchandise Store',
        url: 'https://shopify.com',
        icon: 'shopping-bag',
        active: true,
        order: 2,
        clicks: 180,
        createdAt: new Date().toISOString()
      },
      {
        id: 'l_demo_1',
        userId: 'u_demo',
        title: '🌐 Visit My Official Website',
        url: 'https://example.com',
        icon: 'globe',
        active: true,
        order: 0,
        clicks: 95,
        createdAt: new Date().toISOString()
      },
      {
        id: 'l_demo_2',
        userId: 'u_demo',
        title: '📬 Subscribe to Weekly Newsletter',
        url: 'https://substack.com',
        icon: 'mail',
        active: true,
        order: 1,
        clicks: 65,
        createdAt: new Date().toISOString()
      }
    ],
    analytics: [
      { type: 'view', userId: 'u_alex', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
      { type: 'view', userId: 'u_alex', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
      { type: 'view', userId: 'u_alex', timestamp: new Date(Date.now() - 86400000 * 1).toISOString() },
      { type: 'view', userId: 'u_alex', timestamp: new Date().toISOString() }
    ]
  };
}

class Database {
  constructor() {
    this.memoryData = null;
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        const initial = getDefaultData();
        fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
        this.memoryData = initial;
      }
    } catch (err) {
      console.warn('Filesystem read-only or error, using in-memory state:', err.message);
      this.memoryData = getDefaultData();
    }
  }

  read() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(content);
      }
    } catch (err) {}
    if (!this.memoryData) {
      this.memoryData = getDefaultData();
    }
    return this.memoryData;
  }

  write(data) {
    this.memoryData = data;
    try {
      const tempPath = DB_FILE + '.tmp';
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      // In-memory fallback
    }
  }

  getUserByUsername(username) {
    if (!username) return null;
    const db = this.read();
    return db.users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
  }

  getUserById(id) {
    const db = this.read();
    return db.users.find(u => u.id === id) || null;
  }

  getUserByEmail(email) {
    if (!email) return null;
    const db = this.read();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  createUser({ username, email, password, name }) {
    const db = this.read();
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    
    if (db.users.some(u => u.username.toLowerCase() === cleanUsername)) {
      throw new Error('Username is already taken');
    }
    if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email is already registered');
    }

    const { hash, salt } = hashPassword(password);
    const newUser = {
      id: 'u_' + crypto.randomBytes(6).toString('hex'),
      username: cleanUsername,
      email: email.trim().toLowerCase(),
      passwordHash: hash,
      passwordSalt: salt,
      name: name || cleanUsername,
      bio: 'Welcome to my official Linktree! Check out my links below.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      verified: false,
      theme: 'clean',
      buttonStyle: 'rounded',
      font: 'Inter',
      socialPlacement: 'top',
      socials: {},
      views: 0,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);

    db.links.push({
      id: 'l_' + crypto.randomBytes(6).toString('hex'),
      userId: newUser.id,
      title: '🌟 Welcome to my first Link!',
      url: 'https://google.com',
      icon: 'globe',
      active: true,
      order: 0,
      clicks: 0,
      createdAt: new Date().toISOString()
    });

    this.write(db);
    return newUser;
  }

  updateUserProfile(userId, updates) {
    const db = this.read();
    const index = db.users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');

    const allowedFields = [
      'name', 'bio', 'avatar', 'theme', 'buttonStyle',
      'font', 'socialPlacement', 'socials', 'bgImage', 'customBgColor',
      'customTextColor', 'customBtnColor', 'customBtnTextColor'
    ];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        db.users[index][field] = updates[field];
      }
    });

    this.write(db);
    return db.users[index];
  }

  getUserLinks(userId) {
    const db = this.read();
    return db.links
      .filter(l => l.userId === userId)
      .sort((a, b) => a.order - b.order);
  }

  createLink(userId, { title, url, icon = 'globe', active = true }) {
    const db = this.read();
    const userLinks = db.links.filter(l => l.userId === userId);
    const newLink = {
      id: 'l_' + crypto.randomBytes(6).toString('hex'),
      userId,
      title: title || 'My Link',
      url: url || 'https://linktr.ee',
      icon,
      active: active !== false,
      order: userLinks.length,
      clicks: 0,
      createdAt: new Date().toISOString()
    };
    db.links.push(newLink);
    this.write(db);
    return newLink;
  }

  updateLink(userId, linkId, updates) {
    const db = this.read();
    const link = db.links.find(l => l.id === linkId && l.userId === userId);
    if (!link) throw new Error('Link not found');

    if (updates.title !== undefined) link.title = updates.title;
    if (updates.url !== undefined) link.url = updates.url;
    if (updates.icon !== undefined) link.icon = updates.icon;
    if (updates.active !== undefined) link.active = !!updates.active;
    if (updates.order !== undefined) link.order = Number(updates.order);

    this.write(db);
    return link;
  }

  deleteLink(userId, linkId) {
    const db = this.read();
    const index = db.links.findIndex(l => l.id === linkId && l.userId === userId);
    if (index === -1) throw new Error('Link not found');
    db.links.splice(index, 1);
    this.write(db);
    return true;
  }

  reorderLinks(userId, orderedIds) {
    const db = this.read();
    orderedIds.forEach((id, newOrder) => {
      const link = db.links.find(l => l.id === id && l.userId === userId);
      if (link) {
        link.order = newOrder;
      }
    });
    this.write(db);
    return this.getUserLinks(userId);
  }

  trackProfileView(userId) {
    const db = this.read();
    const user = db.users.find(u => u.id === userId);
    if (user) {
      user.views = (user.views || 0) + 1;
      db.analytics.push({
        type: 'view',
        userId,
        timestamp: new Date().toISOString()
      });
      if (db.analytics.length > 5000) {
        db.analytics = db.analytics.slice(-5000);
      }
      this.write(db);
    }
  }

  trackLinkClick(linkId) {
    const db = this.read();
    const link = db.links.find(l => l.id === linkId);
    if (link) {
      link.clicks = (link.clicks || 0) + 1;
      db.analytics.push({
        type: 'click',
        linkId,
        userId: link.userId,
        timestamp: new Date().toISOString()
      });
      if (db.analytics.length > 5000) {
        db.analytics = db.analytics.slice(-5000);
      }
      this.write(db);
      return link.url;
    }
    return null;
  }

  getAnalytics(userId) {
    const db = this.read();
    const user = db.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    const userLinks = db.links.filter(l => l.userId === userId);
    const totalClicks = userLinks.reduce((acc, l) => acc + (l.clicks || 0), 0);
    const totalViews = user.views || 0;
    const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0;

    const now = Date.now();
    const dayStats = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const key = d.toISOString().split('T')[0];
      dayStats[key] = { date: key, views: 0, clicks: 0 };
    }

    db.analytics.forEach(event => {
      if (event.userId === userId && event.timestamp) {
        const key = event.timestamp.split('T')[0];
        if (dayStats[key]) {
          if (event.type === 'view') dayStats[key].views++;
          if (event.type === 'click') dayStats[key].clicks++;
        }
      }
    });

    return {
      totalViews,
      totalClicks,
      ctr,
      links: userLinks.sort((a, b) => (b.clicks || 0) - (a.clicks || 0)),
      dailyActivity: Object.values(dayStats)
    };
  }
}

const db = new Database();

// -------------------------------------------------------------
// Express Server Setup
// -------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
app.use(cookieParser('linktree_secret_key_2026'));
app.use(express.static(path.join(__dirname, 'public')));

function authMiddleware(req, res, next) {
  const userId = req.signedCookies.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: Please login first' });
  }
  const user = db.getUserById(userId);
  if (!user) {
    res.clearCookie('userId');
    return res.status(401).json({ error: 'User session expired' });
  }
  req.user = user;
  next();
}

// -------------------------------------------------------------
// HTML Page Routes
// -------------------------------------------------------------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'landing.html'));
});

app.get('/login', (req, res) => {
  if (req.signedCookies.userId) {
    return res.redirect('/admin');
  }
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/signup', (req, res) => {
  if (req.signedCookies.userId) {
    return res.redirect('/admin');
  }
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/admin', (req, res) => {
  if (!req.signedCookies.userId) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

app.get('/logout', (req, res) => {
  res.clearCookie('userId');
  res.redirect('/login');
});

app.get('/r/:linkId', (req, res) => {
  const { linkId } = req.params;
  const targetUrl = db.trackLinkClick(linkId);
  if (targetUrl) {
    return res.redirect(targetUrl);
  }
  res.status(404).send('Link not found or inactive');
});

// -------------------------------------------------------------
// REST API Routes
// -------------------------------------------------------------
app.get('/api/check-username/:username', (req, res) => {
  const { username } = req.params;
  const user = db.getUserByUsername(username);
  res.json({ available: !user, username });
});

app.post('/api/auth/register', (req, res) => {
  try {
    const { username, email, password, name } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }
    const user = db.createUser({ username, email, password, name });
    res.cookie('userId', user.id, { signed: true, httpOnly: true, maxAge: 86400000 * 14 });
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { usernameOrEmail, password } = req.body;
  if (!usernameOrEmail || !password) {
    return res.status(400).json({ error: 'Please enter username/email and password' });
  }

  let user = db.getUserByUsername(usernameOrEmail);
  if (!user) {
    user = db.getUserByEmail(usernameOrEmail);
  }

  if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
    return res.status(401).json({ error: 'Invalid username/email or password' });
  }

  res.cookie('userId', user.id, { signed: true, httpOnly: true, maxAge: 86400000 * 14 });
  res.json({ success: true, user });
});

app.get('/api/user/me', authMiddleware, (req, res) => {
  const user = req.user;
  const links = db.getUserLinks(user.id);
  const analytics = db.getAnalytics(user.id);
  res.json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      verified: user.verified,
      theme: user.theme || 'clean',
      buttonStyle: user.buttonStyle || 'rounded',
      font: user.font || 'Inter',
      socialPlacement: user.socialPlacement || 'top',
      socials: user.socials || {},
      bgImage: user.bgImage || null,
      customBgColor: user.customBgColor,
      customTextColor: user.customTextColor,
      customBtnColor: user.customBtnColor,
      customBtnTextColor: user.customBtnTextColor
    },
    links,
    analytics
  });
});

app.put('/api/user/profile', authMiddleware, (req, res) => {
  try {
    const updated = db.updateUserProfile(req.user.id, req.body);
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/user/links', authMiddleware, (req, res) => {
  try {
    const { title, url, icon, active } = req.body;
    const link = db.createLink(req.user.id, { title, url, icon, active });
    res.json({ success: true, link });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/user/links/:id', authMiddleware, (req, res) => {
  try {
    const link = db.updateLink(req.user.id, req.params.id, req.body);
    res.json({ success: true, link });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/user/links/:id', authMiddleware, (req, res) => {
  try {
    db.deleteLink(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/user/links-reorder', authMiddleware, (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds must be an array' });
    }
    const links = db.reorderLinks(req.user.id, orderedIds);
    res.json({ success: true, links });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/user/analytics', authMiddleware, (req, res) => {
  try {
    const analytics = db.getAnalytics(req.user.id);
    res.json(analytics);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/public/:username', (req, res) => {
  const user = db.getUserByUsername(req.params.username);
  if (!user) {
    return res.status(404).json({ error: 'Creator not found' });
  }
  db.trackProfileView(user.id);

  const links = db.getUserLinks(user.id).filter(l => l.active);
  res.json({
    user: {
      username: user.username,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      verified: user.verified,
      theme: user.theme || 'clean',
      buttonStyle: user.buttonStyle || 'rounded',
      font: user.font || 'Inter',
      socialPlacement: user.socialPlacement || 'top',
      socials: user.socials || {},
      bgImage: user.bgImage || null,
      customBgColor: user.customBgColor,
      customTextColor: user.customTextColor,
      customBtnColor: user.customBtnColor,
      customBtnTextColor: user.customBtnTextColor
    },
    links
  });
});

app.get('/:username', (req, res, next) => {
  const reserved = ['login', 'signup', 'admin', 'logout', 'r', 'api', 'css', 'js', 'images'];
  if (reserved.includes(req.params.username.toLowerCase())) {
    return next();
  }
  const user = db.getUserByUsername(req.params.username);
  if (!user) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>User Not Found - Linktree</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
      </head>
      <body class="bg-[#f3f3f1] min-h-screen flex items-center justify-center font-['Plus_Jakarta_Sans'] p-6">
        <div class="text-center max-w-md bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
          <div class="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🌴</div>
          <h1 class="text-2xl font-black text-stone-900 mb-2">The page you're looking for doesn't exist.</h1>
          <p class="text-stone-500 mb-6">Want this username? Claim <strong>@${req.params.username}</strong> now and create your own Linktree!</p>
          <a href="/signup?claim=${encodeURIComponent(req.params.username)}" class="inline-block w-full py-3.5 px-6 bg-[#d2e823] hover:bg-[#c0d619] text-stone-900 font-bold rounded-full transition shadow-sm">
            Claim this Linktree
          </a>
          <a href="/" class="inline-block mt-4 text-stone-500 text-sm font-semibold hover:underline">
            Go to Linktree Home
          </a>
        </div>
      </body>
      </html>
    `);
  }
  res.sendFile(path.join(__dirname, 'views', 'profile.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Linktree Clone running at: http://localhost:${PORT}`);
});
