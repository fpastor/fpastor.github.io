# UT4 Data Definition Language (DDL)

## Introducción

El **diseño físico** es el proceso de producir la descripción de la implementación de la base de datos en la **memoria secundaria:** estructuras de almacenamiento y métodos de acceso que aseguren un **acceso eficiente a los datos.**

## Tipos de datos en SQL

## Numéricos

Los **datos numéricos** son muy importantes para poder almacenar datos numéricos como: **edades**, **cantidades** con o sin decimales, valores **booleanos** (0 o 1), etc.

### Integer (Enteros)

| | Valores | Negativos |
|:--|:--|:--|
| `BIT` | 0, 1 or NULL | |
| `TINYINT` | De 0 a 255 | No |
| `SMALLINT` | De -32.768 hasta 32.767 | Si |
| `INT` | De -2.147.483.648 hasta 2.147.483.647 | Si |

>[!NOTE]
>Cuando usemos nuestra propia clave primaria (codAutor, codPersonaje,...) debemos usar `SMALLINT` o `INT`.

### Decimales y dinero

>[!IMPORTANT]
>Todos los decimales incluyen negativos.

| | Precisión | Ejemplo | |
|:--|:--|:--|--:|
| `DECIMAL` | Hasta 9 digitos (con decimales). | `DECIMAL (5,2)` | 123,00 |
| `NUMERIC` | Hasta 19 digits (con decimales). | `NUMERIC (10,5)` | 12345,12000 |
| `SMALLMONEY` | Hasta 9 digits. Para dinero (menos precisión). | | |
| `MONEY` | 19 digits. Para dinero (mas precisión). | | |

>[!IMPORTANT]
>Muchos expertos **no recomiendan** el uso de `SMALLMONEY` o `MONEY`. Tendremos más control sobre los datos usando `DECIMAL` y `NUMERIC`.

## Strings

Cadenas de caracteres. Este tipo de datos es muy importante cuando queremos almacenar información de nombres, apellidos, direcciones, observaciones,... En definitiva, **campos que contiene texto o números con los que no pretendemos operar.**

| Character |  Unicode | Tipo de string |
|:--|:--|:--|
| `CHAR` | `NCHAR` | Fijo, siempre la misma extención |
| `VARCHAR` | `NVARCHAR` | Variable, la extensión depende de lo que almacenas |

## Date/Time

| | Descripción |
|:--|:--|
| `DATE` | Solo el dato de la fecha |
| `SMALLDATETIME` | Fecha y hora |
| `DATETIME` | Fecha y hora, con decimales en los segundos |

>[!NOTE]
>Normalmente, usaremos `DATE` o `SMALLDATETIME` (y de forma muy esporádica `DATETIME`).

## Gestión de tablas (SQL Server en modo gráfico)

## Gestión de tablas (Modo SQL)

### Crear y modificar tablas (CREATE TABLE)

```sql
CREATE TABLE NOMBRETABLA (
    Campo1 <tipoDato>,
    Campo2 <tipoDato>,
    CampoN <tipoDato>
);
```

```sql
nombre_col <tipoDato>
    [NOT NULL | NULL]
    [DEFAULT valor_por_defecto]
    [IDENTITY (inicio, incremento)] -- Autonumérico
    [PRIMARY KEY]
    [UNIQUE]
```

#### Restricciones de integridad

#### Claves primarias de una sola columna

En el momento de creación de la tabla...

```sql
CREATE TABLE ARTICULOS (
    codigo CHAR(4),
    descripcion VARCHAR(100),
    precio DECIMAL(10,2)
    CONSTRAINT PK_articulos PRIMARY KEY (codigo)
);
```

Añadir la clave primaria a una tabla existente...

```sql
ALTER TABLE ARTICULOS
ADD CONSTRAINT PK_articulos PRIMARY KEY (codigo);
```

>[!IMPORTANT]
>El campo que decidamos como clave primaria debe tener la restricción `NOT NULL`, de lo
contrario SQL Server devolverá el siguiente error:
>No se puede definir una restricción PRIMARY KEY en una columna que admite valores NULL de la tabla.

