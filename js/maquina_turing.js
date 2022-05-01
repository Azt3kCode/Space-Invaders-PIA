let entrada = '';
const contenedor = document.getElementById('contenedor');
const player = document.getElementById('player');

// Ubicarnos en el primer blanco
async function q1(cadena, posicion) {
    console.log('Estado inicial');

    if (cadena[posicion] == '-') {
        contenedor.style.transform = 'translateX(0px)';
        cadena[posicion] = '-';
        console.log(cadena);
        return q2(cadena, posicion);
    } else {
        console.log('Error');
        await recorrerCuadros(posicion, 3);
        swal('Cadena inválida', '', 'error');
    }
}

// Moverse a la derecha una vez
async function q2(cadena, posicion) {
    console.log('Estado 2');

    posicion = posicion + 1;
    if (cadena[posicion] == 'a') {
        await recorrerCuadros(posicion, 1);
        cadena[posicion] = '-';
        console.log(cadena);
        return q3(cadena, posicion + 1);
    } else if (cadena[posicion] == 'b') {
        await recorrerCuadros(posicion, 1);
        cadena[posicion] = '-';
        console.log(cadena);
        return q6(cadena, posicion);
    } else if (cadena[posicion] == '-') {
        await recorrerCuadros(posicion, 1);
        cadena[posicion] = '-';
        return q7();
    } else {
        console.log('Error');
        await recorrerCuadros(posicion, 3);
        swal('Cadena inválida', '', 'error');
    }
}

// Mover hacia la derecha hasta encontrar un blanco
async function q3(cadena, posicion) {
    console.log('Estado 3');

    let i = posicion;

    while (cadena[i] != '-') {
        if (cadena[i] == 'a' || cadena[i] == 'b') {
            await recorrerCuadros(i, 2);
            i++;
        } else {
            await recorrerCuadros(i, 3);
            swal('Cadena inválida', '', 'error');
            return;
        }
    }
    console.log(cadena);
    return q4(cadena, i);
}

// Moverse a la izquierda una vez
async function q4(cadena, posicion) {
    console.log('Estado 4');

    posicion = posicion - 1;
    if (cadena[posicion] == 'b') {
        await recorrerCuadros(posicion, 1);
        cadena[posicion] = '-';
        console.log(cadena);
        return q5(cadena, posicion);
    } else {
        await recorrerCuadros(posicion, 3);
        swal('Cadena inválida', '', 'error');
    }
}

// Moverse a la izquierda hasta encontrar un blanco
async function q5(cadena, posicion) {
    console.log('Estado 5');

    let i = posicion - 1;

    while (cadena[i] != '-') {
        if (cadena[i] == 'a' || cadena[i] == 'b') {
            await recorrerCuadros(i, 2);
            i--;
        } else {
            await recorrerCuadros(i, 3);
            swal('Cadena inválida', '', 'error');
            return
        }
    }
    console.log(cadena);
    return q2(cadena, i);
}


async function q6(cadena, posicion) {
    console.log('Estado 6');

    posicion = posicion + 1;
    while (cadena[posicion] != '-') {
        if (cadena[posicion] == 'b') {
            await recorrerCuadros(posicion, 1);
            cadena[posicion] = '-';
            posicion++;
            console.log(cadena);
        } else {
            console.log('Error');
            await recorrerCuadros(posicion, 3);
            swal('Cadena inválida', '', 'error');
            return
        }
    }
    return q7();
}

function q7() {
    console.log('Estado 7');
    contenedor.style.transform = `translateX(${0 * -120}px)`;
    swal('Cadena aceptada', '', 'success');
}

// Convertir una cadena a un array
function toArray(cadena) {
    let array = [];
    for (let i = 0; i < cadena.length; i++) {
        array.push(cadena[i]);
    }
    return array;
}

function crearCuadros(cadena) {
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }

    for (let i = 0; i < cadena.length; i++) {
        const cuadro = document.createElement('div');
        cuadro.classList.add('cuadro');
        const p = document.createElement('p');
        p.textContent = cadena[i];
        p.className = 'letra';
        cuadro.appendChild(p);
        cuadro.id = i;
        contenedor.appendChild(cuadro);

        if (i != 0 && i != cadena.length - 1) {
            const img = document.createElement('img');
            img.style.width = '100px';
            img.style.height = '100px';
            img.style.position = 'absolute';
            img.style.top = '0%';
            img.style.left = '50%';
            img.style.transform = 'translate(-50%, -50%)';
            img.className = 'invader';
            img.src = 'img/invader.png';
            cuadro.appendChild(img);

            if (cadena[i] == 'a') {
                img.style.filter = 'hue-rotate(45deg)';
            }

            if (cadena[i] != 'a' && cadena[i] != 'b') {
                img.style.filter = 'hue-rotate(-90deg)';
            }
        } 
    }
}

async function recorrerCuadros(posicion, version) {
    const cuadro = document.getElementById(posicion);
    await new Promise(resolve => {
        setTimeout(() => {
            contenedor.style.transform = `translateX(${posicion * -120}px)`;
            
            if (version == 1) {
                disparo();
            } else if (version == 3) {
                contenedor.style.transform = `translateX(${0 * -120}px)`;
            }
            resolve();
        }, 100);
    });
    await new Promise(resolve => {
        setTimeout(() => {
            if (version == 1 && entrada[posicion] != '-') {
                const img = cuadro.children[1];
                img.style.opacity = '0';
                cuadro.children[0].textContent = '-';
            } else if (version == 3) {
                cuadro.style.backgroundColor = '#ff000077';
            }
            resolve();
        }, 100);
    });
}

async function disparo() {
    const bala = document.createElement('div');
    await new Promise(resolve => {
        bala.className = 'bala';
        player.appendChild(bala);
        setTimeout(() => {
            
            resolve();
        }, 225);
    });
    player.removeChild(bala);
}

async function guardar() {
    entrada = document.getElementById('entrada').value;
    // Verificar que en la entrada no haya '-'
    if (entrada.includes('-')) {
        swal('Cadena inválida', '', 'error');
        return -1;
    }
    // Verificar que en la entrada haya una cadena de a y b
    if (entrada.includes('a') || entrada.includes('b') || entrada == '') {
        entrada = '-' + entrada + '-';
        crearCuadros(toArray(entrada));
    } else {
        swal('Cadena inválida', '', 'error');
        return;
    }
}

function borrar() {
    document.getElementById('entrada').value = '';
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }
}

async function validar() {
    let estado = await guardar();
    if (estado == -1) {
        return;
    }
    const form = document.getElementById('form');
    form.style.opacity = '0.25';
    form.style.pointerEvents = 'none';
    await q1(toArray(entrada), 0);
    form.style.opacity = '1';
    form.style.pointerEvents = 'all';
    borrar();
}