const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mysql = require("mysql2/promise");

// Variables de entorno desde Railway
const DBHOST = process.env.MYSQLHOST || "localhost";
const DBPORT = process.env.MYSQLPORT || 3306;
const DBDATABASE = process.env.MYSQLDATABASE || "bdL22100217";
const DBUSER = process.env.MYSQLUSER || "root";
const DBPASSWORD = process.env.MYSQLROOTPASSWORD || "";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(cors());

// Conexión a la base de datos
let connection;
(async () => {
  try {
    connection = await mysql.createConnection({
      host: DBHOST,
      port: DBPORT,
      user: DBUSER,
      password: DBPASSWORD,
      database: DBDATABASE,
    });
    console.log("✅ Conectado a la base de datos MySQL");
  } catch (err) {
    console.error("❌ Error al conectar con la base de datos:", err);
  }
})();

// Obtener todos los jugadores
app.get("/jugadores", async (req, res) => {
  try {
    const [results] = await connection.query("SELECT * FROM JugadoresBeisbol");
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener jugadores");
  }
});

// Agregar un jugador con ID manual
app.post("/jugadores", async (req, res) => {
  const { id, nombre, apellido, posicion, numero_camiseta } = req.body;
  try {
    const sql =
      "INSERT INTO JugadoresBeisbol (id, nombre, apellido, posicion, numero_camiseta) VALUES (?, ?, ?, ?, ?)";
    await connection.query(sql, [
      id,
      nombre,
      apellido,
      posicion,
      numero_camiseta,
    ]);
    res.send("Jugador agregado correctamente con ID manual");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al agregar jugador");
  }
});

// Eliminar un jugador por ID
app.delete("/jugadores/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await connection.query("DELETE FROM JugadoresBeisbol WHERE id = ?", [id]);
    res.send("Jugador eliminado");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al eliminar jugador");
  }
});

// Actualizar posición de un jugador por ID
app.patch("/jugadores/:id", async (req, res) => {
  const { id } = req.params;
  const { posicion } = req.body;
  try {
    await connection.query(
      "UPDATE JugadoresBeisbol SET posicion = ? WHERE id = ?",
      [posicion, id]
    );
    res.send("Posición actualizada");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al actualizar jugador");
  }
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).send("Ruta no encontrada");
});

// Iniciar servidor (usa variable de entorno o puerto 3000 por defecto)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express corriendo en puerto ${PORT}`);
});



// const express = require("express");
// const morgan = require("morgan");
// const cors = require("cors");
// const mysql = require("mysql2/promise");

// //-----------------------------
// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan('combined'));
// app.use(cors());

// // Conexión a la base de datos
// let connection;
// (async () => {
//     connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         database: 'bdL22100217'
//     });
//     console.log("Conectado a la base de datos MySQL");
// })();

// // Obtener todos los jugadores
// app.get("/jugadores", async (req, res) => {
//     try {
//         const [results] = await connection.query("SELECT * FROM JugadoresBeisbol");
//         res.json(results);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error al obtener jugadores");
//     }
// });

// // Agregar un jugador con ID manual
// app.post("/jugadores", async (req, res) => {
//     const { id, nombre, apellido, posicion, numero_camiseta } = req.body;
//     try {
//         const sql = "INSERT INTO JugadoresBeisbol (id, nombre, apellido, posicion, numero_camiseta) VALUES (?, ?, ?, ?, ?)";
//         const [result] = await connection.query(sql, [id, nombre, apellido, posicion, numero_camiseta]);
//         res.send("Jugador agregado correctamente con ID manual");
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error al agregar jugador");
//     }
// });

// // Eliminar un jugador por ID
// app.delete("/jugadores/:id", async (req, res) => {
//     const { id } = req.params;
//     try {
//         await connection.query("DELETE FROM JugadoresBeisbol WHERE id = ?", [id]);
//         res.send("Jugador eliminado");
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error al eliminar jugador");
//     }
// });

// // Actualizar posición de un jugador por ID (ejemplo con PATCH)
// app.patch("/jugadores/:id", async (req, res) => {
//     const { id } = req.params;
//     const { posicion } = req.body;
//     try {
//         await connection.query("UPDATE JugadoresBeisbol SET posicion = ? WHERE id = ?", [posicion, id]);
//         res.send("Posición actualizada");
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error al actualizar jugador");
//     }
// });

// // Middleware final para rutas no encontradas
// app.use((req, res, next) => {
//     res.status(404).send("Ruta no encontrada");
// });

// // Iniciar el servidor
// app.listen(3000, () => {
//     console.log("Servidor Express corriendo en puerto 3000");
// });









 


