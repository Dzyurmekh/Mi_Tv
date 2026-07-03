# Mi TV Personal

Aplicación web estática para cargar listas IPTV M3U, buscar canales, guardar favoritos y usar funciones como historial, miniplayer, Picture-in-Picture, listas personalizadas, multi-view y guía EPG.

## Características Principales

✨ **Interfaz Moderna con Efectos Neón**
- Diseño futurista con gradientes y animaciones
- 6 temas personalizables (Azul, Rojo, Verde, Púrpura, Dorado, Rosa)
- Modo oscuro/claro

📺 **Reproductor IPTV Avanzado**
- Soporte para HLS y streams M3U
- Auto-reconexión inteligente con reintentos exponenciales
- Picture-in-Picture nativo del navegador
- Miniplayer flotante y arrastrable

🤖 **Motor de IA Inteligente**
- Recomendaciones basadas en historial y preferencias
- Análisis de patrones de visualización
- Puntuación inteligente de canales
- Entrenamiento de modelo con precisión adaptativa

🔄 **Multi-view TV**
- Ver 2, 4 o 6 canales simultáneamente
- Silenciar/maximizar individual
- Cambiar canales en tiempo real

📅 **Guía de Programas (EPG)**
- Programación simulada realista
- Vistas: Hoy, Mañana, Esta Semana
- Indicadores de programas en vivo
- Calificaciones y duraciones

⏰ **Sleep Timer**
- Pausa automática después de X minutos
- Opciones preestablecidas (15, 30, 60, 120 min)
- Temporizador personalizado

🎯 **Búsqueda y Filtrado**
- Búsqueda en tiempo real
- Filtro de favoritos
- Categorización automática de canales
- Más de 9 categorías disponibles

📋 **Listas Personalizadas**
- Crear múltiples listas de reproducción
- Agregar/quitar canales
- Guardar en almacenamiento local

💾 **Historial Avanzado**
- Registro de últimos 50 canales vistos
- Timestamps automáticos
- Opción para agregar a listas desde historial

🎨 **Controles Multimedia**
- Control de volumen visual con slider
- Captura de pantalla
- Pantalla completa
- Atajos de teclado personalizables

📱 **Responsive Design**
- Adaptable a móviles, tablets y desktop
- Interfaz touch-friendly
- Menú lateral collapsible

⚡ **PWA (Progressive Web App)**
- Funciona offline
- Instalable como app
- Service Worker con caché inteligente

## Atajos de Teclado

| Atajo | Función |
|-------|----------|
| `Espacio` | Play/Pausa |
| `↑` | Canal anterior |
| `↓` | Canal siguiente |
| `Ctrl + ↑` | Aumentar volumen |
| `Ctrl + ↓` | Disminuir volumen |
| `F` | Pantalla completa |
| `P` | Picture-in-Picture |
| `M` | Miniplayer |
| `H` | Historial |
| `T` | Temas |
| `L` | Listas personalizadas |
| `S` | Sleep Timer |
| `Ctrl + R` | Recomendaciones IA |
| `Ctrl + V` | Multi-view |
| `Ctrl + G` | EPG/Guía |
| `?` | Ver atajos |
| `ESC` | Cerrar modales |

## Instalación Local

### Requisitos
- Node.js (opcional, para servidor local)

### Método 1: Servidor Node.js

```bash
# Navegar a la carpeta del proyecto
cd Mi_Tv

# PowerShell (Windows)
set PORT=8095
node server.js

# O usando npm
npm.cmd start

# Bash (Linux/Mac)
PORT=8095 node server.js
```

Luego abre: `http://localhost:8095`

### Método 2: Servidor Python

```bash
# Python 3
python -m http.server 8095

# Python 2
python -m SimpleHTTPServer 8095
```

### Método 3: GitHub Pages

Accede directamente a: `https://dzyurmekh.github.io/Mi_Tv/`

## Estructura del Proyecto

```
Mi_Tv/
├── index.html              # Página principal
├── manifest.json           # Configuración PWA
├── server.js              # Servidor local Node.js
├── robots.txt             # SEO
├── sitemap.xml            # Mapa del sitio
├── sw.js                  # Service Worker
├── css/
│   └── style.css          # Estilos principales (27KB)
├── js/
│   ├── principal.js       # Lógica principal (55KB)
│   ├── ia-engine.js       # Motor de IA y Multi-view (21KB)
│   └── hls.min.js         # Reproductor HLS (375KB)
└── README.md              # Este archivo
```

## Cómo Cargar Listas M3U

### Opción 1: Desde Archivo Local
1. Haz clic en el área de carga
2. Selecciona un archivo `.m3u` de tu equipo
3. Los canales se cargarán automáticamente

### Opción 2: Desde URL
1. Pega la URL de un archivo `.m3u` (debe ser HTTPS)
2. Haz clic en "📡 Cargar desde URL"
3. Espera a que los canales se carguen

## Almacenamiento Local (LocalStorage)

La aplicación guarda automáticamente:
- Favoritos
- Historial
- Tema seleccionado
- Volumen
- Listas personalizadas
- Últimas preferencias de visualización

## Seguridad y Privacidad

- ✅ Todo funciona localmente en tu navegador
- ✅ Sin conexión a servidores externos (excepto URLs de streams)
- ✅ Los datos se guardan solo en tu dispositivo
- ✅ No se recopila información personal
- ✅ Código 100% transparente y auditable

## Restricciones y Requisitos

- Requiere navegador moderno (Chrome, Firefox, Edge, Safari)
- Las URLs de streams deben usar HTTPS (no HTTP)
- No soporta contenido mixto por política de navegadores
- Requiere JavaScript habilitado
- Soporte HLS en navegador o HLS.js

## Solución de Problemas

### Los canales no cargan
1. Verifica que la URL use HTTPS
2. Comprueba la consola del navegador (F12)
3. Intenta con otra lista M3U

### Picture-in-Picture no funciona
1. Verifica que tu navegador lo soporte
2. Asegúrate de que hay un video reproduciéndose

### Multi-view lento
1. Reduce el número de canales
2. Verifica tu conexión de internet
3. Cierra otras pestañas

## Desarrollo y Contribuciones

Esta es una aplicación de demostración. Para mejoras:
1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit cambios (`git commit -m 'Agrega mejora'`)
4. Push (`git push origin feature/mejora`)
5. Abre un Pull Request

## Licencia y Atribuciones

**Creado por:** Dzyurmekh © 2025  
**Uso:** Personal y educativo  
**Prohibido:** Uso comercial sin autorización

### Tecnologías Usadas
- HLS.js - Reproductor de streams HLS
- Orbitron Font - Tipografía futurista
- CSS Grid & Flexbox - Layouts responsivos
- Web APIs nativas - Sin dependencias externas

## Soporte

- 📧 GitHub: [@Dzyurmekh](https://github.com/Dzyurmekh)
- 🐛 Reporta bugs en Issues
- 💡 Sugiere mejoras en Discussions

## Roadmap Futuro

- [ ] Integración con APIs de EPG reales
- [ ] Soporte para DASH streams
- [ ] Base de datos de canales sincronizada
- [ ] Subtítulos automáticos
- [ ] Sincronización entre dispositivos
- [ ] App nativa para móviles
- [ ] Búsqueda avanzada con filtros
- [ ] Sistema de comentarios y valoraciones

---

⭐ Si te gusta este proyecto, ¡no olvides dar una estrella en GitHub!
