import { pool } from '../db.js'

// Obtener todos los contratos
export const getContratos = async (req, res) => {
  try {
    const querySQL = "SELECT * FROM contratos"
    const [results] = await pool.query(querySQL)
    res.send(results)
  } catch (error) {
    console.error("Error al obtener contratos", error)
    res.status(500).send("Error del servidor")
  }
}

// Obtener un contrato por ID
export const getContratoById = async (req, res) => {
  try {
    const querySQL = "SELECT * FROM contratos WHERE idcontrato = ?"
    const [results] = await pool.query(querySQL, [req.params.id])

    if (results.length === 0) {
      return res.status(404).json({ message: 'No existe el ID' })
    }

    res.send(results[0])
  } catch (error) {
    console.error("Error al obtener contrato", error)
    res.status(500).send("Error del servidor")
  }
}

// Obtener contratos por DNI de beneficiario
export const getContratosByDni = async (req, res) => {
  try {
    const dni = req.params.dni
    const querySQL = `
      SELECT c.*
      FROM contratos c
      INNER JOIN beneficiarios b ON c.idbeneficiario = b.idbeneficiario
      WHERE b.dni = ?
    `
    const [results] = await pool.query(querySQL, [dni])

    if (results.length === 0) {
      return res.status(404).json({ message: 'No hay contratos para ese DNI' })
    }

    res.send(results)
  } catch (error) {
    console.error("Error al obtener contratos por DNI", error)
    res.status(500).send("Error del servidor")
  }
}

// Crear nuevo contrato (evitar duplicados activos por beneficiario)
export const createContrato = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const {
      idbeneficiario,
      monto,
      interes,
      fechainicio,
      diapago,
      numcuotas,
      estado
    } = req.body;

    if (!idbeneficiario || !monto || !interes || !fechainicio || !diapago || !numcuotas) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Verificar contrato activo
    const [contratosActivos] = await connection.query(
      `SELECT * FROM contratos WHERE idbeneficiario = ? AND estado = 'ACT'`,
      [idbeneficiario]
    );

    if (contratosActivos.length > 0) {
      return res.status(409).json({ message: "Este beneficiario ya tiene un contrato activo" });
    }

    // Insertar contrato
    const [result] = await connection.query(
      `INSERT INTO contratos (idbeneficiario, monto, interes, fechainicio, diapago, numcuotas, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        idbeneficiario,
        monto,
        interes,
        fechainicio,
        diapago,
        numcuotas,
        estado?.trim().toUpperCase() || 'ACT'
      ]
    );

    const idContrato = result.insertId;

    // Calcular cuota mensual con interés (interés simple)
   const interesMensual = interes / 100;
   const factor = Math.pow(1 + interesMensual, numcuotas);
   const cuota = parseFloat((monto * (interesMensual * factor) / (factor - 1)).toFixed(2));


    // Insertar cronograma de pagos
    const pagos = [];
    const fechaInicio = new Date(fechainicio);

    for (let i = 1; i <= numcuotas; i++) {
      const fechaPago = new Date(fechaInicio);
      fechaPago.setMonth(fechaInicio.getMonth() + i); // 1ra cuota el mes siguiente

      pagos.push([idContrato, i, null, cuota, 0, null]);
    }

    await connection.query(
      `INSERT INTO pagos (idcontrato, numcuota, fechapago, monto, penalidad, medio)
       VALUES ?`,
      [pagos]
    );

    res.send({
      status: true,
      message: "Contrato y cronograma de pagos creado correctamente",
      idContrato,
      cuota
    });

  } catch (error) {
    console.error("Error al crear contrato y cronograma", error);
    res.status(500).send("Error del servidor");
  } finally {
    connection.release();
  }
};


// Actualizar contrato
export const updateContrato = async (req, res) => {
  try {
    const id = req.params.id
    const { idbeneficiario, monto, interes, fechainicio, diapago, numcuotas, estado } = req.body

    const [check] = await pool.query("SELECT * FROM contratos WHERE idcontrato = ?", [id])
    if (check.length === 0) {
      return res.status(404).json({ message: 'El ID no existe' })
    }

    const querySQL = `
      UPDATE contratos SET
        idbeneficiario = ?,
        monto = ?,
        interes = ?,
        fechainicio = ?,
        diapago = ?,
        numcuotas = ?,
        estado = ?,
        modificado = NOW()
      WHERE idcontrato = ?
    `

    await pool.query(querySQL, [idbeneficiario, monto, interes, fechainicio, diapago, numcuotas, estado, id])

    res.send({ message: "Contrato actualizado correctamente" })
  } catch (error) {
    console.error("Error al actualizar contrato", error)
    res.status(500).send("Error del servidor")
  }
}

// Eliminar contrato
export const deleteContrato = async (req, res) => {
  try {
    const id = req.params.id

    const [check] = await pool.query("SELECT * FROM contratos WHERE idcontrato = ?", [id])

    if (check.length === 0) {
      return res.status(404).json({ message: 'El ID no existe' })
    }

    await pool.query("DELETE FROM contratos WHERE idcontrato = ?", [id])

    res.send({ message: 'Contrato eliminado correctamente' })
  } catch (error) {
    console.error("Error al eliminar contrato", error)
    res.status(500).send("Error del servidor")
  }
}
