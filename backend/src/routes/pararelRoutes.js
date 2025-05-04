const express = require('express');
const router = express.Router();

const PararelController = require('../controllers/pararelController');

router.get('/pararel', PararelController.getAllPararel);
router.get('/pararel/:id', PararelController.getPararelById);
router.post('/pararel', PararelController.insertPararel);
router.put('/pararel/:id', PararelController.updatePararel);
router.delete('/pararel/:id', PararelController.deletePararel);

module.exports = router;
