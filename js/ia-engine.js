// 🤖 MOTOR DE INTELIGENCIA ARTIFICIAL PARA RECOMENDACIONES
class IARecomendaciones {
  constructor() {
    this.historialAnalisis = JSON.parse(localStorage.getItem("historialAnalisis") || "[]")
    this.preferenciasUsuario = JSON.parse(localStorage.getItem("preferenciasUsuario") || "{}")
    this.patronesVisualizacion = JSON.parse(localStorage.getItem("patronesVisualizacion") || "{}")
    this.modeloEntrenado = false
  }

  // Analizar patrones de visualización del usuario
  analizarComportamiento(historial) {
    const analisis = {
      categoriasPreferidas: {},
      horariosActivos: {},
      duracionPromedio: 0,
      canalesFavoritos: {},
      patronesTiempo: {},
    }

    historial.forEach((item) => {
      // Analizar categorías preferidas
      const categoria = this.extraerCategoria(item.nombre)
      analisis.categoriasPreferidas[categoria] = (analisis.categoriasPreferidas[categoria] || 0) + 1

      // Analizar horarios de visualización
      const hora = new Date(item.timestamp).getHours()
      const franjaHoraria = this.obtenerFranjaHoraria(hora)
      analisis.horariosActivos[franjaHoraria] = (analisis.horariosActivos[franjaHoraria] || 0) + 1

      // Canales más vistos
      analisis.canalesFavoritos[item.nombre] = (analisis.canalesFavoritos[item.nombre] || 0) + 1
    })

    return analisis
  }

  // Extraer categoría de un canal usando IA básica
  extraerCategoria(nombreCanal) {
    const nombre = nombreCanal.toLowerCase()

    const categorias = {
      deportes: ["sport", "futbol", "football", "basket", "tennis", "golf", "bein", "espn", "fox sports"],
      noticias: ["news", "noticias", "cnn", "bbc", "france24", "aljazeera", "rtve", "antena3"],
      entretenimiento: ["tv", "general", "entretenimiento", "variety", "show", "drama"],
      infantil: ["kids", "cartoon", "disney", "nickelodeon", "baby", "infantil"],
      musica: ["music", "radio", "fm", "hits", "mtv", "vh1", "musica"],
      peliculas: ["movie", "film", "cinema", "cine", "hollywood", "action", "thriller"],
      documentales: ["discovery", "history", "nat geo", "documentary", "science"],
      religioso: ["religion", "church", "islam", "christian", "god"],
    }

    for (const [categoria, palabrasClave] of Object.entries(categorias)) {
      if (palabrasClave.some((palabra) => nombre.includes(palabra))) {
        return categoria
      }
    }

    return "general"
  }

  // Obtener franja horaria
  obtenerFranjaHoraria(hora) {
    if (hora >= 6 && hora < 12) return "mañana"
    if (hora >= 12 && hora < 18) return "tarde"
    if (hora >= 18 && hora < 24) return "noche"
    return "madrugada"
  }

  // Generar recomendaciones inteligentes
  generarRecomendaciones(canalesDisponibles, historial, favoritos) {
    const analisis = this.analizarComportamiento(historial)
    const recomendaciones = []
    const horaActual = new Date().getHours()
    const franjaActual = this.obtenerFranjaHoraria(horaActual)

    // Algoritmo de puntuación inteligente
    canalesDisponibles.forEach((canal) => {
      let puntuacion = 0
      const categoria = this.extraerCategoria(canal.nombre)

      // Puntuación por categoría preferida (40% del peso)
      const preferenciaCat = analisis.categoriasPreferidas[categoria] || 0
      puntuacion += (preferenciaCat / Math.max(1, historial.length)) * 40

      // Puntuación por horario (25% del peso)
      const preferenciaHorario = analisis.horariosActivos[franjaActual] || 0
      puntuacion += (preferenciaHorario / Math.max(1, historial.length)) * 25

      // Puntuación por popularidad del canal (20% del peso)
      const popularidad = analisis.canalesFavoritos[canal.nombre] || 0
      puntuacion += (popularidad / Math.max(1, historial.length)) * 20

      // Bonus por favoritos (15% del peso)
      if (favoritos.includes(canal.url)) {
        puntuacion += 15
      }

      // Bonus por novedad (canales no vistos recientemente)
      const ultimaVez = historial.find((h) => h.url === canal.url)
      if (!ultimaVez || Date.now() - ultimaVez.timestamp > 7 * 24 * 60 * 60 * 1000) {
        puntuacion += 5 // Bonus por novedad
      }

      // Penalización por canales vistos recientemente
      const vistosReciente = historial.slice(0, 5).find((h) => h.url === canal.url)
      if (vistosReciente) {
        puntuacion -= 10
      }

      if (puntuacion > 0) {
        recomendaciones.push({
          canal: canal,
          puntuacion: Math.round(puntuacion * 10) / 10,
          razon: this.generarRazonRecomendacion(categoria, franjaActual, favoritos.includes(canal.url)),
        })
      }
    })

    // Ordenar por puntuación y tomar los mejores
    return recomendaciones.sort((a, b) => b.puntuacion - a.puntuacion).slice(0, 10)
  }

