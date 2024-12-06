const express = require('express');
const app = express();
const port = 3000;
const path = require('path')

app.get('/', (re, res) => {
    res.send('Hello word!');
});

app.listen(port, () => {
    console.log(`Server running at htttp://localhost:${port}/`);
});

app.use(express.static(path.join(__dirname, 'public')));
