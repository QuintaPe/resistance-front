# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a **The Resistance**! Este documento te guiará a través del proceso de contribución.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo Puedo Contribuir?](#cómo-puedo-contribuir)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Guía de Estilo](#guía-de-estilo)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)

---

## 📜 Código de Conducta

Este proyecto y todos sus participantes están gobernados por nuestro Código de Conducta. Al participar, se espera que mantengas este código. Por favor reporta comportamientos inaceptables.

### Nuestro Compromiso

- Usar lenguaje acogedor e inclusivo
- Respetar diferentes puntos de vista y experiencias
- Aceptar críticas constructivas con gracia
- Enfocarse en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros de la comunidad

### ⚠️ Nota Importante sobre Licencia

Este proyecto está bajo una **Licencia de Uso No Comercial**. Al contribuir:
- Aceptas que tus contribuciones se incluyan bajo los mismos términos
- El proyecto permanece como **uso no comercial solamente**
- No se permite el uso comercial sin autorización expresa del autor
- Todas las contribuciones ceden derechos al autor original

---

## 🚀 ¿Cómo Puedo Contribuir?

### Reportar Bugs

Los bugs se rastrean como [GitHub issues](https://github.com/tu-usuario/the-resistance-front/issues). Antes de crear un bug report, revisa si ya existe uno similar.

**Al crear un bug report, incluye:**

- **Título claro y descriptivo**
- **Descripción detallada** del problema
- **Pasos para reproducir** el bug
- **Comportamiento esperado** vs. **comportamiento actual**
- **Screenshots o GIFs** si es aplicable
- **Información del entorno**:
  - Navegador y versión
  - Sistema operativo
  - Versión de Node.js
  - Versión del proyecto

**Plantilla de Bug Report:**

```markdown
## Descripción del Bug
[Descripción clara y concisa del bug]

## Pasos para Reproducir
1. Ve a '...'
2. Haz clic en '...'
3. Desplázate hasta '...'
4. Ver error

## Comportamiento Esperado
[Qué esperabas que sucediera]

## Comportamiento Actual
[Qué sucedió realmente]

## Screenshots
[Si aplica, agrega screenshots]

## Entorno
- Navegador: [ej. Chrome 120]
- OS: [ej. Windows 11]
- Node: [ej. 18.17.0]
- Versión del Proyecto: [ej. 1.0.0]
```

### Sugerir Mejoras

Las sugerencias de mejoras también se rastrean como issues.

**Al sugerir una mejora, incluye:**

- **Título claro** que identifique la sugerencia
- **Descripción detallada** de la mejora propuesta
- **Justificación** de por qué sería útil
- **Ejemplos** de cómo funcionaría
- **Alternativas consideradas**

### Tu Primera Contribución de Código

¿No sabes por dónde empezar? Busca issues etiquetados como:

- `good first issue` - Issues buenos para principiantes
- `help wanted` - Issues que necesitan ayuda
- `bug` - Bugs confirmados que necesitan solución
- `enhancement` - Nuevas características

---

## 💻 Proceso de Desarrollo

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub, luego:
git clone https://github.com/TU-USUARIO/the-resistance-front.git
cd the-resistance-front
```

### 2. Crear una Rama

```bash
# Crea una rama para tu feature/fix
git checkout -b feature/nombre-descriptivo
# o
git checkout -b fix/descripcion-del-bug
```

**Convenciones de Nombres de Ramas:**
- `feature/` - Para nuevas características
- `fix/` - Para correcciones de bugs
- `docs/` - Para cambios en documentación
- `refactor/` - Para refactorización de código
- `test/` - Para agregar o modificar tests
- `style/` - Para cambios de estilo/formato

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Configurar el Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

### 5. Desarrollar

```bash
# Inicia el servidor de desarrollo
npm run dev

# En otra terminal, ejecuta el linter mientras desarrollas
npm run lint
```

### 6. Commit

Sigue las [convenciones de commit](#commit-messages) al hacer commits.

### 7. Push y Pull Request

```bash
# Push a tu fork
git push origin feature/nombre-descriptivo

# Abre un Pull Request en GitHub
```

---

## 🎨 Guía de Estilo

### TypeScript

- **Usa TypeScript** para todo el código nuevo
- **Define tipos explícitos** para props y estados
- **Evita `any`** siempre que sea posible
- **Usa interfaces** para objetos y tipos complejos

```typescript
// ✅ Bien
interface PlayerProps {
  name: string;
  id: string;
  isLeader: boolean;
}

const Player: React.FC<PlayerProps> = ({ name, id, isLeader }) => {
  // ...
};

// ❌ Mal
const Player = (props: any) => {
  // ...
};
```

### React

- **Componentes Funcionales** con hooks
- **Nombres en PascalCase** para componentes
- **Props destructuring** en la firma de función
- **Hooks al inicio** del componente
- **Early returns** para condiciones

```typescript
// ✅ Bien
const MyComponent: React.FC<Props> = ({ name, isActive }) => {
  const [count, setCount] = useState(0);
  const { data } = useCustomHook();

  if (!isActive) return null;

  return <div>{name}</div>;
};

// ❌ Mal
function MyComponent(props) {
  if (!props.isActive) return null;
  const [count, setCount] = useState(0);
  return <div>{props.name}</div>;
}
```

### CSS/Tailwind

- **Usa Tailwind** para estilos siempre que sea posible
- **Clases responsivas** con prefijos `sm:`, `md:`, `lg:`
- **Evita estilos inline** (excepto valores dinámicos)
- **Agrupa clases relacionadas** por función

```jsx
// ✅ Bien
<div className="
  flex items-center gap-3 
  p-4 rounded-xl 
  bg-slate-800/50 
  hover:bg-slate-700 
  transition-all duration-200
">

// ❌ Mal
<div style={{ display: 'flex', padding: '1rem' }} className="bg-slate-800/50 hover:bg-slate-700 transition-all items-center gap-3 rounded-xl duration-200">
```

### Estructura de Archivos

- **Un componente por archivo**
- **Nombre del archivo** igual al componente
- **Imports agrupados**: externos, internos, tipos, estilos

```typescript
// ✅ Estructura de imports
// 1. Externos
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// 2. Internos
import { useSocket } from "../context/SocketContext";
import PlayerCard from "../components/PlayerCard";

// 3. Tipos
import type { Player, GamePhase } from "../types";

// 4. Estilos (si hay)
import "./styles.css";
```

### Nomenclatura

- **Componentes**: PascalCase (`PlayerList`, `GameStatus`)
- **Hooks**: camelCase con prefijo `use` (`useGame`, `useSocket`)
- **Funciones**: camelCase (`handleClick`, `calculateScore`)
- **Variables**: camelCase (`playerName`, `isActive`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_PLAYERS`, `API_URL`)
- **Tipos/Interfaces**: PascalCase (`Player`, `GameState`)

