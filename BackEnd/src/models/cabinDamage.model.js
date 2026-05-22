export const cabinDamage = {
  getCabinsDamage: `
    SELECT
      *
    FROM vista_danos_mantenimientos
    ORDER BY 
      CASE 
        WHEN estado = 'pendiente' AND arreglo > CURRENT_DATE THEN 0 
        ELSE 1 
      END ASC,
      arreglo ASC
  `,
  getCabinDamageByName: `
    SELECT
      *
    FROM vista_danos_mantenimientos
    WHERE cabana ILIKE '%' || $1 || '%'
  `,
  createCabinDamage: `
    INSERT INTO Danos_Mantenimientos (cabana_id, descripcion, estado, fecha_registro, fecha_arreglo, responsable)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING cabana_id AS cabin_name, fecha_arreglo
  `,
  updateCabinByDamage: `
    UPDATE cabanas SET
      estado = COALESCE(NULLIF($1, ''), estado),
      fecha_mantenimiento = COALESCE(NULLIF($2, '')::date, fecha_mantenimiento)
    WHERE cabana_id = $3
    RETURNING nombre, estado;
  `,
  updateCabinDamage: `
    UPDATE Danos_Mantenimientos SET
      descripcion = COALESCE(NULLIF($1, ''), descripcion),
      estado = COALESCE(NULLIF($2, ''), estado),
      fecha_registro = CURRENT_DATE,
      fecha_arreglo = COALESCE(NULLIF($3, '')::date, fecha_arreglo),
      responsable = COALESCE(NULLIF($4, ''), responsable)
    WHERE cabana_id = $5
    RETURNING (SELECT nombre FROM Cabanas WHERE cabana_id = $5) AS cabin_name, fecha_arreglo;
  `
}