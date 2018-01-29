import Server from './server';

const DEFAULT_PORT = 3000;

(new Server()).listen(process.env.PORT || DEFAULT_PORT);