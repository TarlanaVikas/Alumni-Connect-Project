import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { nanoid } from 'nanoid'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const app = express()
const PORT = process.env.PORT || 5175
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'
let db
const sseClients = new Set()
let sseInterval

// CORS configuration via env: CORS_ORIGINS can be comma-separated list
const rawOrigins = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean)
const corsOptions = rawOrigins.length === 0 ? {} : {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true)
    const allowed = rawOrigins.some(o => origin.includes(o))
    if (allowed) callback(null, true)
    else callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(morgan('dev'))

// SQLite setup
async function initDb() {
  db = await open({ filename: './data.sqlite', driver: sqlite3.Database })
  // Lightweight migrations to keep existing databases compatible
  const ensureColumn = async (table, column, type) => {
    try {
      const cols = await db.all(`PRAGMA table_info(${table})`)
      const has = Array.isArray(cols) && cols.some(c => c.name === column)
      if (!has) {
        await db.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`)
      }
    } catch (e) {
      // ignore; table may not exist yet
    }
  }

  await db.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT,
      role TEXT NOT NULL DEFAULT 'alumni',
      university TEXT,
      department TEXT,
      graduation_year INTEGER,
      location TEXT,
      avatar TEXT
    );
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY
    );
    CREATE TABLE IF NOT EXISTS participants (
      conversation_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      PRIMARY KEY (conversation_id, user_id),
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      read INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS mails (
      id TEXT PRIMARY KEY,
      from_name TEXT NOT NULL,
      subject TEXT NOT NULL,
      preview TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      read INTEGER NOT NULL DEFAULT 0,
      starred INTEGER NOT NULL DEFAULT 0,
      archived INTEGER NOT NULL DEFAULT 0,
      attachments INTEGER NOT NULL DEFAULT 0,
      category TEXT NOT NULL,
      to_addr TEXT
    );
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT,
      end_time TEXT,
      location TEXT,
      address TEXT,
      type TEXT,
      category TEXT,
      max_attendees INTEGER,
      current_attendees INTEGER DEFAULT 0,
      price REAL DEFAULT 0,
      image TEXT,
      organizer TEXT,
      featured INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS event_registrations (
      event_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      PRIMARY KEY (event_id, user_id),
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS donation_campaigns (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      goal REAL NOT NULL,
      raised REAL NOT NULL DEFAULT 0,
      donors INTEGER NOT NULL DEFAULT 0,
      days_left INTEGER NOT NULL DEFAULT 30,
      category TEXT,
      image TEXT,
      organizer TEXT,
      featured INTEGER DEFAULT 0,
      urgent INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS donations (
      id TEXT PRIMARY KEY,
      campaign_id TEXT NOT NULL,
      user_id TEXT,
      amount REAL NOT NULL,
      created_at INTEGER NOT NULL,
      receipt TEXT,
      status TEXT NOT NULL DEFAULT 'completed',
      FOREIGN KEY (campaign_id) REFERENCES donation_campaigns(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `)

  // Apply additive migrations for existing DBs created before password support
  await ensureColumn('users', 'password_hash', 'TEXT')
  await ensureColumn('users', 'role', "TEXT NOT NULL DEFAULT 'alumni'")
  await ensureColumn('users', 'university', 'TEXT')
  await ensureColumn('users', 'department', 'TEXT')
  await ensureColumn('users', 'graduation_year', 'INTEGER')
  await ensureColumn('users', 'location', 'TEXT')
  await ensureColumn('users', 'avatar', 'TEXT')

  // Seed basic data if empty
  const row = await db.get('SELECT COUNT(*) as c FROM users')
  if ((row?.c || 0) === 0) {
    const adminPass = bcrypt.hashSync('admin', 10)
    const admin = { id: 'admin', name: 'Admin User', email: 'admin@email.com', password_hash: adminPass, role: 'admin' }
    const studentPass = bcrypt.hashSync('student', 10)
    const alumniPass = bcrypt.hashSync('alumni', 10)
    const u1 = { id: 'u1', name: 'Student User', email: 'student@email.com', password_hash: studentPass, role: 'student' }
    const u2 = { id: 'u2', name: 'Alumni One', email: 'alumni@email.com', password_hash: alumniPass, role: 'alumni' }
    const u3 = { id: 'u3', name: 'Alumni Two', email: 'alumni2@email.com', password_hash: alumniPass, role: 'alumni' }
    await db.run('INSERT INTO users(id,name,email,password_hash,role) VALUES (?,?,?,?,?), (?,?,?,?,?), (?,?,?,?,?), (?,?,?,?,?)',
      admin.id, admin.name, admin.email, admin.password_hash, admin.role,
      u1.id, u1.name, u1.email, u1.password_hash, u1.role,
      u2.id, u2.name, u2.email, u2.password_hash, u2.role,
      u3.id, u3.name, u3.email, u3.password_hash, u3.role
    )

    const c1 = 'c1', c2 = 'c2'
    await db.run('INSERT INTO conversations(id) VALUES (?), (?)', c1, c2)
    await db.run('INSERT INTO participants(conversation_id,user_id) VALUES (?,?), (?,?)', c1, 'admin', c1, 'u1')
    await db.run('INSERT INTO participants(conversation_id,user_id) VALUES (?,?), (?,?)', c2, 'admin', c2, 'u2')
    await db.run('INSERT INTO messages(id,conversation_id,sender_id,content,timestamp,read) VALUES (?,?,?,?,?,?), (?,?,?,?,?,?)',
      'm1', c1, 'u1', 'Hey! How are you doing?', Date.now() - 3600000, 1,
      'm2', c1, 'admin', 'Great! Attended a tech talk.', Date.now() - 3500000, 1
    )
    await db.run('INSERT INTO messages(id,conversation_id,sender_id,content,timestamp,read) VALUES (?,?,?,?,?,?)',
      'm3', c2, 'u2', 'Long time no see.', Date.now() - 7200000, 1
    )

    await db.run('INSERT INTO mails(id,from_name,subject,preview,timestamp,read,starred,archived,attachments,category) VALUES (?,?,?,?,?,?,?,?,?,?), (?,?,?,?,?,?,?,?,?,?)',
      'e1', 'Alumni Association', 'Monthly Newsletter - March', 'Check out the latest updates...', Date.now() - 7200000, 0, 1, 0, 1, 'newsletter',
      'e2', 'Event Coordinator', 'Invitation: Annual Alumni Reunion', 'You\'re invited...', Date.now() - 86400000, 1, 0, 0, 0, 'event'
    )

    // Seed events
    await db.run(`INSERT INTO events(id,title,description,date,time,end_time,location,address,type,category,max_attendees,current_attendees,price,image,organizer,featured)
      VALUES
      ('ev1','Annual Alumni Reunion 2024','Join us for our biggest event of the year!','2024-03-15','18:00','23:00','University Campus - Main Hall','123 University Ave, City, State 12345','in-person','social',500,247,0,'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=250&fit=crop','Alumni Association',1),
      ('ev2','Tech Talk: AI in Healthcare','Latest developments in AI in healthcare.','2024-03-20','14:00','16:00','Online - Zoom','Virtual Event','virtual','educational',200,89,0,'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop','Tech Alumni Group',0)
    `)

    // Seed donation campaigns
    await db.run(`INSERT INTO donation_campaigns(id,title,description,goal,raised,donors,days_left,category,image,organizer,featured,urgent) VALUES
      ('dc1','Scholarship Fund 2024','Support deserving students with financial aid. ',100000,67500,234,45,'Education','https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop','University Foundation',1,0),
      ('dc2','Emergency Relief Fund','Help alumni and students facing hardships.',50000,32400,156,12,'Emergency','https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop','Alumni Association',0,1)
    `)
  }

  // Ensure demo users always exist (idempotent for existing databases)
  const ensureDemoUser = async (name, email, password, role) => {
    const existing = await db.get('SELECT id FROM users WHERE email=?', email)
    const passHash = bcrypt.hashSync(password, 10)
    if (!existing) {
      await db.run('INSERT INTO users(id,name,email,password_hash,role) VALUES (?,?,?,?,?)', nanoid(), name, email, passHash, role)
    } else {
      await db.run('UPDATE users SET name=?, role=?, password_hash=? WHERE email=?', name, role, passHash, email)
    }
  }
  await ensureDemoUser('Admin User', 'admin@email.com', 'admin', 'admin')
  await ensureDemoUser('Student User', 'student@email.com', 'student', 'student')
  await ensureDemoUser('Alumni One', 'alumni@email.com', 'alumni', 'alumni')
}

// Auth helpers
function generateToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' })
}

async function getUserByEmail(email) {
  const e = (email || '').toLowerCase()
  return db.get('SELECT * FROM users WHERE LOWER(email)=LOWER(?)', e)
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// Health check
app.get('/healthz', (req, res) => res.json({ ok: true }))

// Root route
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'alumni-api', time: new Date().toISOString() })
})

