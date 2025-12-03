# FitLife

Aplicación móvil construida con **Expo (React Native)** que guía a deportistas y aficionados a mantener una rutina equilibrada de entrenamiento, nutrición y bienestar diario, centralizando recordatorios y métricas en una experiencia oscura, moderna y accesible.

## Propósito

FitLife ayuda a los usuarios a:
- Seguir planes de entrenamiento personalizados por día.
- Controlar el avance nutricional según objetivos asignados por un entrenador.
- Gestionar tiempos de descanso o intervalos en sesiones.
- Actualizar datos personales y recibir avisos clave para la constancia.

## Flujo principal de la app

1. **Inicio de sesión (proveído por contexto Auth)** y acceso automático a la navegación de pestañas ocultas.  
2. **Ejercicios:** revisión diaria del plan y marcado de ejercicios completados.  
3. **Nutrición:** seguimiento de macros, registro de comidas y feedback inmediato.  
4. **Tiempos:** selección de temporizadores rápidos o personalizados con controles de iniciar, pausar y reiniciar.  
5. **Perfil:** edición de datos personales sincronizados con el contexto de autenticación.  
6. **Avisos:** confirmación de recordatorios de hidratación, entrenamiento y descanso.

## Funcionalidades clave

- Programas de entrenamiento diarios con seguimiento visual.
- Dashboard nutricional con barras de progreso y formulario de registro.
- Temporizador configurable con soporte para intervalos rápidos.
- Gestión del perfil de usuario con actualización en vivo.
- Sistema de avisos interactivos tipo checklist.

## Usabilidad, diseño adaptativo y optimización

- **Usabilidad:** componentes táctiles con retroalimentación (Pressable) y jerarquía tipográfica que prioriza títulos y acciones principales.
- **Diseño adaptativo:** uso de `SafeAreaView`, espaciados consistentes y layouts flexibles para teléfonos iOS/Android, manteniendo contraste AA en modo oscuro.
- **Optimización:** datos estáticos memorizados y control del ciclo de vida del temporizador mediante `useRef` para evitar fugas; validaciones ligeras en formularios para reducir errores de usuario.

## Instalación

```bash
git clone <repo-url>
cd FitLife
npm install
npx expo start
```

> Requiere Node.js ≥ 18, Expo CLI y un dispositivo/emulador con la app Expo Go. No se necesitan credenciales adicionales para el flujo base.

## Instrucciones de uso

1. Ejecutar `npx expo start` y escanear el QR con Expo Go (o presionar `a` / `i` para lanzar emulador).
2. Autenticarse según el contexto configurado (`AuthContext`).
3. Navegar por las pestañas internas:
   - **Ejercicios:** tocar un ejercicio para marcarlo como completado.
   - **Nutrición:** presionar “Agregar comida” y completar macros para registrar avances.
   - **Tiempos:** elegir un temporizador rápido o definir minutos/segundos personalizados.
   - **Perfil:** editar nombre, correo o contraseña y guardar cambios.
   - **Avisos:** marcar o desmarcar recordatorios diarios.

## Arquitectura y componentes

- **`src/navigation/UserTabs.tsx`**: orquesta la navegación sin mostrar la barra inferior y concentra las pantallas del usuario.
- **Pantallas autocontenidas** (Ejercicios, Nutrición, Tiempos, Perfil, Avisos) que comparten el objeto `StyleSheet` para consistencia visual.
- **Contexto de autenticación** (`useAuth`) para obtener datos de usuario y permitir mutaciones (`updateProfile`).

## Optimización adicional

- Reutilización de estilos centralizados para minimizar recalculados.
- Control manual de intervalos con `clearInterval` para impedir procesos huérfanos.
- Limitación de estados al mínimo necesario y uso de actualizaciones funcionales (`setState(prev => ...)`) para mayor previsibilidad.

## Pitch

FitLife convierte la disciplina personal en un producto intuitivo y escalable para gimnasios, entrenadores y programas corporativos. Con un flujo claro, métricas accionables y un diseño listo para marca blanca, la app es viable como SaaS o extensión de servicios de entrenamiento digital, minimizando costos de implementación y maximizando retención de usuarios.

Repositorio actualizado y accesible para seguimiento continuo del proyecto.
