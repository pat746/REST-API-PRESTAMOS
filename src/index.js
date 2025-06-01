import app from './app.js'
//tenemos un script que permite ejecutar el server:
//npm run dev
app.listen(3000, () => {
  console.log("Servidor iniciando en http://localhost:3000")
})