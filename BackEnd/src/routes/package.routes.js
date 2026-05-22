import { Router } from "express";
import {
    getPackages,
    getPackageById,
    getPackageByName,
    createPackageType,
    updatePackage,
    deletePackage,
    activatePackage,
    getPackageStats,
    packageFilters,
    getPackageProducts,
    getPackageServices,
    getPackageTypes,
    updatePackageType
} from '../controllers/package.controller.js';

import { validateRules } from "../middleware/validate.middleware.js";
import {
    rulesCreatePackage,
    rulesUpdatePackage
} from '../validators/package.rules.js'

const router = Router();

router.get('/', getPackages);
router.get('/types', getPackageTypes);
router.post('/search', getPackageByName);
router.post('/createType', createPackageType);
router.put('/types/:id', updatePackageType);
router.get('/stats', getPackageStats);
router.get('/filters', packageFilters);
router.get('/:id', getPackageById);
router.put('/:id', updatePackage);
router.delete('/delete/:id', deletePackage);
router.put('/activate/:id', activatePackage);
router.get('/:id/products', getPackageProducts);
router.get('/:id/services', getPackageServices);

export default router;