Borrar la clave primaria de la tabla existente...

```sql
ALTER TABLE ARTICULOS
DROP CONSTRAINT PK_articulos;
```

#### Claves primarias compuestas por mas de una columna

A veces **la clave se compone de varios campos.** Por ejemplo, en una tabla donde se guardan revisiones de ITV de vehículos, la clave está formada por la fecha y matrícula del vehículo.

Al igual que en las claves primarias de un valor, tenemos dos formas de hacerlo:

Crear clave principal en el momento de la creación de la tabla...

```sql
CREATE TABLE REVISION_ITV (
    matricula CHAR(10),
    fecha DATE,
    estado VARCHAR(100)
    CONSTRAINT PK_mat_fecha PRIMARY KEY (matricula, fecha)
);
```

Agregar la clave principal a una tabla existente...

```sql
CREATE TABLE REVISION_ITV (
    matricula CHAR (10) NOT NULL,
    fecha DATE NOT NULL,
    estado VARCHAR(100)
);

ALTER TABLE REVISION_ITV
ADD CONSTRAINT PK_mat_fecha PRIMARY KEY (matricula, fecha);
```

Eliminar la clave principal en una tabla existente...

```sql
ALTER TABLE REVISION_ITV
DROP CONSTRAINT PK_mat_fecha;
```

#### Resticción de campo obligatorio

Cuando un campo **no puede tener valores nulos**, decimos que es un campo obligatorio.

En nuestro ejemplo indicaremos la descripción como campo obligatorio para que ningún elemento
tenga la descripción vacía.

Crear campo obligatorio al crear la tabla...

```sql
CREATE TABLE ARTICULOS (
    codigo CHAR(4) PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2)
    CONSTRAINT PK_articulos PRIMARY KEY (codigo)
);
```

Eliminar la restricción del campo requerido...

```sql
ALTER TABLE ARTICULOS
ALTER COLUMN descripcion VARCHAR(100) NULL;
```

Agreguar la restricción de campo requerido a una tabla que ya existe...

```sql
ALTER TABLE ARTICULOS
ALTER COLUMN descripcion VARCHAR(100) NOT NULL;
```

#### Restricción de campos con valores únicos

Cuando un campo **no puede tener valores repetidos**, decimos que es un campo único.

Lo que realmente hace la base de datos es crear un índice con valores únicos

Crear campo obligatorio al crear la tabla (clave alternativa)...

```sql
CREATE TABLE ARTICULOS (
    codigo CHAR(4),
    descripcion VARCHAR(100) NOT NULL UNIQUE,
    precio DECIMAL(10,2)
    CONSTRAINT PK_articulos PRIMARY KEY (codigo)
);
```

Eliminar la restricción del campo requerido...

```sql
ALTER TABLE ARTICULOS
ALTER COLUMN descripcion VARCHAR(100) NOT NULL;
```

Agregar la restricción de campo requerida a una tabla que ya existe...

```sql
ALTER TABLE ARTICULOS
ADD UNIQUE (descripcion);
```

#### Restricción de campos por clave ajena (FK)

Como ya hemos visto en los esquemas lógicos relacionales obtenidos de los esquemas conceptuales, existen claves ajenas que contienen **valores de la clave primaria de otra tabla con la que se relacionan.**

En un esquema que tenga localidades y provincias, donde indiquemos en cada localidad de qué provincia es, podríamos tener las siguientes tablas...

```sql
CREATE TABLE PROVINCIAS (
    cod_prov INT,
    provincia VARCHAR(40)
    CONSTRAINT PK_provincias PRIMARY KEY (cod_prov)
);
```

Imaginemos que tenemos una tabla **MUNICIPIOS** que está relacionada con la tabla
**PROVINCIAS** (un municipio pertenece a una provincia y una provincia agrupa muchos
municipios).

Crear la clave ajena al crear la tabla...

```sql
CREATE TABLE MUNICIPIOS (
    cod_municipio INT,
    cod_prov INT,
    nombre_municipio VARCHAR(100)
    CONSTRAINT PK_municip PRIMARY KEY (cod_prov, cod_municipio)
    CONSTRAINT FK_prov_muni FOREIGN KEY (cod_prov)
    REFERENCES provincias (cod_prov)
);
```

