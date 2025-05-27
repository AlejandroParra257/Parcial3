const URL = 'https://pro221002217.onrender.com'
const btnMostrarTabla = document.getElementById('btnMostrarTabla');
    const btnMostrarFormulario = document.getElementById('btnMostrarFormulario');
    const tablaJugadores = document.getElementById('tabla-jugadores');
    const formulario = document.getElementById('formulario');
    const contenedor = document.getElementById("contenedor-jugadores");
    const formAgregar = document.getElementById("formAgregar");

    // Mostrar tabla y ocultar formulario al cargar la página
    function mostrarTabla() {
      tablaJugadores.style.display = 'block';
      formulario.style.display = 'none';
      btnMostrarTabla.classList.add('active');
      btnMostrarFormulario.classList.remove('active');
      cargarJugadores();
    }

    // Mostrar formulario y ocultar tabla
    function mostrarFormulario() {
      tablaJugadores.style.display = 'none';
      formulario.style.display = 'block';
      btnMostrarFormulario.classList.add('active');
      btnMostrarTabla.classList.remove('active');
      formAgregar.reset();
    }

    btnMostrarTabla.addEventListener('click', mostrarTabla);
    btnMostrarFormulario.addEventListener('click', mostrarFormulario);

    // Cargar y mostrar jugadores en la tabla
    function cargarJugadores() {
      fetch("http://localhost:3000/jugadores")
        .then(res => res.json())
        .then(data => {
          contenedor.innerHTML = "";
          data.forEach(j => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
              <td>${j.id}</td>
              <td>${j.nombre}</td>
              <td>${j.apellido}</td>
              <td>${j.posicion}</td>
              <td>${j.numero_camiseta}</td>
              <td><button class="btn-eliminar" onclick="eliminar(${j.id})">Eliminar</button></td>
            `;
            contenedor.appendChild(fila);
          });
        });
    }

    // Función para eliminar jugador
    function eliminar(id) {
      fetch(`http://localhost:3000/jugadores/${id}`, {
        method: "DELETE"
      }).then(() => cargarJugadores());
    }

    // Enviar formulario para agregar jugador
    formAgregar.addEventListener("submit", async e => {
      e.preventDefault();

      const nuevo = {
        id: parseInt(document.getElementById("id").value),
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        posicion: document.getElementById("posicion").value,
        numero_camiseta: parseInt(document.getElementById("numero").value)
      };

      try {
        const response = await fetch("http://localhost:3000/jugadores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevo)
        });

        if (!response.ok) {
          const msg = await response.text();

          if (msg.includes("Duplicate entry") && msg.includes("PRIMARY")) {
            const confirmar = confirm("⚠️ El ID ya existe. ¿Deseas eliminar ese jugador y reemplazarlo?");
            if (confirmar) {
              await fetch(`http://localhost:3000/jugadores/${nuevo.id}`, { method: "DELETE" });
              await fetch("http://localhost:3000/jugadores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevo)
              });
              alert("Jugador reemplazado exitosamente.");
              mostrarTabla();
              return;
            }
            return;
          }

          throw new Error(msg);
        }

        alert("Jugador guardado exitosamente.");
        mostrarTabla();
      } catch (error) {
        console.error("Error al guardar:", error);
        alert("❌ Error al guardar jugador.");
      }
    });

    // Mostrar tabla al cargar la página
    mostrarTabla();