const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mysql = require("mysql2");
console.log('MYSQLUSER', process.env.MYSQLUSER);

// const DBHOST = process.env.MYSQLHOST || "localhost";
// const DBPORT = process.env.MYSQLPORT || 3306;
// const DBDATABASE = process.env.MYSQLDATABASE || "bdL22100217";
// const DBUSER = process.env.MYSQLUSER || "root";
// const DBPASSWORD = process.env.MYSQLROOTPASSWORD || "";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(cors());

const DBHOST = process.env.DBHOST;
const DBPORT = process.env.DBPORT || 3306;
const DBDATABASE = process.env.DBDATABASE;
const DBUSER = process.env.DBUSER;
const DBPASSWORD = process.env.DBPASSWORD;

// Conexión a la base de datos

(async () => {
  try {
    connection = await mysql.createConnection({
    host: process.env.host || "localHost",
    port: process.env.port || "3306",
    user: process.env.user,
    password: process.env.host,
    database: process.env.database,
    });
    console.log("✅ Conectado a la base de datos MySQL");
  } catch (err) {
    console.error("❌ Error al conectar con la base de datos:", err);
  }
})();

// Obtener todos los jugadores
app.get("/jugadores", async (req, res) => {
  try {
    connection.query("SELECT * FROM JugadoresBeisbol");
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener jugadores");
  }
});

// Agregar un jugador
app.post("/jugadores", async (req, res) => {
  const { id, nombre, apellido, posicion, numero_camiseta } = req.body;
  try {
    const sql =
      "INSERT INTO JugadoresBeisbol (id, nombre, apellido, posicion, numero_camiseta) VALUES (?, ?, ?, ?, ?)";
    const [result] = await connection.query(sql, [
      id,
      nombre,
      apellido,
      posicion,
      numero_camiseta,
    ]);
    res.json({ message: "Jugador agregado exitosamente", insertId: result.insertId });
  } catch (err) {
    console.error("Error al insertar:", err);
    res.status(500).json({ error: "Error al insertar jugador" });
  }
});

// Eliminar un jugador por ID (usando params)
app.delete("/jugadores/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await connection.query("DELETE FROM JugadoresBeisbol WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No se encontró ningún jugador con ese id" });
    }

    res.json({ message: "Jugador eliminado exitosamente", affectedRows: result.affectedRows });
  } catch (err) {
    console.error("Error al eliminar:", err);
    res.status(500).json({ error: "Error al eliminar jugador" });
  }
});

