const express = require('express');
const router = express.Router();
const { protect, roleBasedAccess } = require('../middleware/authMiddleware');
const batchController = require('../controllers/batchController');

router.get('/', protect, roleBasedAccess(['super_admin', 'admin', 'trainer', 'sales_person']), batchController.getBatches);
router.post('/', protect, roleBasedAccess(['super_admin', 'admin']), batchController.createBatch);
router.put('/:id', protect, roleBasedAccess(['super_admin', 'admin']), batchController.updateBatch);
router.get('/:id/students', protect, roleBasedAccess(['super_admin', 'admin', 'trainer', 'sales_person']), batchController.getBatchStudents);

module.exports = router;

