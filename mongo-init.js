// mongo-init.js
db = db.getSiblingDB('myappdb'); 
db.createCollection('reservations');

db.reservations.createIndex({ email: 1 }, { unique: true });

db.createUser({
  user: "monuser",
  pwd: "monpassword",
  roles: [{ role: "readWrite", db: "myappdb" }]
});
