# Food Store - Parcial 1 Programación 3

## Datos académicos

Comisión: 11

Profesores: Alberto Cortez - Cinthia Rigoni

Tutor: Juan Robledo

Alumno: Gonzalo Vega

Proyecto correspondiente al Parcial 1 de la materia Programación 3 (TUPaD - UTN).

El objetivo del trabajo es evolucionar la aplicación Food Store con funcionalidades frontend usando HTML, CSS, JavaScript y TypeScript, sin frameworks.

## Funcionalidades implementadas

- Catálogo de productos con renderizado dinámico.
- Búsqueda de productos por nombre.
- Filtrado de productos por categoría (incluye opción "Todas").
- Carrito con persistencia en localStorage.
- Carrito asociado por usuario autenticado.
- Vista de carrito en página independiente con:
  - listado de productos,
  - control de cantidades,
  - eliminación de ítems,
  - vaciado de carrito,
  - cálculo de subtotal, envío y total.

## Requisitos

- Node.js 18 o superior.
- pnpm instalado globalmente.

Instalación de pnpm (si no está disponible):

```bash
npm install -g pnpm
```

## Instalación y ejecución

1. Clonar el repositorio:

```bash
git clone https://github.com/GonzaVega/Parcial1P3TUPaD
cd proteger_rutas
```

2. Instalar dependencias:

```bash
pnpm install
```

3. Ejecutar entorno de desarrollo:

```bash
pnpm dev
```

El proyecto quedará disponible en:

```text
http://localhost:5173
```

## Scripts disponibles

- `pnpm dev`: inicia servidor de desarrollo.
- `pnpm build`: genera build de producción.
- `pnpm preview`: previsualiza build de producción.

## Estructura principal del proyecto

```text
src/
	pages/
		store/
			home/
				home.html
				home.ts
			cart/
				cart.html
				cart.ts
	utils/
		filters/
		cart/
```

## Video de presentación

Enlace al video (YouTube):

```text
PENDIENTE - Agregar URL cuando este publicado
```
