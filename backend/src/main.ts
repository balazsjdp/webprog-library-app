import 'reflect-metadata';
import { app } from './app';

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`Könyvtár API szerver fut: http://localhost:${PORT}`);
});
