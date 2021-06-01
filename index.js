const { response } = require('express');
const express = require('express');
const app = express();
const router = express.Router();
const fetch = require('node-fetch');

const fs = require('fs');
const data = fs.readFileSync('soluciones.json', 'utf8');
let words = JSON.parse(data);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function comprobarPalabra(palabras){
    const diccionario = await fetch('https://ordenalfabetix.unileon.es/aw/diccionario.txt').then(response => response.text());

    for(var i=0; i< palabras.length;i++){
        var palabraActual = palabras[i]; 

        if(diccionario.includes(palabraActual)){
            return true;
        }
    
    }

   
    return false;

}

function esCorrecta(palabras,idPasatiempo){

    let correcto = true;
    for(var i=0; i< palabras.length;i++){
        var palabraActual = palabras[i]; 

        if(words[idPasatiempo][i] != palabraActual){
            return false;
        }
    
    }


    return correcto;
}

router.route('/')
    .post(function(req,res){
        console.log(req.body);
        const promise = comprobarPalabra(req.body.palabras);
        const correcta = esCorrecta(req.body.palabras, req.body.idPasatiempo);

        promise.then(result => {
            if(result && correcta){
                res.status(200).send();
            }else{
                res.status(600).send();
            }
        })
    })

    

app.use('/game', router);


app.use(express.static('public'));

app.listen(3000,() => {
    console.log("Server on port 3000");
});
