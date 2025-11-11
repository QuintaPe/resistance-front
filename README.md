# 🕵️ The Resistance - Juego Multijugador Online

<div align="center">

![The Resistance](https://img.shields.io/badge/The%20Resistance-Game-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?style=for-the-badge&logo=socket.io)

**Un juego de estrategia, engaño y deducción social para 5-10 jugadores**

[Características](#-características) • [Instalación](#-instalación) • [Cómo Jugar](#-cómo-jugar) • [Tecnologías](#-tecnologías-utilizadas) • [Arquitectura](#-arquitectura)

</div>

---

## 📖 Descripción

**The Resistance** es una adaptación digital del popular juego de mesa de deducción social. Los jugadores se dividen en dos equipos secretos: **La Resistencia** y **Los Espías**. El objetivo de la resistencia es completar tres misiones exitosamente, mientras que los espías intentan sabotear las misiones sin ser descubiertos.

### 🎯 Objetivo del Juego

- **Resistencia**: Completar 3 de 5 misiones exitosamente
- **Espías**: Hacer fracasar 3 misiones o lograr 5 rechazos de equipos consecutivos

---

## ✨ Características

### 🎮 Jugabilidad
- ✅ **Multijugador en Tiempo Real** - Juega con 5-10 amigos simultáneamente
- ✅ **Sistema de Salas** - Crea o únete a salas con códigos únicos
- ✅ **Roles Secretos** - Asignación aleatoria de roles (Resistencia/Espía)
- ✅ **Comunicación en Tiempo Real** - Sincronización instantánea con WebSockets
- ✅ **Gestión de Turnos** - Sistema automático de rotación de líder
- ✅ **Votaciones Secretas** - Sistema de votación anónima para equipos
- ✅ **Acciones de Misión** - Los espías pueden sabotear secretamente

### 🎨 Interfaz de Usuario
- 🌟 **Diseño Moderno** - UI elegante con efectos glassmorphism
- 🌈 **Animaciones Fluidas** - Transiciones suaves y efectos visuales atractivos
- 📱 **Totalmente Responsive** - Optimizado para móviles, tablets y desktop
- 🎭 **Temas Visuales** - Colores dinámicos según el contexto del juego
- ⚡ **Feedback Visual** - Modales de confirmación y estados de espera
- 🎯 **UX Intuitiva** - Navegación clara y flujo de juego comprensible

### 🛡️ Características Técnicas
- 🔒 **Validación de Acciones** - Sistema robusto de validación de jugadas
- 🔄 **Reconexión Automática** - Manejo de desconexiones y reconexiones
- 📊 **Tracker de Misiones** - Visualización clara del progreso del juego
- 👥 **Gestión de Jugadores** - Sistema completo de lobby y gestión de sala
- 🎲 **Distribución de Roles** - Algoritmo equilibrado de asignación de espías
- 📜 **Historial de Juego** - Seguimiento completo de todas las misiones

---

## 🚀 Instalación

### Requisitos Previos

Asegúrate de tener instalado:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 o **yarn** >= 1.22.0
- **Git**

### Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/the-resistance-front.git
cd the-resistance-front
```

### Instalar Dependencias

```bash
npm install
# o
yarn install
```

### Configuración del Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SOCKET_URL=http://localhost:3000
```

> **Nota**: Asegúrate de tener el servidor backend corriendo. El backend se conecta por defecto al puerto 3000.

### Ejecutar en Desarrollo

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:5173`

### Construir para Producción

```bash
npm run build
# o
yarn build
```

Los archivos optimizados se generarán en la carpeta `dist/`

### Vista Previa de Producción

```bash
npm run preview
# o
yarn preview
```

---

## 🎲 Cómo Jugar

### 1️⃣ Crear o Unirse a una Sala

**Crear Sala:**
1. Ingresa tu nombre
2. Haz clic en "Crear Nueva Sala"
3. Comparte el código de 6 dígitos con tus amigos

**Unirse a Sala:**
1. Ingresa tu nombre
2. Ingresa el código de sala
3. Haz clic en "Unirse"

### 2️⃣ Lobby de Espera

- Espera a que se unan entre 5 y 10 jugadores
- El **primer jugador** en crear la sala es el líder inicial
- El líder puede iniciar el juego cuando hay suficientes jugadores

### 3️⃣ Asignación de Roles

Una vez iniciado el juego:
- Los roles se asignan **aleatoriamente**
- **Resistencia** (mayoría): Solo pueden contribuir al éxito
- **Espías** (minoría): Pueden sabotear misiones y conocen a sus compañeros

**Distribución de Espías:**
- 5-6 jugadores: 2 espías
- 7-8 jugadores: 3 espías
- 9-10 jugadores: 4 espías

### 4️⃣ Fases del Juego

#### 🎯 Fase 1: Proponer Equipo
- El **líder de turno** selecciona jugadores para la misión
- El tamaño del equipo varía según la misión y número de jugadores

#### 🗳️ Fase 2: Votación de Equipo
- **Todos los jugadores** votan si aprueban o rechazan el equipo propuesto
- **Mayoría aprueba**: El equipo va a la misión
- **Mayoría rechaza**: El liderazgo pasa al siguiente jugador
- ⚠️ **Cuidado**: 5 rechazos consecutivos = Victoria de los Espías

#### 🎯 Fase 3: Ejecución de Misión
- Los miembros del equipo eligen en secreto:
  - **Resistencia**: Solo puede elegir "Éxito"
  - **Espías**: Pueden elegir "Éxito" o "Sabotaje"
- **1 o más sabotajes** = Misión fallida (excepto misión 4 con 7+ jugadores)

### 5️⃣ Victoria

- **Resistencia gana**: 3 misiones exitosas
- **Espías ganan**: 3 misiones fallidas o 5 rechazos de equipos consecutivos

### 6️⃣ Revelación

Al final del juego:
- Se revelan todos los roles
- Se muestra un resumen completo de todas las misiones
- Se pueden ver las estadísticas del juego

---

## 🛠️ Tecnologías Utilizadas

### Frontend

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **React** | 18.3.1 | Biblioteca de UI |
| **TypeScript** | 5.5.3 | Superset tipado de JavaScript |
| **Vite** | 5.4.2 | Build tool y dev server |
| **React Router** | 7.1.1 | Enrutamiento SPA |
| **Socket.IO Client** | 4.8.1 | Comunicación en tiempo real |
| **Tailwind CSS** | 3.4.17 | Framework de utilidades CSS |

### Herramientas de Desarrollo

- **ESLint** - Linting de código
- **TypeScript ESLint** - Reglas de linting para TypeScript
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Prefijos CSS automáticos

---

## 📁 Estructura del Proyecto

```
the-resistance-front/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── GameStatus.tsx      # Estado actual del juego
│   │   ├── MissionAction.tsx   # Acciones de misión con modal
│   │   ├── MissionTracker.tsx  # Visualizador de progreso
│   │   ├── PlayerList.tsx      # Lista de jugadores
│   │   ├── TeamSelector.tsx    # Selector de equipo
│   │   └── VoteButtons.tsx     # Botones de votación con modal
│   │
│   ├── context/             # Context API
│   │   └── SocketContext.tsx   # Gestión de Socket.IO
│   │
│   ├── hooks/               # Custom Hooks
│   │   └── useGame.ts          # Lógica del juego
│   │
│   ├── pages/               # Páginas principales
│   │   ├── Home.tsx            # Página de inicio
│   │   ├── Lobby.tsx           # Sala de espera
│   │   ├── Game.tsx            # Juego principal
│   │   └── Reveal.tsx          # Pantalla de resultados
│   │
│   ├── types/               # Definiciones de tipos
│   │   └── index.ts            # Tipos TypeScript
│   │
│   ├── App.tsx              # Componente raíz
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Estilos globales
│
├── public/                  # Archivos estáticos
├── .env                     # Variables de entorno
├── .gitignore              # Archivos ignorados por Git
├── eslint.config.js        # Configuración ESLint
├── index.html              # HTML template
├── package.json            # Dependencias y scripts
├── postcss.config.js       # Configuración PostCSS
├── tailwind.config.js      # Configuración Tailwind
├── tsconfig.json           # Configuración TypeScript
├── vite.config.ts          # Configuración Vite
└── README.md               # Este archivo
```

---

## 🏗️ Arquitectura

### Flujo de Datos

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  React Router   │  ← Navegación entre páginas
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Componentes    │  ← UI y eventos del usuario
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  SocketContext  │  ← Estado global y comunicación
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Socket.IO     │  ← WebSocket connection
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Backend API   │  ← Servidor Node.js
└─────────────────┘
```

### Gestión del Estado

El proyecto utiliza **React Context API** para gestionar el estado global:

- **SocketContext**: Maneja la conexión WebSocket y el estado del juego
  - Conexión/desconexión
  - Estado de la sala
  - Rol del jugador
  - Lista de espías (si eres espía)
  - Eventos del juego en tiempo real

### Comunicación en Tiempo Real

Eventos de Socket.IO implementados:

**Cliente → Servidor:**
- `createRoom` - Crear nueva sala
- `joinRoom` - Unirse a sala existente
- `startGame` - Iniciar juego
- `proposeTeam` - Proponer equipo
- `voteTeam` - Votar equipo
- `missionAction` - Realizar acción de misión
- `requestRole` - Solicitar rol asignado

**Servidor → Cliente:**
- `roomCreated` - Sala creada exitosamente
- `roomJoined` - Unión exitosa
- `roomState` - Estado actualizado de la sala
- `assignRole` - Asignación de rol
- `gameStarted` - Juego iniciado
- `error` - Errores y validaciones

---

## 🎨 Características de Diseño

### Sistema de Diseño

El proyecto implementa un sistema de diseño consistente:

#### Colores Temáticos
- **Azul/Púrpura**: Acciones generales y resistencia
- **Verde**: Éxito, aprobaciones, acciones positivas
- **Rojo**: Espías, sabotaje, rechazos, acciones negativas
- **Amarillo/Naranja**: Líderes, alertas, elementos destacados

#### Efectos Visuales
- **Glassmorphism**: Efecto de vidrio esmerilado en cards
- **Gradientes Animados**: Transiciones suaves de color
- **Hover Effects**: Interacciones visuales al pasar el mouse
- **Animaciones de Entrada**: fadeIn para nuevos elementos
- **Efectos Glow**: Resplandor pulsante en elementos importantes

#### Animaciones Personalizadas
```css
- animate-pulse-slow: Pulsación lenta para orbes de fondo
- animate-gradient: Animación de gradientes
- animate-shimmer: Efecto de brillo deslizante
- animate-float: Flotación suave para partículas
- animate-fadeIn: Entrada suave de elementos
- animate-pulse-glow: Resplandor pulsante
```

### Responsive Design

- **Móvil First**: Diseñado primero para dispositivos móviles
- **Breakpoints**: sm (640px), md (768px), lg (1024px)
- **Layouts Adaptativos**: Grid y flexbox responsivos
- **Textos Escalables**: Tamaños de fuente adaptables
- **Touch Friendly**: Botones y áreas de click optimizadas

---

## 🔐 Seguridad y Validaciones

### Validaciones del Cliente
- ✅ Nombres de usuario no vacíos
- ✅ Códigos de sala válidos (6 caracteres)
- ✅ Verificación de número de jugadores
- ✅ Prevención de acciones duplicadas

### Validaciones del Servidor
- ✅ Verificación de sala existente
- ✅ Validación de permisos (líder, miembro del equipo)
- ✅ Verificación de fase del juego
- ✅ Validación de roles y acciones
- ✅ Prevención de trampas y exploits

---

## 🧪 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm run preview      # Vista previa de build de producción
npm run lint         # Ejecuta ESLint para encontrar problemas

# Utilidades
npm run type-check   # Verifica tipos TypeScript
npm run format       # Formatea código (si está configurado)
```

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Si quieres contribuir:

1. **Fork** el proyecto
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add: nueva característica increíble'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### Guía de Estilo
- Usa TypeScript para todo el código nuevo
- Sigue las convenciones de nombres de React
- Escribe componentes funcionales con hooks
- Documenta funciones y componentes complejos
- Mantén los componentes pequeños y reutilizables

---

## 📝 Roadmap

### Próximas Características

- [ ] 🎤 Sistema de chat en tiempo real
- [ ] 📊 Estadísticas de jugador persistentes
- [ ] 🏆 Sistema de logros y badges
- [ ] 🎨 Temas personalizables
- [ ] 🌍 Internacionalización (i18n)
- [ ] 📱 App móvil nativa (React Native)
- [ ] 🎮 Modo de juego rápido
- [ ] 👥 Sistema de amigos
- [ ] 🔊 Efectos de sonido
- [ ] 📹 Integración con video chat

---

## 🐛 Problemas Conocidos

- La reconexión puede causar que se pierda el estado del modal
- En algunos dispositivos móviles, las animaciones pueden ser lentas
- Los navegadores antiguos pueden no soportar todas las características

Para reportar bugs o solicitar features, abre un [Issue](https://github.com/tu-usuario/the-resistance-front/issues).

---

## 📄 Licencia

Este proyecto está bajo una **Licencia de Uso No Comercial** - ver el archivo [LICENSE](LICENSE) para todos los detalles.

### ⚠️ Importante

- ✅ **Permitido**: Uso personal, educativo y académico
- ❌ **Prohibido**: Uso comercial, venta, redistribución con fines de lucro
- 📧 Para solicitar permisos comerciales, contacta al autor

**Todos los derechos reservados © 2025 Alejandro**

---

## 👨‍💻 Autor

**Alejandro**

- GitHub: [@tu-usuario](https://github.com/tu-usuario)

---

## 🙏 Agradecimientos

- Inspirado en el juego de mesa **"The Resistance"** de Don Eskridge
- Comunidad de React y TypeScript
- Todos los contribuidores y jugadores

---

## 📞 Soporte

¿Necesitas ayuda? 

- 📧 Email: tu-email@ejemplo.com
- 💬 Discord: [Servidor de Discord](https://discord.gg/tu-servidor)
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/the-resistance-front/issues)

---

<div align="center">

**¿Te gustó el proyecto? ¡Dale una ⭐!**

Hecho con ❤️ y ☕

</div>