  // Generar razón de recomendación
  generarRazonRecomendacion(categoria, franja, esFavorito) {
    const razones = []

    if (esFavorito) {
      razones.push("⭐ Es uno de tus favoritos")
    }

    razones.push(`📺 Te gusta ${categoria}`)
    razones.push(`⏰ Sueles ver TV en la ${franja}`)

    const razonesExtra = [
      "🔥 Trending ahora",
      "🆕 Contenido nuevo",
      "👥 Popular entre usuarios",
      "🎯 Basado en tu historial",
      "🌟 Altamente recomendado",
      "📊 Match perfecto",
    ]

    razones.push(razonesExtra[Math.floor(Math.random() * razonesExtra.length)])

    return razones.slice(0, 2).join(" • ")
  }

  // Entrenar el modelo con datos actuales
  entrenarModelo(historial, favoritos, canales) {
    console.log("🧠 Entrenando modelo de IA...")

    const analisis = this.analizarComportamiento(historial)

    // Guardar análisis actualizado
    this.historialAnalisis = analisis
    localStorage.setItem("historialAnalisis", JSON.stringify(analisis))

    // Actualizar preferencias
    this.preferenciasUsuario = {
      categoriaFavorita: Object.keys(analisis.categoriasPreferidas).reduce(
        (a, b) => (analisis.categoriasPreferidas[a] > analisis.categoriasPreferidas[b] ? a : b),
        "general",
      ),
      franjaHorariaFavorita: Object.keys(analisis.horariosActivos).reduce(
        (a, b) => (analisis.horariosActivos[a] > analisis.horariosActivos[b] ? a : b),
        "noche",
      ),
      ultimoEntrenamiento: Date.now(),
    }

    localStorage.setItem("preferenciasUsuario", JSON.stringify(this.preferenciasUsuario))

    this.modeloEntrenado = true
    console.log("✅ Modelo entrenado correctamente")

    return {
      categoriasAnalizadas: Object.keys(analisis.categoriasPreferidas).length,
      patronesDetectados: Object.keys(analisis.horariosActivos).length,
      precision: Math.min(95, 60 + historial.length * 2), // Simular precisión creciente
    }
  }

  // Obtener estadísticas del modelo
  obtenerEstadisticas() {
    return {
      modeloEntrenado: this.modeloEntrenado,
      datosAnalizados: this.historialAnalisis,
      preferencias: this.preferenciasUsuario,
      precision: this.calcularPrecision(),
    }
  }

  calcularPrecision() {
    const historialSize = JSON.parse(localStorage.getItem("historial") || "[]").length
    return Math.min(95, 40 + historialSize * 1.5)
  }
}

// 📺 SISTEMA MULTI-VIEW AVANZADO
class MultiViewManager {
  constructor() {
    this.reproductoresActivos = []
    this.hlsInstances = []
    this.configuracionActual = null
    this.Hls = window.Hls // Declare the Hls variable here
  }

  // Crear grid de multi-view
  crearMultiView(numeroCanales, canalesDisponibles) {
    const grid = document.getElementById("multiviewGrid")
    grid.innerHTML = ""
    grid.className = `multiview-grid grid-${numeroCanales}`

    this.limpiarReproductores()

    // Seleccionar canales aleatorios o los más populares
    const canalesSeleccionados = this.seleccionarCanales(canalesDisponibles, numeroCanales)

    canalesSeleccionados.forEach((canal, index) => {
      const item = this.crearItemMultiView(canal, index)
      grid.appendChild(item)
    })

    this.configuracionActual = numeroCanales
    console.log(`🔄 Multi-view ${numeroCanales} canales activado`)
  }

