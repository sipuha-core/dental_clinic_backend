import 'dotenv/config';
import app from './app.js';

const PORT = Number(process.env.PORT) || 3001;

const server = app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});

server.on('error', (err) => {
    console.error('SERVER ERROR:', err);
});