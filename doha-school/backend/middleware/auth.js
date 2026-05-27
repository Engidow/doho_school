const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. No token.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: 'Not authorized.' });
    }
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized. Invalid token.' });
  }
};

const superAdmin = (req, res, next) => {
  if (req.admin && req.admin.role === 'superadmin') return next();
  return res.status(403).json({ success: false, message: 'Forbidden. Super admin access required.' });
};

module.exports = { protect, superAdmin };
