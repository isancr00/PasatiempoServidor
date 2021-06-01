const { response } = require('express');
const express = require('express');
const app = express();
const router = express.Router();
const fetch = require('node-fetch');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function comprobarPalabra(palabraActual){
    const diccionario = await fetch('https://ordenalfabetix.unileon.es/aw/diccionario.txt').then(response => response.text());

    if(diccionario.includes(palabraActual) && palabraActual.length >= 4){
        return true;
    }

    return false;

}

async function esCorrecta(palabraActual,idPasatiempo){
    const solucion = await fetch('soluciones.json').then(response => response.text);

    if(solucion[idPasatiempo].includes(palabraActual)){
        return true;
    }

    return false;
}

router.route('/')
    .post(function(req,res){
        fetch('/',{
            method: "POST",
            headers : {
                'Content-Type' : 'application/json'
            },
            body: new File(Blob(),'soluciones.json')
        });
        
        console.log(req.body);
        const promise = comprobarPalabra(req.body.palabraActual) && esCorrecta(req.body.palabraActual);
        promise.then(result => {
            if(result)
                res.status(200).send();
        })
    })

    

app.use('/game', router);


app.use(express.static('public'));

app.listen(3000,() => {
    console.log("Server on port 3000");
});
