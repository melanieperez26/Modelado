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

# Expone el puerto
EXPOSE 3000

# Inicia la aplicación
CMD ["npm", "start"]
