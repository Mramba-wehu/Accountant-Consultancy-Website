const express = require('express');
const session = require('express-session');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'mwanje_super_secret_key_2026',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Mock Database path
const dataPath = path.join(__dirname, 'data', 'content.json');

// Nodemailer Transporter Configuration
let transporter;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Production: Use real Outlook/Hotmail SMTP
    transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });
    console.log("Production email transporter configured.");
} else {
    // Development: Fallback to Ethereal testing account
    nodemailer.createTestAccount((err, account) => {
        if (err) {
            console.error('Failed to create a testing account. ' + err.message);
            return process.exit(1);
        }
        transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });
        console.log("Development test email transporter (Ethereal) configured.");
    });
}

// Authentication Middleware
function isAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        return next();
    }
    res.status(401).json({ success: false, message: 'Unauthorized access' });
}

// Routes
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (email === 'mwanje_associates@outlook.com' && password === 'Accountantconsultancy@001') {
        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        req.session.twoFactorCode = code;
        req.session.tempUser = email;

        // Send email
        let message = {
            from: 'Admin System <admin@mwanje.com>',
            to: email,
            subject: 'Mwanje & Associates - Your 2FA Code',
            text: `Your login code is: ${code}`,
            html: `<p>Your login code is: <strong>${code}</strong></p>`
        };

        try {
            let info = await transporter.sendMail(message);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            res.json({ success: true, message: '2FA code sent to email', previewUrl: nodemailer.getTestMessageUrl(info) });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ success: false, message: 'Failed to send 2FA email' });
        }
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/api/verify-2fa', (req, res) => {
    const { code } = req.body;
    
    if (req.session.twoFactorCode && req.session.twoFactorCode === code) {
        req.session.isAuthenticated = true;
        delete req.session.twoFactorCode;
        res.json({ success: true, message: 'Logged in successfully' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid 2FA code' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out' });
});

// Content Management Routes
app.get('/api/content', (req, res) => {
    if (fs.existsSync(dataPath)) {
        const rawData = fs.readFileSync(dataPath);
        res.json(JSON.parse(rawData));
    } else {
        res.json({});
    }
});

app.post('/api/content', isAuthenticated, (req, res) => {
    const newContent = req.body;
    fs.writeFileSync(dataPath, JSON.stringify(newContent, null, 2));
    res.json({ success: true, message: 'Content updated successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Check the console output for the Ethereal Email 2FA preview link during login.');
});