// Compute and send metrics
async function computeMetrics() {
  const [usersRow, eventsRow, upcomingRow, donationsRow, monthlyDonRow, messagesRow, unreadRow] = await Promise.all([
    db.get('SELECT COUNT(*) as n FROM users'),
    db.get('SELECT COUNT(*) as n FROM events'),
    db.get("SELECT COUNT(*) as n FROM events WHERE date >= date('now')"),
    db.get('SELECT COALESCE(SUM(amount),0) as sum FROM donations'),
    db.get('SELECT COALESCE(SUM(amount),0) as sum FROM donations WHERE created_at >= ?', Date.now() - 30*24*60*60*1000),
    db.get('SELECT COUNT(*) as n FROM messages'),
    db.get("SELECT COUNT(*) as n FROM messages WHERE sender_id<> 'admin' AND read=0")
  ])
  return {
    timestamp: Date.now(),
    users: usersRow?.n || 0,
    events: eventsRow?.n || 0,
    upcomingEvents: upcomingRow?.n || 0,
    totalDonations: donationsRow?.sum || 0,
    monthlyDonations: monthlyDonRow?.sum || 0,
    messagesSent: messagesRow?.n || 0,
    newMessages: unreadRow?.n || 0
  }
}

async function broadcastMetrics() {
  if (sseClients.size === 0) return
  const payload = await computeMetrics()
  const data = `data: ${JSON.stringify(payload)}\n\n`
  for (const res of sseClients) {
    try { res.write(data) } catch {}
  }
}

