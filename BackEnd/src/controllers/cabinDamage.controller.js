import pool from "../config/db.js";
import { cabinDamage } from '../models/cabinDamage.model.js';
import { notification } from "../models/notification.model.js";

export const getCabinsDamage = async (req, res) => {
    try {
        const result = await pool.query(cabinDamage.getCabinsDamage);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

export const getCabinDamageByName = async (req, res) => {
    try {
        const { name } = req.body;

        const result = await pool.query(
            cabinDamage.getCabinDamageByName,
            [name.trim()]
        )

        res.json(result.rows)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

export const createCabinDamage = async (req, res) => {
    try {
        const {
            cabanaid,
            descripcion,
            estado,
            fechaRegistro,
            fechaarreglo,
            responsable,

            userName
        } = req.body;

        await pool.query("BEGIN");

        const result = await pool.query(cabinDamage.createCabinDamage, [
            cabanaid,
            descripcion,
            estado,
            fechaRegistro,
            fechaarreglo,
            responsable
        ]);

        const fecha_mantenimiento = fechaarreglo;
        
        await pool.query(cabinDamage.updateCabinByDamage, [
            "Mantenimiento",
            fecha_mantenimiento,
            cabanaid
        ]);

        await pool.query(notification.createNotification, [
            userName,
            "Daño cabaña",
            `El daño a la cabaña #${cabanaid} ha sido creado`
        ]);

        await pool.query("COMMIT");

        res.status(201).json(result.rows[0]);
    } catch (error) {
        await pool.query("ROLLBACK");
        res.status(500).json({message: error.message});
    }
};

export const updateCabinDamage = async (req, res) => {
    try {
        const {
            descripcion,
            estado,
            fechaarreglo,
            responsable,
            cabanaid,

            userName
        } = req.body;

        await pool.query("BEGIN");

        const result = await pool.query(cabinDamage.updateCabinDamage, [
            descripcion,
            estado,
            fechaarreglo,
            responsable,
            cabanaid
        ]);

        if (estado === "Terminado") {
            const fecha_mantenimiento = fechaarreglo;
            
            await pool.query(cabinDamage.updateCabinByDamage, [
                "Disponible",
                fecha_mantenimiento,
                cabanaid
            ]);
        }

        if (result.rowCount === 0) {
            await pool.query("ROLLBACK");
            return res.status(404).json({ message: "El registro de daño no existe." });
        }

        await pool.query(notification.createNotification, [
            userName,
            "Daño cabaña",
            `El daño a la cabaña ${cabanaid} ha sido actualizado`
        ]);

        await pool.query("COMMIT");

        res.json(result.rows[0]);
    } catch (error) {
        await pool.query("ROLLBACK");
        res.status(500).json({message: error.message})
    }
};