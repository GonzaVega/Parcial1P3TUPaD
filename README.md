# Food Store - Parcial 1 Programacion 3

## Datos academicos

| Campo    | Dato         |
| -------- | ------------ |
| Comision | 11           |
| Profesores | Alberto Cortez, Cinthia Rigoni |
| Tutor | Juan Robledo |
| Alumno   | Gonzalo Vega |

Proyecto correspondiente al Parcial 1 de la materia Programacion 3 (TUPaD - UTN).

El objetivo del trabajo es evolucionar la aplicacion Food Store con funcionalidades frontend usando HTML, CSS, JavaScript y TypeScript, sin frameworks.

## Funcionalidades implementadas

- Catalogo de productos con renderizado dinamico.
- Busqueda de productos por nombre.
- Filtrado de productos por categoria (incluye opcion "Todas").
- Carrito con persistencia en localStorage.
- Carrito asociado por usuario autenticado.
- Vista de carrito en pagina independiente con:
  - listado de productos,
  - control de cantidades,
  - eliminacion de items,
  - vaciado de carrito,
  - calculo de subtotal, envio y total.

## Requisitos

- Node.js 18 o superior.
- pnpm instalado globalmente.

Instalacion de pnpm (si no esta disponible):

```bash
npm install -g pnpm
```

## Instalacion y ejecucion

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

El proyecto quedara disponible en:

```text
http://localhost:5173
```

## Scripts disponibles

- `pnpm dev`: inicia servidor de desarrollo.
- `pnpm build`: genera build de produccion.
- `pnpm preview`: previsualiza build de produccion.

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

## Video de presentacion

Enlace al video (YouTube):

```text
PENDIENTE - Agregar URL cuando este publicado
```
