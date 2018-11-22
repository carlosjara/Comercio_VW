# Comercio_VW
Este repositorio sera el indicado para la vista como servidor.

### Descripcion

En este servidor se podran encontrar todos los fuentes (nodejs express, handlebars y mysql) asociados a vistas de la aplicacion que consumirá los servicios rest en [*Comercio_REST*](https://github.com/carlosjara/Comercio_REST) y en [*TPaga*](http://payment-links.docs.tpaga.co/quickstart.html#autenticacion-contra-la-tpaga-api), se busca dar detallada explicacion de cada carpeta.

#### validators

En esta carpeta se encuentra la logica de la validacion de usuarios, en cuanto a espacios en blanco.

#### routes

En esta carpeta se encuentran los archivos de configuracion de cada una de las rutas que pueden ser visualizadas, en estas mismas se encuentra el consumo de los servicios:
Se encuentra dividida e: 
*Carrito*, para los usuarios que tienen prouctos y desean pagarlos, 
*catalogo*, muestra el listado de productos disponibles para agregar al carro y despues comprar, 
*Finalizacion_usuario*, se encuentra la confirmacion del pago realizados por TPAGA, 
*index*, tiene el contenido de la pantalla principal de introduccion a SNJ
*users*, *validacion* y *login*, se encargan de la validacion del ingreso de los usuarios y la clasificacion segun rol para permitir el ingreso.

#### views

En esta carpeta se encuentran los templates con handlebars que usan objetos json para complementar la informacion usada y mostrada al usuario, estos templates cuentan con ciclos, condicionales y demas que permiten facilidad en la elaboracion del html a mostrar.

Ejemplo condicionales

```html
{{#ifCond cart '==' '0'}}
    <a>Carrito</a> 
{{else}}
    <a href="/carrito_usuario/{{idUser}}">Carrito ({{cart}})</a> 
{{/ifCond}}
```
Ejemplo Ciclo

```html
{{#each libros}}
<div class="shop-card" align="center">
    <div class="title">
        <label>{{this.nombre}} </label>
    </div>
    <div class="desc">
        <label>{{this.Author}}</label>
    </div>
    <div class="slider">
        <img src={{this.imagen}} style='height: 100%; width: 100%; object-fit: contain' />
    </div>
    <div class="cta">
        <div class="price">$ {{this.precio_unitario}} COP</div>
        <form action="/catalogo_usuario/agregarCarro/{{this.id}}/precio/{{this.precio_unitario}}/nombre/{{this.nombre}}/author/{{this.Author}}/is/{{../idUser}}" method="get">
            <div class="row">
                <label></label>
                <span class="bg"></span>
                <input type="submit" class="btn" value="Agregar al Carrio">
            </div>
        </form>
    </div>
</div>
{{/each}}
```

## app.js

En este archivo se encuentra la configuracion principal de este servidor, el puerto de acceso y configuracion de handlebars para visualizacion de templates a mostrar.