// Actualizar datos de un jugador
app.patch("/jugadores", async (req, res) => {
  const { id } = req.query;
  const { nombre, apellido, posicion, numero_camiseta } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Se requiere el parámetro id" });
  }

  const campos = [];
  const valores = [];

  if (nombre !== undefined) campos.push("nombre = ?"), valores.push(nombre);
  if (apellido !== undefined) campos.push("apellido = ?"), valores.push(apellido);
  if (posicion !== undefined) campos.push("posicion = ?"), valores.push(posicion);
  if (numero_camiseta !== undefined) campos.push("numero_camiseta = ?"), valores.push(numero_camiseta);

  if (campos.length === 0) {
    return res.status(400).json({ error: "No se enviaron campos para actualizar" });
  }

  const query = `UPDATE JugadoresBeisbol SET ${campos.join(", ")} WHERE id = ?`;
  valores.push(id);

  try {
    const [result] = await connection.query(query, valores);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No se encontró ningún jugador con ese id" });
    }

    res.json({ message: "Jugador actualizado exitosamente" });
  } catch (err) {
    console.error("Error al actualizar:", err);
    res.status(500).json({ error: "Error al actualizar jugador" });
  }
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).send("Ruta no encontrada");
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express corriendo en puerto ${PORT}`);
});

// const express = require("express");
// const morgan = require("morgan");
// const cors = require("cors");
// const mysql = require("mysql2/promise");

// // Variables de entorno desde Railway
// const DBHOST = process.env.MYSQLHOST || "localhost";
// const DBPORT = process.env.MYSQLPORT || 3306;
// const DBDATABASE = process.env.MYSQLDATABASE || "bdL22100217";
// const DBUSER = process.env.MYSQLUSER || "root";
// const DBPASSWORD = process.env.MYSQLROOTPASSWORD || "";

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan("combined"));
// app.use(cors());

// // Conexión a la base de datos
// let connection;
// (async () => {
//   try {
//     connection = await mysql.createConnection({
//       host: DBHOST,
//       port: DBPORT,
//       user: DBUSER,
//       password: DBPASSWORD,
//       database: DBDATABASE,
//     });
//     console.log("✅ Conectado a la base de datos MySQL");
//   } catch (err) {
//     console.error("❌ Error al conectar con la base de datos:", err);
//   }
// })();

// // Obtener todos los jugadores
// app.get("/jugadores", async (req, res) => {
//   try {
//     const [results] = await connection.query("SELECT * FROM JugadoresBeisbol");
//     res.json(results);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error al obtener jugadores");
//   }
// });

// // Agregar un jugador
// app.post("/jugadores", async (req, res) => {
//   const { id, nombre, apellido, posicion, numero_camiseta } = req.body;
//   try {
//     const sql =
//       "INSERT INTO JugadoresBeisbol (id, nombre, apellido, posicion, numero_camiseta) VALUES (?, ?, ?, ?, ?)";
//     const [result] = await connection.query(sql, [
//       id,
//       nombre,
//       apellido,
//       posicion,
//       numero_camiseta,
//     ]);
//     res.json({ message: "Jugador agregado exitosamente", insertId: result.insertId });
//   } catch (err) {
//     console.error("Error al insertar:", err);
//     res.status(500).json({ error: "Error al insertar jugador" });
//   }
// });

// // Eliminar un jugador por ID (usando query param)
// app.delete("/jugadores", async (req, res) => {
//   const { id } = req.query;

//   if (!id) {
//     return res.status(400).json({ error: "Se requiere el parámetro id" });
//   }

//   try {
//     const [result] = await connection.query("DELETE FROM JugadoresBeisbol WHERE id = ?", [id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "No se encontró ningún jugador con ese id" });
//     }

//     res.json({ message: "Jugador eliminado exitosamente", affectedRows: result.affectedRows });
//   } catch (err) {
//     console.error("Error al eliminar:", err);
//     res.status(500).json({ error: "Error al eliminar jugador" });
//   }
// });

// // Actualizar datos de un jugador
// app.patch("/jugadores", async (req, res) => {
//   const { id } = req.query;
//   const { nombre, apellido, posicion, numero_camiseta } = req.body;

//   if (!id) {
//     return res.status(400).json({ error: "Se requiere el parámetro id" });
//   }

//   const campos = [];
//   const valores = [];

//   if (nombre !== undefined) campos.push("nombre = ?"), valores.push(nombre);
//   if (apellido !== undefined) campos.push("apellido = ?"), valores.push(apellido);
//   if (posicion !== undefined) campos.push("posicion = ?"), valores.push(posicion);
//   if (numero_camiseta !== undefined) campos.push("numero_camiseta = ?"), valores.push(numero_camiseta);

//   if (campos.length === 0) {
//     return res.status(400).json({ error: "No se enviaron campos para actualizar" });
//   }

//   const query = `UPDATE JugadoresBeisbol SET ${campos.join(", ")} WHERE id = ?`;
//   valores.push(id);

//   try {
//     const [result] = await connection.query(query, valores);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "No se encontró ningún jugador con ese id" });
//     }

//     res.json({ message: "Jugador actualizado exitosamente" });
//   } catch (err) {
//     console.error("Error al actualizar:", err);
//     res.status(500).json({ error: "Error al actualizar jugador" });
//   }
// });

// // Ruta no encontrada
// app.use((req, res) => {
//   res.status(404).send("Ruta no encontrada");
// });

// // Iniciar servidor
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`🚀 Servidor Express corriendo en puerto ${PORT}`);
// });

// const express = require("express");
// const morgan = require("morgan");
// const cors = require("cors");
// const mysql = require("mysql2/promise");

// // Variables de entorno desde Railway
// const DBHOST = process.env.MYSQLHOST || "localhost";
// const DBPORT = process.env.MYSQLPORT || 3306;
// const DBDATABASE = process.env.MYSQLDATABASE || "bdL22100217";
// const DBUSER = process.env.MYSQLUSER || "root";
// const DBPASSWORD = process.env.MYSQLROOTPASSWORD || "";

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan("combined"));
// app.use(cors);


// // Conexión a la base de datos
// let connection;
// (async () => {
//   try {
//     connection = await mysql.createConnection({
//       host: DBHOST,
//       port: DBPORT,
//       user: DBUSER,
//       password: DBPASSWORD,
//       database: DBDATABASE,
//     });
//     console.log("✅ Conectado a la base de datos MySQL");
//   } catch (err) {
//     console.error("❌ Error al conectar con la base de datos:", err);
//   }
// })();

// // Obtener todos los jugadores
// app.get("/jugadores", async (req, res) => {
//   try {
//     const [results] = await connection.query("SELECT * FROM JugadoresBeisbol");
//     res.json(results);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error al obtener jugadores");
//   }
// });

// // Agregar un jugador con ID manual
// app.post("/jugadores", async (req, res) => {
//   const { id, nombre, apellido, posicion, numero_camiseta } = req.body;
//   try {
//     const sql =
//       "INSERT INTO JugadoresBeisbol (id, nombre, apellido, posicion, numero_camiseta) VALUES (?, ?, ?, ?, ?)";
//     await connection.query(sql, [
//       id,
//       nombre,
//       apellido,
//       posicion,
//       numero_camiseta,
//     ]);
//     res.send("Jugador agregado correctamente con ID manual");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error al agregar jugador");
//   }
// });

// // Eliminar un jugador por ID
// app.delete("/jugadores/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     await connection.query("DELETE FROM JugadoresBeisbol WHERE id = ?", [id]);
//     res.send("Jugador eliminado");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error al eliminar jugador");
//   }
// });

// // Actualizar posición de un jugador por ID
// app.patch("/jugadores/:id", async (req, res) => {
//   const { id } = req.params;
//   const { posicion } = req.body;
//   try {
//     await connection.query(
//       "UPDATE JugadoresBeisbol SET posicion = ? WHERE id = ?",
//       [posicion, id]
//     );
//     res.send("Posición actualizada");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error al actualizar jugador");
//   }
// });

// // Ruta no encontrada
// app.use((req, res) => {
//   res.status(404).send("Ruta no encontrada");
// });

// // Iniciar servidor (usa variable de entorno o puerto 3000 por defecto)
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Servidor Express corriendo en puerto ${PORT}`);
// });













 


