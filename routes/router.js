import express from "express";
import { index, registerForm, newRegister, loginForm, login, updateData, deleteData, admin, updateStatus } from "../controllers/controller.js";

const router = express.Router();

router.get("/", index);
router.get("/registro", registerForm);
router.post("/registro", newRegister);
router.get("/login", loginForm);
router.post("/login", login);
router.put('/update/:id', updateData);
router.delete('/delete/:id', deleteData);
router.get('/admin', admin);
router.put('/updateStatus/:id', updateStatus);
router.get('*', (req, res) => {
    res.status(404).send('Página no encontrada');
  });

export default router