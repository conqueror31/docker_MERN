import express from "express";
import {send_reservation,get_all_reservations } from "../controller/reservation.js";

const router = express.Router();

router.post("/send", send_reservation);
router.get("/send", get_all_reservations);

export default router;
