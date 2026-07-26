# Stray Kids & Co. 🛍️

Tienda en línea hecha con Next.js. Los usuarios pueden ver un catálogo de productos, agregarlos al carrito, iniciar sesión, pagar y recibir su factura en PDF por correo real.

## Funcionalidades

- Catálogo de productos filtrable por categoría.
- Carrito de compras (agregar, quitar, cambiar cantidad).
- Registro e inicio de sesión de usuarios.
- Solo los usuarios logueados pueden finalizar una compra.
- Al no haber sesión iniciada, la app redirige directo al login.
- Simulación de pago (tarjeta o efectivo).
- Generación de factura en PDF con jsPDF.
- Envío real de la factura por correo usando Nodemailer + Gmail (sin usar ninguna API de pago).

## Tecnologías

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Zustand (manejo del carrito)
- jsPDF (generación de PDF)
- Nodemailer (envío de correo)

## Instalación local

1. Clona el repositorio:
```bash
   git clone <url-del-repo>
   cd dpsdesafio1
```

2. Instala las dependencias:
```bash
   npm install
```

3. Crea un archivo `.env.local` en la raíz del proyecto (mismo nivel que `package.json`) basándote en `.env.local.example`:

EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion_de_16_letras

> `EMAIL_PASS` **no** es tu contraseña normal de Gmail. Es una "Contraseña de aplicación" que se genera en:
   > Cuenta de Google → Seguridad → Verificación en 2 pasos → Contraseñas de aplicaciones
   > (`https://myaccount.google.com/apppasswords`)

4. Corre el servidor de desarrollo:
```bash
   npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000)

## Usuario de prueba

- Usuario: `valemeli`
- Contraseña: `123`

(o puedes registrar tu propia cuenta desde la pantalla de login)

## Despliegue en Vercel

Al desplegar en Vercel, hay que agregar las variables de entorno manualmente (no se suben desde `.env.local` porque está en `.gitignore`):

1. En el proyecto de Vercel: **Settings → Environment Variables**
2. Agrega `EMAIL_USER` y `EMAIL_PASS` con los mismos valores que usaste en local
3. Ve a **Deployments** y haz **Redeploy** para que tomen efecto