// SSE endpoint for live metrics
app.get('/api/metrics/sse', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders?.()

  sseClients.add(res)
  // Send initial snapshot
  res.write(`event: snapshot\n`)
  res.write(`data: ${JSON.stringify(await computeMetrics())}\n\n`)

  req.on('close', () => {
    sseClients.delete(res)
  })
})

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, university, department, graduationYear, location } = req.body || {}
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' })
  const emailLower = (email || '').toLowerCase()
  const existing = await getUserByEmail(emailLower)
  if (existing) return res.status(409).json({ error: 'Email already in use' })
  const id = nanoid()
  const password_hash = await bcrypt.hash(password, 10)
  await db.run('INSERT INTO users(id,name,email,password_hash,role,university,department,graduation_year,location,avatar) VALUES (?,?,?,?,?,?,?,?,?,?)',
    id, name, emailLower, password_hash, 'alumni', university || null, department || null, graduationYear || null, location || null, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face')
  const user = await db.get('SELECT id,name,email,role,university,department,graduation_year as graduationYear,location,avatar FROM users WHERE id=?', id)
  const token = generateToken(user)
  return res.status(201).json({ token, user })
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })
  const user = await getUserByEmail(email)
  if (!user || !user.password_hash) return res.status(401).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password_hash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const safe = { id: user.id, name: user.name, email: user.email, role: user.role, university: user.university, department: user.department, graduationYear: user.graduation_year, location: user.location, avatar: user.avatar }
  const token = generateToken(safe)
  return res.json({ token, user: safe })
})

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const row = await db.get('SELECT id,name,email,role,university,department,graduation_year as graduationYear,location,avatar FROM users WHERE id=?', req.user.sub)
  if (!row) return res.status(404).json({ error: 'Not found' })
  res.json(row)
})

