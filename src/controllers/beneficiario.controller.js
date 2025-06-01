import { pool } from '../db.js'

// Obtener todos los beneficiarios
export const getBeneficiarios = async (req, res) => {
  try {
    const querySQL = "SELECT * FROM beneficiarios"
    const [results] = await pool.query(querySQL)
    res.send(results)
  } catch (error) {
    console.error("Error al obtener beneficiarios", error)
    res.status(500).send("Error del servidor")
  }
}

// Obtener un beneficiario por ID
export const getBeneficiarioById = async (req, res) => {
  try {
    const querySQL = "SELECT * FROM beneficiarios WHERE idbeneficiario = ?"
    const [results] = await pool.query(querySQL, [req.params.id])

    if (results.length === 0) {
      return res.status(404).json({ message: 'No existe el ID' })
    }

    res.send(results[0])
  } catch (error) {
    console.error("Error al obtener beneficiario", error)
    res.status(500).send("Error del servidor")
  }
}

// Crear nuevo beneficiario
export const createBeneficiario = async (req, res) => {
  try {
    let { apellidos, nombres, dni, telefono, direccion } = req.body

    if (!apellidos || !nombres || !dni || !telefono) {
      return res.status(400).json({ message: "Faltan campos obligatorios" })
    }

    direccion = direccion?.trim() === '' ? null : direccion

    const querySQL = `
      INSERT INTO beneficiarios (apellidos, nombres, dni, telefono, direccion)
      VALUES (?, ?, ?, ?, ?)
    `

    const [results] = await pool.query(querySQL, [apellidos, nombres, dni, telefono, direccion])

    res.send({
      status: true,
      message: "Beneficiario registrado correctamente",
      id: results.insertId
    })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "El DNI ya está registrado" })
    }
    console.error("Error al crear beneficiario", error)
    res.status(500).send("Error del servidor")
  }
}

// Actualizar beneficiario
export const updateBeneficiario = async (req, res) => {
  try {
    const id = req.params.id
    let { apellidos, nombres, dni, telefono, direccion } = req.body

    direccion = direccion?.trim() === '' ? null : direccion

    const querySQL = `
      UPDATE beneficiarios SET
        apellidos = ?,
        nombres = ?,
        dni = ?,
        telefono = ?,
        direccion = ?,
        modificado = NOW()
      WHERE idbeneficiario = ?
    `

    const [results] = await pool.query(querySQL, [apellidos, nombres, dni, telefono, direccion, id])

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'El ID no existe' })
    }

    res.send({ message: "Actualizado correctamente" })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "El DNI ya está registrado" })
    }
    console.error("Error al actualizar beneficiario", error)
    res.status(500).send("Error del servidor")
  }
}

// Eliminar beneficiario
export const deleteBeneficiario = async (req, res) => {
  try {
    const id = req.params.id

    const [check] = await pool.query("SELECT * FROM beneficiarios WHERE idbeneficiario = ?", [id])

    if (check.length === 0) {
      return res.status(404).json({ message: 'El ID no existe' })
    }

    const [results] = await pool.query("DELETE FROM beneficiarios WHERE idbeneficiario = ?", [id])

    res.send({ message: 'Eliminado correctamente' })
  } catch (error) {
    console.error("Error al eliminar beneficiario", error)
    res.status(500).send("Error del servidor")
  }
}