  // Seleccionar canales para multi-view
  seleccionarCanales(canalesDisponibles, cantidad) {
    if (canalesDisponibles.length <= cantidad) {
      return canalesDisponibles
    }

    // Mezclar array y tomar los primeros
    const mezclados = [...canalesDisponibles].sort(() => Math.random() - 0.5)
    return mezclados.slice(0, cantidad)
  }

  // Crear item individual de multi-view
  crearItemMultiView(canal, index) {
    const item = document.createElement("div")
    item.className = "multiview-item"
    item.innerHTML = `
      <div class="multiview-header">
        <span class="multiview-title">${canal.nombre}</span>
        <div class="multiview-controls">
          <button onclick="multiViewManager.maximizar(${index})" title="Maximizar">⛶</button>
          <button onclick="multiViewManager.cambiarCanal(${index})" title="Cambiar">🔄</button>
          <button onclick="multiViewManager.silenciar(${index})" title="Silenciar">🔇</button>
        </div>
      </div>
      <video id="multiVideo${index}" class="multiview-video" muted autoplay></video>
    `

    // Configurar reproductor
    setTimeout(() => {
      this.configurarReproductor(canal, index)
    }, 100)

    return item
  }

  // Configurar reproductor individual
  configurarReproductor(canal, index) {
    const video = document.getElementById(`multiVideo${index}`)
    if (!video) return

    try {
      if (this.Hls && this.Hls.isSupported()) {
        const hls = new this.Hls({
          enableWorker: false,
          lowLatencyMode: true,
          backBufferLength: 30,
          maxBufferLength: 10,
        })

        hls.loadSource(canal.url)
        hls.attachMedia(video)

        hls.on(this.Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch((e) => console.log(`Video ${index} no pudo reproducirse automáticamente`))
        })

        hls.on(this.Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.log(`Error en video ${index}:`, data)
            this.mostrarErrorEnVideo(video, canal.nombre)
          }
        })

        this.hlsInstances[index] = hls
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = canal.url
        video.addEventListener("loadedmetadata", () => {
          video.play().catch((e) => console.log(`Video ${index} no pudo reproducirse automáticamente`))
        })
      }

      this.reproductoresActivos[index] = { video, canal }
    } catch (error) {
      console.error(`Error configurando reproductor ${index}:`, error)
      this.mostrarErrorEnVideo(video, canal.nombre)
    }
  }

  // Mostrar error en video
  mostrarErrorEnVideo(video, nombreCanal) {
    const container = video.parentElement
    const errorDiv = document.createElement("div")
    errorDiv.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--text-secondary);
      text-align: center;
      font-size: 0.8rem;
    `
    errorDiv.innerHTML = `❌<br>Error cargando<br>${nombreCanal}`
    container.style.position = "relative"
    container.appendChild(errorDiv)
  }

  // Maximizar un canal específico
  maximizar(index) {
    const reproductor = this.reproductoresActivos[index]
    if (!reproductor) return

    // Cerrar multi-view y reproducir en principal
    document.getElementById("modalMultiview").style.display = "none"
    window.reproducir(reproductor.canal.url, reproductor.canal.nombre)
    this.limpiarReproductores()
  }

  // Cambiar canal en una posición específica
  cambiarCanal(index) {
    // Implementar lógica para cambiar canal
    console.log(`Cambiar canal en posición ${index}`)
  }

  // Silenciar/activar audio
  silenciar(index) {
    const reproductor = this.reproductoresActivos[index]
    if (reproductor && reproductor.video) {
      reproductor.video.muted = !reproductor.video.muted
      const btn = document.querySelector(`#multiVideo${index}`).parentElement.querySelector('[title="Silenciar"]')
      btn.textContent = reproductor.video.muted ? "🔇" : "🔊"
    }
  }

  // Limpiar todos los reproductores
  limpiarReproductores() {
    this.hlsInstances.forEach((hls) => {
      if (hls) hls.destroy()
    })
    this.hlsInstances = []
    this.reproductoresActivos = []
  }

  // Cerrar multi-view
  cerrar() {
    this.limpiarReproductores()
    document.getElementById("modalMultiview").style.display = "none"
    this.configuracionActual = null
  }
}

// 📅 SISTEMA EPG (ELECTRONIC PROGRAM GUIDE)
class EPGManager {
  constructor() {
    this.programasSimulados = this.generarProgramasSimulados()
    this.vistaDia = "hoy"
  }

