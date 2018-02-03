import Server from './server';

const DEFAULT_PORT = 5000;

(new Server()).listen(process.env.PORT || DEFAULT_PORT);
