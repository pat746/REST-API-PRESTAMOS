import { pool } from '../db.js'

// Obtener todos los pagos
export const getPagos = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM pagos")
    res.send(results)
  } catch (error) {
    console.error("Error al obtener pagos", error)
    res.status(500).send("Error del servidor")
  }
}

// Obtener un pago por ID
export const getPagoById = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM pagos WHERE idpago = ?", [req.params.id])
    if (results.length === 0) {
      return res.status(404).json({ message: 'Pago no encontrado' })
    }
    res.send(results[0])
  } catch (error) {
    console.error("Error al obtener pago", error)
    res.status(500).send("Error del servidor")
  }
}

// Obtener pagos por contrato
export const getPagosByContrato = async (req, res) => {
  try {
    const { idcontrato } = req.params
    const [results] = await pool.query("SELECT * FROM pagos WHERE idcontrato = ?", [idcontrato])
    res.send(results)
  } catch (error) {
    console.error("Error al obtener pagos por contrato", error)
    res.status(500).send("Error del servidor")
  }
}

// Obtener pagos pendientes por contrato
export const getPagosPendientes = async (req, res) => {
  try {
    const { idcontrato } = req.params
    const [results] = await pool.query("SELECT * FROM pagos WHERE idcontrato = ? AND fechapago IS NULL", [idcontrato])
    res.send(results)
  } catch (error) {
    console.error("Error al obtener pagos pendientes", error)
    res.status(500).send("Error del servidor")
  }
}

// Crear o registrar un pago (actualizar cuota existente)
export const registrarPago = async (req, res) => {
  try {
    const { idcontrato, numcuota, fechapago, monto, penalidad, medio } = req.body

    if (!idcontrato || !numcuota || !fechapago || !monto || !medio) {
      return res.status(400).json({ message: "Faltan campos requeridos" })
    }

    // Verificar si el pago existe
    const [pagoExistente] = await pool.query(
      "SELECT * FROM pagos WHERE idcontrato = ? AND numcuota = ?",
      [idcontrato, numcuota]
    )

    if (pagoExistente.length === 0) {
      return res.status(404).json({ message: "El pago no existe" })
    }

    // Actualizar el pago con datos reales
    await pool.query(`
      UPDATE pagos SET
        fechapago = ?,
        monto = ?,
        penalidad = ?,
        medio = ?
      WHERE idcontrato = ? AND numcuota = ?
    `, [fechapago, monto, penalidad || 0, medio, idcontrato, numcuota])

    res.send({ message: "Pago registrado correctamente" })
  } catch (error) {
    console.error("Error al registrar pago", error)
    res.status(500).send("Error del servidor")
  }
}

// Eliminar un pago
export const deletePago = async (req, res) => {
  try {
    const id = req.params.id
    const [check] = await pool.query("SELECT * FROM pagos WHERE idpago = ?", [id])
    if (check.length === 0) {
      return res.status(404).json({ message: 'El ID de pago no existe' })
    }

    await pool.query("DELETE FROM pagos WHERE idpago = ?", [id])
    res.send({ message: 'Pago eliminado correctamente' })
  } catch (error) {
    console.error("Error al eliminar pago", error)
    res.status(500).send("Error del servidor")
  }
}

// Obtener resumen de pagos por tipo (EFC, DEP)
export const getResumenPorMedio = async (req, res) => {
  try {
    const { idcontrato } = req.params
    const [results] = await pool.query(`
      SELECT medio, COUNT(*) AS cantidad, SUM(penalidad) AS total_penalidad
      FROM pagos
      WHERE idcontrato = ? AND medio IS NOT NULL
      GROUP BY medio
    `, [idcontrato])
    res.send(results)
  } catch (error) {
    console.error("Error al obtener resumen por medio", error)
    res.status(500).send("Error del servidor")
  }
}
