# Usa una imagen base de Node
FROM node:18

# Crea el directorio de trabajo
WORKDIR /app

# Copia package.json y package-lock.json primero
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia todo el proyecto
COPY . .

# Ejecuta Prisma generate
RUN npx prisma generate

# Genera los archivos de Prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

# Expone el puerto
EXPOSE 8080

# Inicia la aplicación
CMD ["npm", "start"]
