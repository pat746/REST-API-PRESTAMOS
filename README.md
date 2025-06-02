# Proyecto Gestión de Beneficiarios, Contratos y Pagos

Este proyecto es una **API RESTful** desarrollada con **Node.js** que gestiona beneficiarios, contratos y pagos asociados a esos contratos. Utiliza una base de datos **MySQL** con un pool de conexiones para manejo eficiente.

---

## Tabla de Contenidos

- [Descripción](#descripción)  
- [Tecnologías](#tecnologías)  
- [Estructura de la API](#estructura-de-la-api)  

---

## Descripción

Esta API permite:

- Gestionar beneficiarios con sus datos personales.  
- Registrar y controlar contratos asociados a beneficiarios, asegurando que no existan contratos activos duplicados.  
- Registrar y consultar pagos asociados a cada contrato, incluyendo control de pagos pendientes y registro de penalidades.  

---

## Tecnologías

- Node.js  
- MySQL  
- mysql2 (con pool para conexión a base de datos)  
- JavaScript (ES6+)  

---

## Estructura de la API

### Beneficiarios

- Obtener todos los beneficiarios  
- Obtener beneficiario por ID  
- Crear nuevo beneficiario (validación de campos obligatorios y control de duplicados por DNI)  
- Actualizar beneficiario  
- Eliminar beneficiario  

### Contratos

- Obtener todos los contratos  
- Obtener contrato por ID  
- Obtener contratos por DNI de beneficiario  
- Crear contrato (control para evitar contratos activos duplicados y generación automática de cronograma de pagos)  
- Actualizar contrato  
- Eliminar contrato  

### Pagos

- Obtener todos los pagos  
- Obtener pago por ID  
- Obtener pagos por contrato  
- Obtener pagos pendientes por contrato  
- Registrar pago (actualiza cuota con fecha, monto, penalidad y medio)  
- Eliminar pago  

---
## Uso

1. Clona este repositorio:

```bash
git clone https://github.com/pat746/REST-API-PRESTAMOS.git
cd REST-API-PRESTAMOS