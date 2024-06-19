import jwt from "jsonwebtoken";
import {
  getParticipantsQuery,
  addParticipantQuery,
  verifyParticipantQuery,
  updateParticipantQuery,
  deleteParticipantQuery,
  updateStatusQuery,
} from "../models/queries.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const secretKey = process.env.JWT_SECRET_KEY;

//controlador de index
export const index = async (req, res) => {
  try {
    const skaters = await getParticipantsQuery();
    res.render("index", { skaters, title: "Inicio" });
  } catch (error) {
    res.status(500).send("Error del servidor");
  }
};
//controlador del formulario de registro
export const registerForm = async (req, res) => {
  res.render("registro", { title: "Registro" });
};

//controlador de nuevo registro
export const newRegister = async (req, res) => {
  try {
    const { email, nombre, password, anos_experiencia, especialidad } =
      req.body;
    const { foto } = req.files;
    const uuid = uuidv4().slice(0, 8);
    const fotoUrl = `img/${uuid}.jpg`;
    const fotoSave = `public/img/${uuid}.jpg`;
    const hashedPassword = await bcrypt.hash(password, 10);
    foto.mv(fotoSave);
    try {
      await addParticipantQuery(
        email,
        nombre,
        hashedPassword,
        anos_experiencia,
        especialidad,
        fotoUrl
      );

      const token = jwt.sign({ email }, secretKey, { expiresIn: "120s" });

      res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

      res.status(200).redirect("/");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al registrar el skater");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error del servidor");
  }
};

//controlador de formulario de login
export const loginForm = async (req, res) => {
  res.render("login", { title: "Iniciar Sesión" });
};

//controlador de login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const skater = await verifyParticipantQuery(email);
    if (!skater) {
      console.log("Usuario no encontrado");
      return res.status(401).send("Credenciales incorrectas");
    }
    const passwordMatch = await bcrypt.compare(password, skater.password);
    if (!passwordMatch) {
      console.log("Contraseña incorrecta");
      return res.status(401).send("Credenciales incorrectas");
    }
    const token = jwt.sign({ email }, secretKey, { expiresIn: "60s" });

    res.cookie("token", token, { httpOnly: true });

    res.render("datos", { skater });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).send("Error del servidor");
  }
};

//controlador de formulario de actualización
export const updateData = async (req, res) => {
  try {
    const { email, nombre, password, anos_experiencia, especialidad } =
      req.body;
    const { id } = req.params;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      await updateParticipantQuery(
        email,
        nombre,
        hashedPassword,
        anos_experiencia,
        especialidad,
        id
      );
      res.status(200).redirect("/");
    } catch (error) {
      res.status(500).send("Error al actualizar el skater");
    }
  } catch (error) {
    res.status(500).send("Error del servidor");
  }
};

//controlador de eliminación
export const deleteData = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await deleteParticipantQuery(id);
      res.status(200).redirect("/");
    } catch (error) {
      res.status(500).send("Error al eliminar el skater");
    }
  } catch (error) {
    res.status(500).send("Error del servidor");
  }
};

export const admin = async (req, res) => {
  try {
    const skaters = await getParticipantsQuery();
    res.render("admin", { skaters, title: "Administración" });
  } catch (error) {
    res.status(500).send("Error del servidor");
  }
};
//controlador de actualización de estado
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    await updateStatusQuery(id, estado);
    res.status(200).redirect("/admin");
  } catch (error) {
    res.status(500).send("Error al actualizar el estado");
  }
};
