# Restaurante - Client User Web

Este repositorio aloja la **Aplicación Web Cliente** del ecosistema del Restaurante. Desarrollada con React, Vite y TailwindCSS, esta interfaz permite a los usuarios clientes explorar el menú, realizar pedidos y gestionar su perfil desde la comodidad de cualquier navegador web.

## 🚀 Alcance del Proyecto
Esta plataforma provee una experiencia de usuario rápida y moderna:
- **Gestión de Sesión:** Login y Registro integrados con el backend de usuarios.
- **Exploración de Menú:** Visualización rápida de los platillos del restaurante.
- **Interfaz Reactiva:** Single Page Application (SPA) manejada con React Router para transiciones fluidas.
- **Estilos Modernos:** Diseños estéticos generados mediante TailwindCSS.

## 🛠 Tecnologías Principales
- **Framework & Bundler:** React (v19) + Vite (v8)
- **Estilos:** TailwindCSS (v4)
- **Navegación:** React Router (v7)
- **Manejo de Estado Global:** Zustand
- **Peticiones HTTP:** Axios
- **Formularios & Validaciones:** React Hook Form
- **Iconos:** Lucide React, Heroicons, FontAwesome
- **Notificaciones UI:** React Hot Toast

## 📁 Estructura del Código
```
Restaurante-Client-User-Web/
├── public/          # Assets públicos no procesados por Vite
├── src/             # Código fuente principal
│   ├── components/  # UI compartida (Botones, Modales, Tarjetas)
│   ├── pages/       # Pantallas principales (Home, Menu, Profile)
│   ├── store/       # Lógica de estado con Zustand
│   ├── utils/       # Funciones auxiliares
│   ├── App.jsx      # Componente raíz y Rutas
│   └── main.jsx     # Archivo de anclaje de React
├── eslint.config.js # Reglas de Linting (ESLint 9)
├── vite.config.js   # Configuración de compilación
└── package.json     # Manifiesto de dependencias
```

## 📋 Requisitos para Ejecutar
- **Node.js** v18 o superior.
- **NPM**, **Yarn** o **PNPM** (Se recomienda PNPM por rendimiento).
- Tener corriendo localmente la API de `ServerUser` para interactuar con datos reales.

## ⚙️ Pasos de Instalación

1. **Clonar el proyecto:**
   ```bash
   git clone https://github.com/IN6CM-GestorRestaurante/Restaurante-Client-User-Web.git
   cd Restaurante-Client-User-Web
   ```

2. **Instalar los paquetes necesarios:**
   ```bash
   npm install
   ```

3. **Variables de entorno:**
   Si es necesario, crea un archivo `.env` para apuntar a la URL de tu API local.
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Levantar el servidor de desarrollo Vite:**
   ```bash
   npm run dev
   ```
   La terminal indicará la URL local, generalmente `http://localhost:5173`. Abre este enlace en tu navegador.

5. **Compilar para producción (Opcional):**
   ```bash
   npm run build
   npm run preview
   ```