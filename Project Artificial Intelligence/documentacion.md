# SharkPark: Guía Paso a Paso de Implementación (No-Code)

---

# Paso 1: Crear el Dataset de Imágenes

## 1. Recolectar fotografías

Data utilizada

[CNRPark+EXT](http://cnrpark.it/)

Toma fotografías de espacios de estacionamiento desde varios ángulos.

Debes crear **2 carpetas**:

## Spot_Occupied

Fotos de espacios ocupados.

- Sedanes
- SUVs
- Camionetas
- Carros compactos

**Mínimo:** 60 fotos

---

## Spot_Available

Fotos de espacios vacíos.

- Asfalto visible
- Líneas amarillas visibles
- Diferentes sombras
- Diferentes horas del día

**Mínimo:** 60 fotos

---

## Neutral_Noise

Fotos que no representan un espacio válido.

Ejemplos:

- Personas caminando
- Bicicletas
- Carritos de mantenimiento
- Fotos borrosas

**Mínimo:** 40 fotos

---

# Paso 2: Crear el Modelo en Teachable Machine

Entrar a:

<https://teachablemachine.withgoogle.com>

## Crear proyecto

1. Click en **Get Started**
2. Click en **Image Project**
3. Click en **Standard Image Model**

---

## Crear las clases

Cambiar los nombres por:

### Clase 1

```text
Spot_Occupied
```

### Clase 2

```text
Spot_Available
```



---

## Subir imágenes

Para cada clase:

1. Click en **Upload**
2. Selecciona las fotos correspondientes

Ejemplo:

- Spot_Occupied → 60 fotos
- Spot_Available → 60 fotos

---

# Paso 3: Entrenar el Modelo

Presiona:

```text
Train Model
```

## Configuración

```text
Epochs: 50
Batch Size: 16
Learning Rate: 0.001
```

O simplemente deja los valores por defecto.

Espera a que finalice el entrenamiento.

---

# Paso 4: Probar el Modelo

Cuando termine:

1. Click en **Preview**
2. Usa la webcam o una foto nueva

## Espacio ocupado

Debe mostrar algo similar a:

```text
Spot_Occupied
95%+
```

<img src="./img/ocupado.png" width="800"></img>

## Espacio vacío

Debe mostrar algo similar a:

```text
Spot_Available
95%+
```

<img src="./img/vacio.png" width="800"></img>

---

# Paso 5: Corregir Errores

Si falla con sombras:

Agregar más fotos de:

- Espacios vacíos con sombra
- Días nublados
- Tarde
- Amanecer

Ejemplo:

Agregar 20 imágenes nuevas a:

```text
Spot_Available
```

Luego volver a entrenar:

```text
Train Model
```

---

# Paso 6: Publicar el Modelo

Cuando estés satisfecho:

1. Click en **Export Model**
2. Selecciona **TensorFlow.js**
3. Click en **Upload my model**

Obtendrás un enlace parecido a:

```text
https://teachablemachine.withgoogle.com/models/ABC123/
```

Enlace del modelo a usar:

```text
https://teachablemachine.withgoogle.com/models/-nQdOh3--/
```

Guárdalo.

---

# Paso 7: Crear Google Sheets

En Google Drive:

1. Crear una Hoja de cálculo nueva.

Nombre:

```text
SharkPark Database
```

Link de base de datos

[SharkPark Database](https://docs.google.com/spreadsheets/d/1H4AxXHLE2dj7jEuN9x1zMnYqJ0t3psAS/edit?usp=sharing&ouid=116730034580599478830&rtpof=true&sd=true)

---

## Crear columnas

Fila 1:

| Zone | Bay_Number | Status | Confidence_Score | Last_Updated | Image_Sample |
|--------|--------|--------|--------|--------|--------|

---

## Agregar datos de ejemplo

| Zone | Bay_Number | Status |
|--------|--------|--------|
| Lot 1 North | 01 | Vacant |
| Lot 1 North | 02 | Occupied |
| Lot 1 North | 03 | Vacant |

---

# Paso 8: Crear la App en Glide

Entrar a:

<https://www.glideapps.com>

## Crear proyecto

1. Sign In
2. New Project
3. Google Sheets
4. Seleccionar **SharkPark Database**

Glide construirá la aplicación automáticamente.

---

# Paso 9: Diseñar la Interfaz

## Pantalla principal

### Título

```text
SharkPark
```

### Tarjetas

Ejemplo:

```text
Lot 1 North
14 Spaces Available
```

```text
Lot 2 South
7 Spaces Available
```

---

## Agregar colores

### Verde

```text
Vacant
```

### Rojo

```text
Occupied
```

---

# Paso 10: Agregar la Página de Escaneo

Crear una nueva pestaña:

```text
Scanner
```

Dentro colocar:

- Un botón
- Un link al modelo de Teachable Machine

Ejemplo:

```text
Open Parking Scanner
```

Cuando el usuario toca el botón:

1. Se abre el modelo.
2. Se evalúa la imagen.
3. Se observa si el espacio está libre o ocupado.

---

# Paso 11: Crear Reglas de Decisión

Documenta estas reglas para el reporte.

## Espacio Libre

```text
Si Spot_Available > 85%
→ Mostrar OPEN (Green)
```

## Espacio Ocupado

```text
Si Spot_Occupied > 85%
→ Mostrar TAKEN (Red)
```



---

# Paso 12: Hacer las Pruebas

Tomar capturas de pantalla de:

## Caso 1: Carro Estacionado

Resultado esperado:

```text
Spot_Occupied
98%
```

---

## Caso 2: Espacio Vacío

Resultado esperado:

```text
Spot_Available
95%
```

---

## Caso 3: Lluvia o Sombra Fuerte

Resultado esperado:

```text
Status Unclear
```

---

# Paso 13: Preparar la Presentación

## Diapositiva 1

- Título: SharkPark

## Diapositiva 2

- Problema del estacionamiento

## Diapositiva 3

- Dataset

## Diapositiva 4

- Entrenamiento en Teachable Machine

## Diapositiva 5

- Google Sheets

## Diapositiva 6

- Aplicación en Glide

## Diapositiva 7

- Resultados de pruebas

## Diapositiva 8

- Bias, privacidad y ética

## Diapositiva 9

- Conclusiones

---

# Resultado Final

Con este proceso tendrás un proyecto **no-code funcional** utilizando:

- Google Teachable Machine (IA)
- Google Sheets (Base de datos)
- Glide (Aplicación móvil)

Todo alineado con los requisitos del curso **CAI1001C: Introduction to AI Thinking**.