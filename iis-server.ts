import app from './src/server/server';

const port = process.env.PORT || 8001;
app.listen(port, () => { // to change it, set in a cmd >export PORT=3000  then run the app
    console.log(`Server v${process.env.npm_package_version} running at http://127.0.0.1:${port}/`);
});
