const router = require('express').Router();
const { Op } = require('sequelize');

router.get('/', (req, res) => {
    res.render('all'); 
    
  });