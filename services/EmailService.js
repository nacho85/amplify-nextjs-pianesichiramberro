import axios from 'axios';

const sendMailURL = "https://i3kgjmg0kj.execute-api.us-east-1.amazonaws.com/default/sendEmailPianesiChiramberroWeb";

export const sendMailCotizacionResultado = (datosCotizacion, callback) =>
{
    var coberturasHtml = '';
    datosCotizacion.packages.forEach(p => {
        coberturasHtml += "<li><b>Cobertura " + p.name + ":</b> "+p.price+"</li>"
    });
    axios
    .post(
        sendMailURL,
        {
            name: datosCotizacion.name,
            message: `
            <div style="font-family:arial;font-size:12px;background-color:#eceff4;text-align:center;padding:20px">
                <div style="width:600px;background-color:#FFF;margin-left:auto;margin-right:auto;text-align:left;padding:20px;word-wrap:break-word;">
                    <a href="https://pianesichiramberro.com.ar">
                    <img src="https://pianesichiramberro.com.ar/img/logo-colored.png" width="200" height="45">
                    </a>
                    <br><br>
                    Nueva cotización desde la web. El usuario solicita que se lo contacte.
                    
                    <div style="margin-top:15px"><b>Nombre:</b> {nombre}<br></div>
                    <div style="margin-top:15px"><b>Email o Teléfono:</b> {email}<br></div>
                    <div style="margin-top:15px"><b>Vehículo cotizado:</b> {vehicle}<br></div>
                    <div style="margin-top:15px"><b>Suma Asegurada:</b> {price}<br></div>
                    <div style="margin-top:15px"><b>Es 0km:</b> {0km} <b>GNC:</b> {gas}<br></div>
                    <div style="margin-top:15px"><b>Edad:</b> {age}<br></div>
                    <div style="margin-top:15px"><b>DATOS COTIZACIÓN</b><br></div>
                    <ul>
                    {packages}
                    </ul>
                </div>
            </div>
            `
            .replace("{nombre}", datosCotizacion.name)
            .replace("{email}", datosCotizacion.email)
            .replace("{vehicle}", datosCotizacion.vehicle)
            .replace("{0km}", datosCotizacion.is0km? "SI" : "NO")
            .replace("{gas}", datosCotizacion.hasGas? "SI" : "NO")
            .replace("{price}", datosCotizacion.price)
            .replace("{age}", datosCotizacion.age)
            .replace("{packages}", coberturasHtml)
        },
        { headers: {'Content-Type': 'application/json'} })
    .then(res => {
        callback(res);
    })
    .catch(error => {
        callback({
            isError: true,
            result: error
        })
    })
}