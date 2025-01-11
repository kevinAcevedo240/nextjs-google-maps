<div align="center">
  
  <br />

[![image-2025-01-09-064030309.png](https://i.postimg.cc/wxttvKLx/image-2025-01-09-064030309.png)](https://postimg.cc/8sSkK0Zx)

  <br/>

  <div>
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-React_JS-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react.js" />
    <img src="https://img.shields.io/badge/-Typescript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcnui" />
    
  </div>

  <h2 align="center">Tienda de bob</h2>

   <div align="center">
     En esta aplicacion podras realizar compras de maiz, pero ten cuidado, solo podras comprar 1 por minuto, mientras esperas tu tiempo de compra
     otros usuarios que no han comprado tendran la oportunidad de comprar su maiz.
    </div>
</div>

## 📋 <a name="table">Tabla de contenido</a>

1. ⚙ [Tecnologias](#tech-stack)
2. 🤸 [Comenzar con la aplicacion en entorno local](#quick-start)


## <a name="tech-stack">⚙ Tecnologias</a>

[![My Skills](https://skillicons.dev/icons?i=tailwind,typescript,react,nextjs,prisma,postgresql)](https://skillicons.dev)<br/>



## <a name="quick-start">🤸 Comenzar con la aplicacion en entorno local</a>

Sigue los siguientes pasos para correr el proyecto en tu local.

*Prerequisitos*

Asegurate de tener los siguientes paquetes instalados en tu maquina local:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

*Clona el repositorio*

```bash
git clone https://github.com/guille1999utp/bob-corn.git
cd bob-corn
```

*instalacion*

Instala las dependencias del proyecto con npm:

```bash
npm install
```

*instalar comandos prisma*

Instalar y importar los atributos de los schemas de prisma:

```bash
npx prisma generate
```

*Asignar BD al proyecto*

agregar la siguiente variable de entorno al archivo ".env", este tambien debe ser creado en la raiz del proyecto "./":

```bash
DATABASE_URL= # "postgresql://user:password@domain/nameBD?sslmode=require"
```

Debes tener una url publica que apunte a una base de datos de postgres para poder migrar los schemas a la nueva base de datos con el siguiente comando:

```bash
npx prisma migrate deploy
```


*Corre el proyecto*

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el proyecto.