  // Generar programas simulados realistas
  generarProgramasSimulados() {
    const tiposPrograma = {
      noticias: [
        "Telediario",
        "Noticias 24h",
        "Informativos",
        "Noticias Internacionales",
        "Deportes Noticias",
        "Economía Hoy",
        "Tiempo y Clima",
      ],
      deportes: [
        "Fútbol en Vivo",
        "Resumen Deportivo",
        "Champions League",
        "Liga Española",
        "Tenis Masters",
        "Baloncesto NBA",
        "Fórmula 1",
        "Golf Profesional",
      ],
      entretenimiento: [
        "Programa de Variedades",
        "Talk Show",
        "Reality Show",
        "Concurso Musical",
        "Programa de Cocina",
        "Documentales",
        "Series de TV",
        "Cine de Tarde",
      ],
      infantil: [
        "Dibujos Animados",
        "Programas Educativos",
        "Cuentos Infantiles",
        "Música para Niños",
        "Aventuras Animadas",
      ],
    }

    const programas = {}
    const categorias = ["noticias", "deportes", "entretenimiento", "infantil"]

    categorias.forEach((categoria) => {
      programas[categoria] = []
      const programasCategoria = tiposPrograma[categoria]

      // Generar programación para 7 días
      for (let dia = 0; dia < 7; dia++) {
        const fecha = new Date()
        fecha.setDate(fecha.getDate() + dia)

        // Generar programas para cada hora del día
        for (let hora = 6; hora < 24; hora++) {
          const programa = programasCategoria[Math.floor(Math.random() * programasCategoria.length)]
          const duracion = [30, 60, 90, 120][Math.floor(Math.random() * 4)]

          programas[categoria].push({
            nombre: programa,
            descripcion: this.generarDescripcion(programa, categoria),
            horaInicio: `${hora.toString().padStart(2, "0")}:${["00", "30"][Math.floor(Math.random() * 2)]}`,
            duracion: duracion,
            fecha: fecha.toISOString().split("T")[0],
            categoria: categoria,
            enVivo: this.esEnVivo(fecha, hora),
            calificacion: (Math.random() * 5 + 3).toFixed(1), // 3.0 - 8.0
          })
        }
      }
    })

    return programas
  }

  // Generar descripción realista
  generarDescripcion(programa, categoria) {
    const descripciones = {
      noticias: [
        "Información actualizada de los acontecimientos más relevantes",
        "Análisis en profundidad de la actualidad nacional e internacional",
        "Las noticias más importantes del día con reportajes especiales",
      ],
      deportes: [
        "Emocionante encuentro deportivo con los mejores equipos",
        "Cobertura completa del evento deportivo más esperado",
        "Análisis y comentarios de expertos deportivos",
      ],
      entretenimiento: [
        "Programa lleno de diversión, música y entretenimiento",
        "Los mejores momentos de entretenimiento familiar",
        "Espectáculo variado con invitados especiales",
      ],
      infantil: [
        "Contenido educativo y divertido para los más pequeños",
        "Aventuras emocionantes llenas de aprendizaje",
        "Diversión garantizada para toda la familia",
      ],
    }

    const descs = descripciones[categoria] || descripciones["entretenimiento"]
    return descs[Math.floor(Math.random() * descs.length)]
  }

  // Determinar si un programa está en vivo
  esEnVivo(fecha, hora) {
    const ahora = new Date()
    const fechaPrograma = new Date(fecha)
    fechaPrograma.setHours(hora)

    const diferencia = Math.abs(ahora - fechaPrograma)
    return diferencia < 60 * 60 * 1000 // Menos de 1 hora de diferencia
  }

  // Obtener programación para una fecha específica
  obtenerProgramacion(fecha = "hoy") {
    const fechaObj = new Date()

    if (fecha === "manana") {
      fechaObj.setDate(fechaObj.getDate() + 1)
    } else if (fecha === "semana") {
      // Devolver programación de toda la semana
      return this.obtenerProgramacionSemana()
    }

    const fechaStr = fechaObj.toISOString().split("T")[0]
    const programacionDia = {}

    Object.keys(this.programasSimulados).forEach((categoria) => {
      programacionDia[categoria] = this.programasSimulados[categoria]
        .filter((programa) => programa.fecha === fechaStr)
        .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
    })

    return programacionDia
  }