---

## 📝 Commit Messages

Seguimos la convención de [Conventional Commits](https://www.conventionalcommits.org/).

### Formato

```
<tipo>(<ámbito>): <descripción>

[cuerpo opcional]

[footer opcional]
```

### Tipos

- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (espacios, punto y coma, etc)
- `refactor`: Refactorización de código
- `perf`: Mejoras de rendimiento
- `test`: Agregar o modificar tests
- `chore`: Cambios en build, CI, etc

### Ejemplos

```bash
# Nueva característica
git commit -m "feat(lobby): add player count display"

# Corrección de bug
git commit -m "fix(game): resolve vote counting issue"

# Documentación
git commit -m "docs(readme): update installation instructions"

# Refactorización
git commit -m "refactor(components): extract reusable modal component"

# Con cuerpo descriptivo
git commit -m "feat(game): add confirmation modals

- Add confirmation modal for vote actions
- Add confirmation modal for mission actions
- Display waiting state after confirmation
- Update UI with glassmorphism effects"
```

---

## 🔄 Pull Requests

### Antes de Abrir un PR

- ✅ Tu código pasa el linter (`npm run lint`)
- ✅ No hay errores de TypeScript
- ✅ Probaste los cambios localmente
- ✅ Actualizaste la documentación si es necesario
- ✅ Tu rama está actualizada con `main`

### Plantilla de Pull Request

```markdown
## Descripción
[Descripción clara de los cambios]

## Tipo de Cambio
- [ ] Bug fix (cambio que arregla un issue)
- [ ] Nueva característica (cambio que agrega funcionalidad)
- [ ] Breaking change (cambio que rompe compatibilidad)
- [ ] Documentación
- [ ] Refactorización
- [ ] Mejora de rendimiento

## ¿Cómo se ha Probado?
[Describe las pruebas que realizaste]

## Checklist
- [ ] Mi código sigue la guía de estilo del proyecto
- [ ] He realizado una self-review de mi código
- [ ] He comentado mi código en áreas difíciles de entender
- [ ] He actualizado la documentación correspondiente
- [ ] Mis cambios no generan nuevos warnings
- [ ] He probado que mi fix es efectivo o mi feature funciona

## Screenshots
[Si aplica, agrega screenshots]

## Issues Relacionados
Closes #(issue)
```

### Proceso de Review

1. Un mantenedor revisará tu PR
2. Pueden solicitar cambios o hacer comentarios
3. Realiza los cambios solicitados y haz push a tu rama
4. Una vez aprobado, tu PR será mergeado

### Después del Merge

- Tu rama será eliminada automáticamente
- Los cambios aparecerán en la próxima release
- ¡Serás agregado a los contribuidores! 🎉

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm test -- --watch

# Tests con coverage
npm test -- --coverage
```

### Escribir Tests

- Escribe tests para nuevas características
- Asegúrate que los tests pasen antes de hacer commit
- Usa nombres descriptivos para los tests

```typescript
describe('PlayerList', () => {
  it('should render all players', () => {
    // Test implementation
  });

  it('should highlight the current player', () => {
    // Test implementation
  });
});
```

---

## 📚 Recursos Adicionales

- [Documentación de React](https://react.dev)
- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de Socket.IO](https://socket.io/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## ❓ Preguntas

¿Tienes preguntas? No dudes en:

- Abrir un issue con la etiqueta `question`
- Contactar a los mantenedores
- Unirte a nuestro Discord

---

## 🙏 Agradecimientos

¡Gracias por contribuir a The Resistance! Cada contribución, grande o pequeña, es valiosa y apreciada.

---

<div align="center">

**Happy Coding! 🎮✨**

</div>

