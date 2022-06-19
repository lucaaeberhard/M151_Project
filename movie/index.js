import { Router } from 'express';
import {
    listAction,
    removeAction,
    formAction,
    saveAction,
    ratingAction
} from './controller.js';

const router = Router();

router.get('/', listAction);
router.get('/rating/:id', ratingAction);
router.get('/form/:id?', formAction);
router.get('/delete/:id', removeAction);
router.post('/save', saveAction);

export { router };