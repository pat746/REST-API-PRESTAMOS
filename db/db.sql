CREATE DATABASE prestamos;
USE prestamos;

CREATE TABLE beneficiarios
(
	idbeneficiario		INT AUTO_INCREMENT PRIMARY KEY,
    apellidos			VARCHAR(50)		NOT NULL,
    nombres				VARCHAR(50)		NOT NULL,
    dni					CHAR(8)			NOT NULL,
    telefono			CHAR(9)			NOT NULL,
    direccion			VARCHAR(90)		null,
    creado				DATETIME		NOT NULL DEFAULT NOW(),
    modificado			DATETIME		NULL,
    CONSTRAINT uk_dni_ben	UNIQUE (dni)
)ENGINE = INNODB;

CREATE TABLE contratos
(
	idcontrato			INT AUTO_INCREMENT PRIMARY KEY,
    idbeneficiario		INT 				NOT NULL,
    monto				DECIMAL(7,2)		NOT NULL,
    interes				DECIMAL(5,2)		NOT NULL,
    fechainicio			DATE				NOT NULL,
    diapago				TINYINT				NOT NULL,
    numcuotas			TINYINT				NOT NULL COMMENT 'Expresado en meses',
    estado				ENUM('ACT', 'FIN') 	NOT NULL DEFAULT 'ACT' COMMENT 'ACT = Activo, FIN = Finalizo',
	creado			    DATETIME			NOT NULL DEFAULT NOW(),
    modificado			DATETIME			NULL,
    CONSTRAINT fk_idbeneficiario_con FOREIGN KEY (idbeneficiario) REFERENCES beneficiarios (idbeneficiario)
)ENGINE = INNODB;

CREATE TABLE pagos
(
		idpago 			INT AUTO_INCREMENT PRIMARY KEY,
        idcontrato		INT 					NULL,
        numcuota		TINYINT					NOT NULL COMMENT 'Sedebe cancelar la cuota en su totalidad sin AMORTIZACIONES',
        fechapago		DATETIME				NULL COMMENT 'Fecha efectiva de pago',
        monto			DECIMAL(7,2)			NOT NULL,
        penalidad		DECIMAL(7,2)			NOT NULL DEFAULT 0 COMMENT '10 % del valor de la cuota',
        medio			ENUM('EFC', 'DEP')		NULL COMMENT 'EFC = Efectivo, DEP = Deposito',
        CONSTRAINT fk_idcontrato_pag FOREIGN KEY (idcontrato) REFERENCES contratos (idcontrato),
        CONSTRAINT uk_numcuota_pag UNIQUE (idcontrato, numcuota)
)ENGINE = INNODB;

INSERT INTO beneficiarios
	(apellidos, nombres, dni, telefono) VALUES
    ('Ortiz Salvador', 'Patricia Soledad', '72806360', '939791194');
    
INSERT INTO contratos
	(idbeneficiario, monto, interes, fechainicio, diapago, numcuotas) VALUES
    (1, 3000, 5, '2025-03-10', 15, 12);
    
INSERT INTO pagos
	(idcontrato, numcuota, fechapago, monto, penalidad, medio) VALUES
    (1, 1, '2025-04-15', 338.48, 0, 'EFC'),
    (1, 2, '2025-05-17', 338.48, 33.85, 'DEP'),
    (1, 3, NULL, 338.48, 0, NULL),
    (1, 4, NULL, 338.48, 0, NULL),
    (1, 5, NULL, 338.48, 0, NULL),
    (1, 6, NULL, 338.48, 0, NULL),
    (1, 7, NULL, 338.48, 0, NULL),
    (1, 8, NULL, 338.48, 0, NULL),
    (1, 9, NULL, 338.48, 0, NULL),
    (1, 10, NULL, 338.48, 0, NULL),
    (1, 11, NULL, 338.48, 0, NULL),
    (1, 12, NULL, 338.48, 0, NULL);
    
-- ¿CUANTOS PAGOS TIENE PENDIENTE ANDREA?
SELECT COUNT(*) FROM pagos WHERE idcontrato = 1 AND fechapago IS NULL;

-- ¿ CUANTO ES EL TOTAL DE LA DEUDA ACTUAL?
SELECT COUNT(*) * monto FROM pagos WHERE idcontrato = 1 AND fechapago IS NULL;

-- ¿cuantos pagos se han realizado?
SELECT COUNT(*) FROM pagos WHERE idcontrato = 1 AND fechapago IS NOT NULL;

-- ¿CUANTOS PAGOS SE REALIZARON EN EFECTIVO?
SELECT COUNT(*) FROM pagos WHERE idcontrato = 1 AND medio = 'EFC';

-- ¿cUANTO ES EL TOTAL DE PENALIDAD PAGADOS CON DEPOSITO?
SELECT SUM(penalidad) FROM pagos WHERE idcontrato = 1 AND MEDIO = 'DEP';