Agregar la restricción de clave ajena a una tabla existente...

```sql
CREATE TABLE MUNICIPIOS (
    cod_municipio INT,
    cod_prov INT,
    nombre_municipio VARCHAR(100)
    CONSTRAINT PK_municip PRIMARY KEY (cod_prov, cod_municipio)
);

ALTER TABLE MUNICIPIOS
ADD CONSTRAINT FK_prov_muni FOREIGN KEY (cod_prov)
REFERENCES PROVINCIAS (cod_prov);
```

Eliminar la restricción de clave ajena...

```sql
ALTER TABLE MUNICIPIOS
DROP CONSTRAINT FK_prov_muni;
```

#### ¿Claves ajenas NULL o NOT NULL?

Dependerá de la cardinalidad mínima de la relación.

* Si la cardinalidad mínima fuera 1 → el FK NO será NULO.
* Si la cardinalidad mínima fuera 0 → el FK será NULL (no se indica nada).

![Ejemplo](img/ejemplo-clave-ajena.png)

#### Restricciones Check

Las restricciones `CHECK` se pueden ingresar tanto al crear la tabla con `CREATE TABLE` como después de haberla creado usando la instrucción `ALTER TABLE`.

Example.

```sql
CREATE TABLE ARTICULOS (
    codigo CHAR(4),
    descripcion VARCHAR(100) NOT NULL UNIQUE,
    precio DECIMAL(10,2)
    CONSTRAINT PK_articulos PRIMARY KEY (codigo),
    CONSTRAINT CK_precio CHECK (precio > 0)
);

ALTER TABLE ARTICULOS
ADD CONSTRAINT CK_precio CHECK (precio > 0);
```

Si necesitamos poner más condiciones podemos utilizar los operadores `AND` y `OR`.

### Eliminación y truncamiento de tablas (DROP TABLE)

Con el comando `DROP TABLE` podemos eliminar una tabla, tanto su estructura como su
contenido:

```sql
DROP TABLE PROVEEDOR;
```

Si solo queremos eliminar el contenido, pero no la estructura usaremos:

```sql
TRUNCATE TABLE PROVEEDOR;
```

### Crear restricciones en columnas

Comenzaremos por crear una tabla de artículos con los siguientes campos:

```sql
CREATE TABLE articulos (
    codigo CHAR(4),
    descripcion VARCHAR(100),
    precio DECIMAL(10,2)
);
```

#### Agregar un campo a una tabla existente

Una vez creada una tabla, es posible que necesitemos **agregar, modificar o eliminar un campo existente.** Para ello utilizaremos las siguientes sentencias SQL.

```sql
ALTER TABLE ARTICULOS
ADD descuento INT NOT NULL;
```

#### Modificar el tipo y las restricciones de un campo existente

Para cambiar un campo usaremos la siguiente declaración

```sql
ALTER TABLE ARTICULOS
ALTER COLUMN descuento DECIMAL(5,2) NOT NULL;
```

#### Eliminar un campo de una tabla existente

```sql
ALTER TABLE ARTICULOS
DROP COLUMN descuento;
```

### Crear índices

Los índices son estructuras que se crean en las bases de datos para poder **controlar la integridad y realizar búsquedas de manera más eficiente.
**
#### Agregar índices

Si quisiéramos crear un índice con valores repetidos cuando la tabla ya existe, usaríamos el siguiente comando:

```sql
CREATE INDEX INDEX_NAME
ON nombreTabla (col_name1,…);
```

Si quisiéramos crear un índice con valores únicos cuando la tabla ya existe, usaríamos el siguiente comando:

```sql
CREATE UNIQUE INDEX INDEX_NAME
ON nombreTabla (col_name1,…);
```

#### Eliminar índices

Para eliminar un índice debemos saber su nombre...

```sql
DROP INDEX INDEX_NAME
ON nombreTabla;
```

Ejemplo de uso de un índice en una base de datos MySQL...

![Ejemplo índice](img/ejemplo-indice.png)
