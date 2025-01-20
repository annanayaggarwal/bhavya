const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
// const Manufacturer = require('../models/Manufacturer');
// const FactoryWorker = require('../models/FactoryWorker');
const {getModel} = require('../utils/db')

dotenv.config();

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  console.log('Auth header:', authHeader); // Log the auth header

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    if (!token) {
      console.error('No token provided in Authorization header');
      return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log('JWT verification failed:', err); // Log any verification errors
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    console.log('No auth header present'); // Log if no auth header is found
    res.sendStatus(401);
  }
};

// const isAdmin = async (req, res, next) => {
//   const { role } = req.user;
//   if (role === 'super_admin' || role === 'industry_admin') {
//     next();
//   } else {
//     res.status(403).json({ error: 'Admin access required' });
//   }
// };

// const isAdminOrManufacturer = async (req, res, next) => {
//   const { role } = req.user;
//   if (role === 'super_admin' || role === 'industry_admin' || role === 'manufacturer') {
//     next();
//   } else {
//     res.status(403).json({ error: 'Insufficient permissions' });
//   }
// };


// const isManufacturer = async (req, res, next) => {
//   try {
//     const Manufacturer = getModel('manufacturers', 'Manufacturer');
//     if (!Manufacturer || typeof Manufacturer.findById !== 'function') {
//       console.error('Manufacturer model not found or findById is not a function');
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     const user = await Manufacturer.findById(req.user.userId);
//     if (!user) {
//       return res.status(403).json({ error: 'Access denied. Manufacturer rights required.' });
//     }

//     req.manufacturer = user;
//     next();
//   } catch (error) {
//     console.error('Error in isManufacturer middleware:', error);
//     res.status(500).json({ error: 'Error verifying manufacturer status' });
//   }
// };


// const isFactoryWorker = async (req, res, next) => {
//   try {
//     if (req.user.userType !== 'factory_worker') {
//       return res.status(403).json({ error: 'Access denied. Factory worker rights required.' });
//     }

//     const user = await FactoryWorker.findById(req.user.userId);
//     if (!user) {
//       return res.status(404).json({ error: 'Factory worker not found' });
//     }

//     req.factoryWorker = user;
//     next();
//   } catch (error) {
//     console.error('Error in isFactoryWorker middleware:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

module.exports = { authenticateJWT};