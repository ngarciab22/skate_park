import pool from "../config/config.js";

//Obtener todos los skaters
export const getParticipantsQuery = async () => {
  try {
    const sql = {
      text: "SELECT * FROM skaters",
    };
    const result = await pool.query(sql);
    if (result.rowCount > 0) {
      return result.rows;
    }
  } catch (error) {
    console.log("Error al obtener los skaters:", error);
  }
};

//Añadir skater
export const addParticipantQuery = async (
  email,
  nombre,
  password,
  anos_experiencia,
  especialidad,
  foto
) => {
  try {
    const sql = {
      text: "INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto) VALUES ($1, $2, $3, $4, $5, $6)",
      values: [email, nombre, password, anos_experiencia, especialidad, foto],
    };
    const result = await pool.query(sql);
    if (result.rowCount > 0) {
      return result.rows;
    } else {
      console.log("No se pudo registrar el skater");
    }
  } catch (error) {
    console.log("Error al registrar el skater:", error);
  }
};

//Verificar skater
export const verifyParticipantQuery = async (email) => {
  try {
    const sql = {
      text: "SELECT * FROM skaters WHERE email = $1",
      values: [email],
    };
    const result = await pool.query(sql);
    if (result.rowCount > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error al verificar el skater:", error);
  }
};

//Actualizar skater
export const updateParticipantQuery = async (
  email,
  nombre,
  password,
  anos_experiencia,
  especialidad,
  id
) => {
  try {
    const sql = {
      text: "UPDATE skaters SET email = $1, nombre = $2, password = $3, anos_experiencia = $4, especialidad = $5 WHERE id = $6 returning *",
      values: [email, nombre, password, anos_experiencia, especialidad, id],
    };
    const response = await pool.query(sql);
    if (response.rowCount > 0) {
      return response.rows[0];
    } else {
      console.log("No se pudo actualizar el skater");
    }
  } catch (error) {
    console.log("Error al actualizar el skater:", error);
  }
};

//Eliminar skater
export const deleteParticipantQuery = async (id) => {
  try {
    const sql = {
      text: "DELETE FROM skaters WHERE id = $1 RETURNING *",
      values: [id],
    };
    const response = await pool.query(sql);
    if (response.rowCount > 0) {
      return response.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error al eliminar el skater:", error);
  }
};

//Actualizar estado
export const updateStatusQuery = async (id, estado) => {
  try {
    const sql = {
      text: "UPDATE skaters SET estado = $1 WHERE id = $2 RETURNING *",
      values: [estado, id],
    };
    const response = await pool.query(sql);
    if (response.rowCount > 0) {
      return response.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error al actualizar el estado:", error);
  }
};