// Messaging routes
app.get('/api/messages/chats', async (req, res) => {
  const convs = await db.all(`
    SELECT c.id as id,
           (SELECT u.name FROM participants p JOIN users u ON u.id=p.user_id WHERE p.conversation_id=c.id AND u.id<> 'admin' LIMIT 1) as name
    FROM conversations c
  `)
  const results = []
  for (const c of convs) {
    const last = await db.get('SELECT content, timestamp FROM messages WHERE conversation_id=? ORDER BY timestamp DESC LIMIT 1', c.id)
    const unreadRow = await db.get("SELECT COUNT(*) as cnt FROM messages WHERE conversation_id=? AND sender_id<> 'admin' AND read=0", c.id)
    results.push({
      id: c.id,
      name: c.name || 'Unknown',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.name || 'U')}`,
      lastMessage: last?.content || '',
      timestamp: last ? new Date(last.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      unread: unreadRow?.cnt || 0,
      online: true
    })
  }
  res.json(results)
})

app.get('/api/messages/chats/:chatId', async (req, res) => {
  const conv = await db.get('SELECT id FROM conversations WHERE id=?', req.params.chatId)
  if (!conv) return res.status(404).json({ error: 'Chat not found' })
  const messages = await db.all('SELECT id,sender_id as sender,content,timestamp,read FROM messages WHERE conversation_id=? ORDER BY timestamp ASC', req.params.chatId)
  res.json({ id: conv.id, messages })
})

app.post('/api/messages/chats/:chatId/send', async (req, res) => {
  const conv = await db.get('SELECT id FROM conversations WHERE id=?', req.params.chatId)
  if (!conv) return res.status(404).json({ error: 'Chat not found' })
  const { content } = req.body
  if (!content || !content.trim()) return res.status(400).json({ error: 'Content required' })
  const message = { id: nanoid(), sender: 'admin', content, timestamp: Date.now(), read: 0 }
  await db.run('INSERT INTO messages(id,conversation_id,sender_id,content,timestamp,read) VALUES (?,?,?,?,?,?)', message.id, req.params.chatId, 'admin', content, message.timestamp, 0)
  res.status(201).json(message)
  broadcastMetrics().catch(() => {})
})

// Events routes
app.get('/api/events', async (req, res) => {
  const rows = await db.all('SELECT id,title,description,date,time,end_time as endTime,location,address,type,category,max_attendees as maxAttendees,current_attendees as currentAttendees,price,image,organizer,featured FROM events ORDER BY date ASC')
  res.json(rows)
})

app.post('/api/events', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
  const { title, description, date, time, endTime, location, address, type, category, maxAttendees, price, image, organizer, featured } = req.body || {}
  if (!title || !description || !date) return res.status(400).json({ error: 'title, description, date required' })
  const id = nanoid()
  await db.run('INSERT INTO events(id,title,description,date,time,end_time,location,address,type,category,max_attendees,current_attendees,price,image,organizer,featured) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    id, title, description, date, time || null, endTime || null, location || null, address || null, type || null, category || null, maxAttendees || null, 0, price || 0, image || null, organizer || 'Alumni Association', featured ? 1 : 0)
  const row = await db.get('SELECT id,title,description,date,time,end_time as endTime,location,address,type,category,max_attendees as maxAttendees,current_attendees as currentAttendees,price,image,organizer,featured FROM events WHERE id=?', id)
  res.status(201).json(row)
  broadcastMetrics().catch(() => {})
})

app.post('/api/events/:id/register', authMiddleware, async (req, res) => {
  const ev = await db.get('SELECT id,max_attendees,current_attendees FROM events WHERE id=?', req.params.id)
  if (!ev) return res.status(404).json({ error: 'Event not found' })
  const existing = await db.get('SELECT 1 FROM event_registrations WHERE event_id=? AND user_id=?', ev.id, req.user.sub)
  if (existing) return res.json({ registered: true })
  await db.run('INSERT INTO event_registrations(event_id,user_id) VALUES (?,?)', ev.id, req.user.sub)
  await db.run('UPDATE events SET current_attendees=current_attendees+1 WHERE id=?', ev.id)
  res.json({ registered: true })
  broadcastMetrics().catch(() => {})
})

// Mail routes
app.get('/api/mail', async (req, res) => {
  const rows = await db.all('SELECT id,from_name as [from],subject,preview,timestamp,read,starred,archived,attachments,category FROM mails ORDER BY timestamp DESC')
  res.json(rows)
})

app.post('/api/mail/compose', async (req, res) => {
  const { to, subject, body } = req.body
  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'to, subject, and body are required' })
  }
  const mail = { id: nanoid(), from: 'Admin', subject, preview: body.slice(0,120), timestamp: Date.now(), read: 1, starred: 0, archived: 0, attachments: 0, category: 'outbox', to }
  await db.run('INSERT INTO mails(id,from_name,subject,preview,timestamp,read,starred,archived,attachments,category,to_addr) VALUES (?,?,?,?,?,?,?,?,?,?,?)', mail.id, mail.from, mail.subject, mail.preview, mail.timestamp, mail.read, mail.starred, mail.archived, mail.attachments, mail.category, to)
  res.status(201).json(mail)
  broadcastMetrics().catch(() => {})
})

app.post('/api/mail/:id/archive', async (req, res) => {
  const row = await db.get('SELECT id FROM mails WHERE id=?', req.params.id)
  if (!row) return res.status(404).json({ error: 'Mail not found' })
  await db.run('UPDATE mails SET archived=1 WHERE id=?', req.params.id)
  res.json({ id: req.params.id, archived: 1 })
})

app.delete('/api/mail/:id', async (req, res) => {
  const row = await db.get('SELECT id FROM mails WHERE id=?', req.params.id)
  if (!row) return res.status(404).json({ error: 'Mail not found' })
  await db.run('DELETE FROM mails WHERE id=?', req.params.id)
  res.json({ id: req.params.id })
})

// Donations routes
app.get('/api/campaigns', async (req, res) => {
  const rows = await db.all('SELECT id,title,description,goal,raised,donors,days_left as daysLeft,category,image,organizer,featured,urgent FROM donation_campaigns ORDER BY featured DESC, urgent DESC')
  res.json(rows)
})

app.post('/api/campaigns', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
  const { title, description, goal, category, image, organizer, featured, urgent, daysLeft } = req.body || {}
  if (!title || !description || !goal) return res.status(400).json({ error: 'title, description, goal required' })
  const id = nanoid()
  await db.run('INSERT INTO donation_campaigns(id,title,description,goal,raised,donors,days_left,category,image,organizer,featured,urgent) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
    id, title, description, goal, 0, 0, daysLeft || 30, category || null, image || null, organizer || 'University Foundation', featured ? 1 : 0, urgent ? 1 : 0)
  const row = await db.get('SELECT id,title,description,goal,raised,donors,days_left as daysLeft,category,image,organizer,featured,urgent FROM donation_campaigns WHERE id=?', id)
  res.status(201).json(row)
  broadcastMetrics().catch(() => {})
})

app.post('/api/campaigns/:id/donate', async (req, res) => {
  const { amount } = req.body || {}
  if (!amount || amount <= 0) return res.status(400).json({ error: 'amount required' })
  const c = await db.get('SELECT id FROM donation_campaigns WHERE id=?', req.params.id)
  if (!c) return res.status(404).json({ error: 'Campaign not found' })
  const id = nanoid()
  const receipt = `REC-${Date.now()}`
  await db.run('INSERT INTO donations(id,campaign_id,user_id,amount,created_at,receipt,status) VALUES (?,?,?,?,?,?,?)',
    id, c.id, null, amount, Date.now(), receipt, 'completed')
  await db.run('UPDATE donation_campaigns SET raised=raised+?, donors=donors+1 WHERE id=?', amount, c.id)
  res.status(201).json({ id, campaignId: c.id, amount, receipt, status: 'completed' })
  broadcastMetrics().catch(() => {})
})

// Admin routes
app.get('/api/admin/users', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
  const users = await db.all('SELECT id,name,email,role,university,department,graduation_year as graduationYear,location,avatar FROM users ORDER BY name ASC')
  res.json(users)
})

app.get('/api/admin/donations', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
  const rows = await db.all(`
    SELECT d.id, d.amount, d.created_at as createdAt, d.status, d.receipt,
           dc.title as campaignTitle, u.name as donorName, u.email as donorEmail
    FROM donations d
    LEFT JOIN donation_campaigns dc ON dc.id = d.campaign_id
    LEFT JOIN users u ON u.id = d.user_id
    ORDER BY d.created_at DESC
  `)
  res.json(rows)
})

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`)
  })
}).catch(err => {
  console.error('Failed to initialize database', err)
  process.exit(1)
})


