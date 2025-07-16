db = db.getSiblingDB('myappdb'); 
db.createCollection('reservations');

db.reservations.createIndex({ email: 1 }, { unique: true });

