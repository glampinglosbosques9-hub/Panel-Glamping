export const reservation = {
  getReservations: `
    SELECT
      *
    FROM vista_reservas
    ORDER BY id DESC
  `,
  getReservationByInvoice: `
    SELECT
      *
    FROM vista_reservas
    WHERE factura_id = $1
    ORDER BY fecha DESC
  `,
  getReservationById: `
    SELECT
      *
    FROM vista_reservas
    WHERE id = $1
  `,
  createReservation: `
    -- Por resolver
    -- Insertar una factura por cada reserva
    -- Nota: agregar una obtencion de datos en el controller si el cliente 
    -- ingresa correctamente la cc y el correo, de este modo no tendría que ingresar de nuevo sus datos
  `,
  updateReservation: `
    UPDATE reservas 
    SET 
      llegada = COALESCE($1::date, llegada),
      salida = COALESCE($2::date, salida)
    WHERE reserva_id = $3
    RETURNING *;
  `,
  updateReservationStatus: `
    UPDATE reservas
    SET estado = $1
    WHERE reserva_id = $2
    RETURNING reserva_id, estado
  `,
  deleteReservation: `
    UPDATE reservas
    SET estado = 'Cancelado'
    WHERE reserva_id = $1
    RETURNING reserva_id
  `,
  activateReservation: `
    UPDATE reservas
    SET estado = 'Confirmado'
    WHERE reserva_id = $1
    RETURNING reserva_id
  `,
  cancelReservation: `
    UPDATE reservas
    SET estado = 'Cancelado'
    WHERE reserva_id = $1
    RETURNING reserva_id
  `,
  checkAvailability: `
    SELECT 1 FROM reservas r
    JOIN paquetes p ON r.paquete_id = p.paquete_id
    WHERE p.cabana_id = (
      SELECT cabana_id FROM paquetes p2 
      JOIN reservas r2 ON r2.paquete_id = p2.paquete_id 
      WHERE r2.reserva_id = $1
    )
    AND r.estado NOT IN ('Cancelado')
    AND r.reserva_id != $1
    AND r.llegada < $3::date AND r.salida > $2::date
    LIMIT 1
  `,
  lockReservation: `
    INSERT INTO reservas (paquete_id, cliente_id, llegada, salida, estado, por_pagar)
    SELECT paquete_id, cliente_id, $2::date, $3::date, 'Temporal', 0
    FROM reservas WHERE reserva_id = $1
    RETURNING reserva_id;
  `,
  deleteLock: `
    DELETE FROM reservas WHERE reserva_id = $1 AND estado = 'Temporal'
  `
}

export const reservationFilters = {
  incomingReservations: `
    SELECT
      *
    FROM vista_reservas
    WHERE llegada = CURRENT_DATE
      AND estado <> 'Cancelado'
    ORDER BY fecha DESC
  `,
  paidReservations: `
    SELECT
      *
    FROM vista_reservas
    WHERE estado = 'Pagado'
    ORDER BY fecha DESC
  `,
  confirmedReservations: `
    SELECT
      *
    FROM vista_reservas
    WHERE estado = 'Confirmado'
    ORDER BY fecha DESC
  `,
  canceledReservations: `
    SELECT
      *
    FROM vista_reservas
    WHERE estado = 'Cancelado'
    ORDER BY fecha DESC
  `,
}

export const updateReservationByPayment = {
  updateTotal: `
    UPDATE reservas r
    SET por_pagar = f.total - sub.pagado
    FROM facturas f,
     (SELECT COALESCE(SUM(total_pagado), 0) AS pagado
      FROM pagos
      WHERE factura_id = $1
        AND estado != 'Cancelado') AS sub
    WHERE r.reserva_id = f.reserva_id
      AND r.reserva_id = $2;
  `,
  updateStatus: `
    UPDATE reservas
    SET estado = 'Pagado'
    WHERE por_pagar <= 0
      AND llegada > CURRENT_DATE
      AND estado <> 'Pagado'
      AND estado <> 'Cancelado'
`,
}

export const reservationStats = {
  getRevenueGraph: `
    SELECT 
      TO_CHAR(pg.fecha_pago, 'YYYY-MM') AS fecha,
      SUM(pg.total_pagado) AS total
    FROM pagos pg
    JOIN facturas f ON pg.factura_id = f.factura_id
    JOIN reservas r ON f.reserva_id = r.reserva_id
    WHERE r.estado <> 'Cancelada'
      AND pg.estado IN ('Completado', 'Agregado Manual')
      AND pg.fecha_pago >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months'
    GROUP BY TO_CHAR(pg.fecha_pago, 'YYYY-MM')
    ORDER BY fecha ASC;
  `
}

export const reservationDashboardStats = {
  totalReservations: `
    SELECT 
      COUNT(*) AS total_reservations
    FROM reservas
    WHERE estado IN ('Completado', 'Pagado')
      AND fecha_registro >= DATE_TRUNC('month', CURRENT_DATE)
  `,
  mostPopularPackage: `
    SELECT 
      tp.nombre,
      COUNT(*) AS total
    FROM reservas r
    JOIN paquetes p ON r.paquete_id = p.paquete_id
    JOIN tipo_paquete tp ON p.tipo_id = tp.tipo_id
    WHERE r.fecha_registro >= DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY tp.nombre
    ORDER BY total DESC
    LIMIT 1
  `,
  mostPopularDay: `
    SELECT 
      (ARRAY['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'])[EXTRACT(DOW FROM r.llegada) + 1] AS dia_semana,
      COUNT(*) AS total
    FROM reservas r
    WHERE r.estado IN ('Completado', 'Pagado')
      AND r.llegada >= DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY 1
    ORDER BY total DESC
    LIMIT 1;
  `,
  getRevenueByMonth: `
    SELECT 
      saldo_neto_mes AS "Ingresos"
    FROM vista_pagos_stats
  `
}