  // Obtener programación de la semana
  obtenerProgramacionSemana() {
    const programacionSemana = {}

    for (let dia = 0; dia < 7; dia++) {
      const fecha = new Date()
      fecha.setDate(fecha.getDate() + dia)
      const fechaStr = fecha.toISOString().split("T")[0]
      const nombreDia = fecha.toLocaleDateString("es-ES", { weekday: "long" })

      programacionSemana[nombreDia] = {}

      Object.keys(this.programasSimulados).forEach((categoria) => {
        programacionSemana[nombreDia][categoria] = this.programasSimulados[categoria]
          .filter((programa) => programa.fecha === fechaStr)
          .slice(0, 5) // Solo mostrar 5 programas por categoría
          .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
      })
    }

    return programacionSemana
  }

  // Renderizar EPG en el DOM
  renderizarEPG(vista = "hoy") {
    const contenido = document.getElementById("epgContenido")
    contenido.innerHTML = ""

    this.vistaDia = vista

    if (vista === "semana") {
      this.renderizarVistaSemana(contenido)
    } else {
      this.renderizarVistaDia(contenido, vista)
    }
  }

  // Renderizar vista de un día
  renderizarVistaDia(contenido, vista) {
    const programacion = this.obtenerProgramacion(vista)

    Object.keys(programacion).forEach((categoria) => {
      if (programacion[categoria].length === 0) return

      const seccionCanal = document.createElement("div")
      seccionCanal.className = "epg-canal"

      const nombreCanal = document.createElement("div")
      nombreCanal.className = "epg-canal-nombre"
      nombreCanal.innerHTML = `📺 ${categoria.toUpperCase()} <span style="font-size: 0.8rem; color: var(--text-secondary);">(${programacion[categoria].length} programas)</span>`

      const programas = document.createElement("div")
      programas.className = "epg-programas"

      programacion[categoria].forEach((programa) => {
        const programaDiv = document.createElement("div")
        programaDiv.className = `epg-programa ${programa.enVivo ? "en-vivo" : ""}`

        programaDiv.innerHTML = `
          <div class="epg-programa-info">
            <h5>${programa.nombre}</h5>
            <p>${programa.descripcion}</p>
          </div>
          <div class="epg-programa-hora">
            ${programa.horaInicio}
            ${programa.enVivo ? '<span class="epg-programa-estado">EN VIVO</span>' : ""}
            <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 0.2rem;">
              ${programa.duracion} min • ⭐ ${programa.calificacion}
            </div>
          </div>
        `

        programas.appendChild(programaDiv)
      })

      seccionCanal.appendChild(nombreCanal)
      seccionCanal.appendChild(programas)
      contenido.appendChild(seccionCanal)
    })
  }

  // Renderizar vista de semana
  renderizarVistaSemana(contenido) {
    const programacionSemana = this.obtenerProgramacionSemana()

    Object.keys(programacionSemana).forEach((dia) => {
      const seccionDia = document.createElement("div")
      seccionDia.className = "epg-canal"

      const nombreDia = document.createElement("div")
      nombreDia.className = "epg-canal-nombre"
      nombreDia.innerHTML = `📅 ${dia.toUpperCase()}`

      const programasDia = document.createElement("div")
      programasDia.className = "epg-programas"

      Object.keys(programacionSemana[dia]).forEach((categoria) => {
        programacionSemana[dia][categoria].slice(0, 3).forEach((programa) => {
          const programaDiv = document.createElement("div")
          programaDiv.className = "epg-programa"

          programaDiv.innerHTML = `
            <div class="epg-programa-info">
              <h5>${programa.nombre} <span style="font-size: 0.8rem; color: var(--neon-secondary);">[${categoria}]</span></h5>
              <p>${programa.descripcion.substring(0, 60)}...</p>
            </div>
            <div class="epg-programa-hora">
              ${programa.horaInicio}
              <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 0.2rem;">
                ⭐ ${programa.calificacion}
              </div>
            </div>
          `

          programasDia.appendChild(programaDiv)
        })
      })

      seccionDia.appendChild(nombreDia)
      seccionDia.appendChild(programasDia)
      contenido.appendChild(seccionDia)
    })
  }
}

// Instancias globales
const iaRecomendaciones = new IARecomendaciones()
const multiViewManager = new MultiViewManager()
const epgManager = new EPGManager()

// Hacer disponibles globalmente
window.iaRecomendaciones = iaRecomendaciones
window.multiViewManager = multiViewManager
window.epgManager = epgManager
