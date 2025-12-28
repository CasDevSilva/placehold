# ESPECIFICACIONES - 4 TOOLS CLI

---

# 1. QR-FORGE

## Descripción
CLI para generar códigos QR en PNG/SVG con personalización de colores, logo embed y procesamiento batch.

## Paquetes
```json
{
  "dependencies": {
    "commander": "^12.0.0",
    "qrcode": "^1.5.3",
    "chalk": "^5.3.0",
    "sharp": "^0.33.0"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

## Comandos

### Comando principal: `qr-forge <data>`
Genera QR code desde string o URL.

### Opciones
| Flag | Alias | Descripción | Default |
|------|-------|-------------|---------|
| `--output` | `-o` | Ruta de salida | `./qr.png` |
| `--format` | `-f` | Formato: png, svg | `png` |
| `--size` | `-s` | Tamaño en píxeles | `300` |
| `--color` | `-c` | Color del QR (hex) | `#000000` |
| `--background` | `-bg` | Color de fondo (hex) | `#ffffff` |
| `--logo` | `-l` | Ruta a logo para embeber | `null` |
| `--logo-size` | `-ls` | Tamaño del logo (%) | `20` |
| `--batch` | `-b` | Archivo con lista de datos (uno por línea) | `null` |
| `--margin` | `-m` | Margen del QR | `4` |

### Ejemplos de uso
```bash
# Básico
qr-forge "https://github.com/neither" -o mi-qr.png

# Con colores custom
qr-forge "https://ejemplo.com" -c "#1a1a2e" -bg "#eaeaea" -o brand-qr.png

# SVG con tamaño específico
qr-forge "data123" -f svg -s 500 -o code.svg

# Con logo embebido
qr-forge "https://misite.com" --logo ./logo.png --logo-size 25 -o qr-logo.png

# Batch processing
qr-forge --batch urls.txt --output ./qrs/
# urls.txt contiene una URL por línea
# Genera: qrs/qr-1.png, qrs/qr-2.png, etc.
```

## Estructura de carpetas
```
qr-forge/
├── bin/
│   └── qr-forge.js           # Entry point CLI
├── src/
│   ├── generator.js          # Lógica de generación QR
│   ├── logo-embed.js         # Embed logo en QR
│   ├── batch.js              # Procesamiento batch
│   └── utils.js              # Helpers (colores, validación)
├── tests/
│   └── generator.test.js
├── package.json
└── README.md
```

## Lógica principal
1. Parsear argumentos con Commander
2. Validar data input (string no vacío)
3. Si `--batch`: leer archivo, generar múltiples
4. Generar QR con `qrcode` library
5. Si `--logo`: usar `sharp` para superponer logo
6. Guardar en formato especificado

## Validaciones
- Data no puede estar vacía
- Colores deben ser hex válidos (#xxx o #xxxxxx)
- Logo debe existir si se especifica
- Directorio de output debe existir o crearse

---

# 2. PLACEHOLD

## Descripción
CLI para generar imágenes placeholder localmente con texto, colores y dimensiones personalizadas.

## Paquetes
```json
{
  "dependencies": {
    "commander": "^12.0.0",
    "sharp": "^0.33.0",
    "chalk": "^5.3.0"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

## Comandos

### Comando principal: `placehold <dimensions>`
Genera imagen placeholder. Dimensions en formato `WIDTHxHEIGHT`.

### Opciones
| Flag | Alias | Descripción | Default |
|------|-------|-------------|---------|
| `--output` | `-o` | Ruta de salida | `./placeholder.png` |
| `--text` | `-t` | Texto a mostrar | `WxH` (dimensiones) |
| `--background` | `-bg` | Color de fondo (hex) | `#cccccc` |
| `--color` | `-c` | Color del texto (hex) | `#666666` |
| `--format` | `-f` | Formato: png, jpg, webp | `png` |
| `--batch` | `-b` | Cantidad a generar | `1` |
| `--font-size` | `-fs` | Tamaño de fuente | `auto` |

### Ejemplos de uso
```bash
# Básico
placehold 1920x1080 -o banner.png

# Con texto custom
placehold 800x600 -t "Hero Image" -o hero.png

# Colores personalizados
placehold 400x400 -bg "#1a1a2e" -c "#ffffff" -t "Avatar" -o avatar.png

# Batch: generar 10 imágenes
placehold 200x200 --batch 10 --output ./placeholders/
# Genera: placeholders/placeholder-1.png, placeholder-2.png, etc.

# WebP format
placehold 1200x630 -f webp -t "OG Image" -o og.webp
```

## Estructura de carpetas
```
placehold/
├── bin/
│   └── placehold.js          # Entry point CLI
├── src/
│   ├── generator.js          # Lógica de generación imagen
│   ├── text-overlay.js       # Agregar texto a imagen
│   ├── batch.js              # Procesamiento batch
│   └── utils.js              # Helpers (parsear dimensiones, colores)
├── tests/
│   └── generator.test.js
├── package.json
└── README.md
```

## Lógica principal
1. Parsear argumentos con Commander
2. Parsear dimensiones (WxH)
3. Crear imagen sólida con `sharp`
4. Si hay texto: agregar con SVG overlay
5. Si batch > 1: generar múltiples con sufijo numérico
6. Guardar en formato especificado

## Validaciones
- Dimensiones deben ser formato válido (WxH)
- Width y Height deben ser números positivos (max 4096)
- Colores deben ser hex válidos
- Formato debe ser png, jpg o webp

---

# 3. DATA-GEN

## Descripción
CLI para generar datos falsos estructurados en JSON o CSV. Define campos y tipos, obtén data lista para testing/seeding.

## Paquetes
```json
{
  "dependencies": {
    "commander": "^12.0.0",
    "@faker-js/faker": "^8.4.0",
    "chalk": "^5.3.0",
    "json2csv": "^6.0.0-alpha.2"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

## Comandos

### Comando principal: `data-gen`
Genera datos falsos según especificación de campos.

### Opciones
| Flag | Alias | Descripción | Default |
|------|-------|-------------|---------|
| `--count` | `-n` | Cantidad de registros | `10` |
| `--fields` | `-f` | Definición de campos | requerido |
| `--output` | `-o` | Ruta de salida | `stdout` |
| `--format` | `-fmt` | Formato: json, csv | `json` |
| `--locale` | `-l` | Locale para datos | `en` |
| `--pretty` | `-p` | JSON indentado | `false` |
| `--schema` | `-s` | Archivo con schema JSON | `null` |

### Tipos de campos soportados
| Tipo | Descripción | Ejemplo output |
|------|-------------|----------------|
| `uuid` | UUID v4 | `"f47ac10b-58cc..."` |
| `fullName` | Nombre completo | `"John Smith"` |
| `firstName` | Nombre | `"John"` |
| `lastName` | Apellido | `"Smith"` |
| `email` | Email | `"john@example.com"` |
| `phone` | Teléfono | `"+1-555-123-4567"` |
| `number` | Número (min-max) | `42` |
| `number:min-max` | Número en rango | `number:18-65` → `34` |
| `boolean` | true/false | `true` |
| `date` | Fecha ISO | `"2024-03-15"` |
| `datetime` | Datetime ISO | `"2024-03-15T10:30:00Z"` |
| `url` | URL | `"https://example.com"` |
| `avatar` | URL de avatar | `"https://avatars..."` |
| `address` | Dirección completa | `"123 Main St..."` |
| `city` | Ciudad | `"New York"` |
| `country` | País | `"United States"` |
| `company` | Empresa | `"Acme Corp"` |
| `job` | Trabajo | `"Software Engineer"` |
| `paragraph` | Párrafo lorem | `"Lorem ipsum..."` |
| `sentence` | Oración | `"Quick brown fox."` |
| `word` | Palabra | `"apple"` |
| `image` | URL placeholder | `"https://picsum..."` |
| `price` | Precio | `"49.99"` |
| `index` | Índice incremental | `1, 2, 3...` |

### Ejemplos de uso
```bash
# Básico - usuarios
data-gen -n 100 -f "id:uuid,name:fullName,email:email,age:number:18-65" -o users.json

# CSV output
data-gen -n 50 -f "id:index,company:company,city:city" -fmt csv -o companies.csv

# Pretty JSON
data-gen -n 5 -f "id:uuid,title:sentence,done:boolean" -p -o todos.json

# Desde schema file
data-gen -n 100 --schema user-schema.json -o users.json

# A stdout (para piping)
data-gen -n 10 -f "email:email" | jq '.[] | .email'

# Locale español
data-gen -n 20 -f "name:fullName,city:city" -l es -o usuarios.json
```

### Schema file (user-schema.json)
```json
{
  "fields": {
    "id": "uuid",
    "name": "fullName",
    "email": "email",
    "age": "number:18-65",
    "isActive": "boolean",
    "createdAt": "datetime"
  }
}
```

## Estructura de carpetas
```
data-gen/
├── bin/
│   └── data-gen.js           # Entry point CLI
├── src/
│   ├── generator.js          # Lógica principal generación
│   ├── field-parser.js       # Parsear definición de campos
│   ├── types.js              # Mapeo tipo → faker function
│   ├── formatters/
│   │   ├── json.js           # Output JSON
│   │   └── csv.js            # Output CSV
│   └── utils.js              # Helpers
├── tests/
│   ├── generator.test.js
│   └── field-parser.test.js
├── package.json
└── README.md
```

## Lógica principal
1. Parsear argumentos con Commander
2. Si `--schema`: leer archivo y extraer fields
3. Si `--fields`: parsear string de definición
4. Validar tipos de campos
5. Generar N registros usando Faker.js
6. Formatear como JSON o CSV
7. Escribir a archivo o stdout

## Validaciones
- Fields requerido (via flag o schema)
- Tipos deben ser válidos
- Count debe ser positivo (max 100000)
- Schema file debe existir y ser JSON válido

---

# 4. SERVE-JSON

## Descripción
CLI que convierte un archivo JSON en API REST completa con CRUD automático. Zero config.

## Paquetes
```json
{
  "dependencies": {
    "commander": "^12.0.0",
    "express": "^4.18.0",
    "chalk": "^5.3.0",
    "cors": "^2.8.5",
    "morgan": "^1.10.0",
    "lodash": "^4.17.21",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.0"
  }
}
```

## Comandos

### Comando principal: `serve-json <file>`
Levanta API REST desde archivo JSON.

### Opciones
| Flag | Alias | Descripción | Default |
|------|-------|-------------|---------|
| `--port` | `-p` | Puerto del servidor | `3000` |
| `--host` | `-h` | Host | `localhost` |
| `--watch` | `-w` | Watch mode (reload on change) | `false` |
| `--delay` | `-d` | Delay artificial (ms) | `0` |
| `--read-only` | `-ro` | Solo GET, sin modificaciones | `false` |
| `--no-cors` | | Deshabilitar CORS | `false` |
| `--static` | `-s` | Servir carpeta estática | `null` |
| `--id` | | Campo ID custom | `id` |
| `--quiet` | `-q` | Sin logs | `false` |

### Formato del JSON
```json
{
  "users": [
    { "id": 1, "name": "John", "email": "john@example.com" },
    { "id": 2, "name": "Jane", "email": "jane@example.com" }
  ],
  "posts": [
    { "id": 1, "title": "Hello", "userId": 1 },
    { "id": 2, "title": "World", "userId": 2 }
  ],
  "comments": []
}
```

Cada key del objeto raíz = un recurso REST.

### Endpoints generados automáticamente

Para cada recurso (ej: `users`):

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/users` | Listar todos |
| GET | `/users/:id` | Obtener uno |
| POST | `/users` | Crear nuevo |
| PUT | `/users/:id` | Actualizar completo |
| PATCH | `/users/:id` | Actualizar parcial |
| DELETE | `/users/:id` | Eliminar |

### Query params soportados
| Param | Descripción | Ejemplo |
|-------|-------------|---------|
| `_page` | Paginación | `?_page=2` |
| `_limit` | Items por página | `?_limit=10` |
| `_sort` | Ordenar por campo | `?_sort=name` |
| `_order` | Dirección orden | `?_order=desc` |
| `_search` | Búsqueda global | `?_search=john` |
| `field=value` | Filtro exacto | `?userId=1` |
| `field_like` | Filtro parcial | `?name_like=jo` |
| `field_gte` | Mayor o igual | `?age_gte=18` |
| `field_lte` | Menor o igual | `?age_lte=65` |

### Ejemplos de uso
```bash
# Básico
serve-json db.json
# API disponible en http://localhost:3000

# Puerto custom
serve-json db.json -p 8080

# Watch mode (recarga si cambia db.json)
serve-json db.json -w

# Delay para simular latencia
serve-json db.json -d 500

# Read only (solo GET)
serve-json db.json --read-only

# Con carpeta estática
serve-json db.json -s ./public
```

### Output al iniciar
```
  serve-json v1.0.0

  Resources:
    http://localhost:3000/users (3 items)
    http://localhost:3000/posts (2 items)
    http://localhost:3000/comments (0 items)

  Endpoints:
    GET    /users
    GET    /users/:id
    POST   /users
    PUT    /users/:id
    PATCH  /users/:id
    DELETE /users/:id
    ... (repeat for each resource)

  Press Ctrl+C to stop
```

## Estructura de carpetas
```
serve-json/
├── bin/
│   └── serve-json.js         # Entry point CLI
├── src/
│   ├── server.js             # Express server setup
│   ├── router.js             # Genera rutas dinámicas
│   ├── controllers/
│   │   ├── list.js           # GET all
│   │   ├── show.js           # GET one
│   │   ├── create.js         # POST
│   │   ├── update.js         # PUT/PATCH
│   │   └── destroy.js        # DELETE
│   ├── middleware/
│   │   ├── delay.js          # Delay artificial
│   │   └── query-parser.js   # Parsear query params
│   ├── db.js                 # Leer/escribir JSON
│   ├── watcher.js            # Watch file changes
│   └── utils.js              # Helpers
├── tests/
│   ├── server.test.js
│   └── controllers.test.js
├── package.json
└── README.md
```

## Lógica principal
1. Parsear argumentos con Commander
2. Leer y parsear JSON file
3. Extraer recursos (keys del objeto raíz)
4. Generar rutas CRUD para cada recurso
5. Iniciar Express server
6. Si watch: observar cambios en archivo
7. Manejar requests según método y recurso

## Validaciones
- Archivo debe existir
- Archivo debe ser JSON válido
- JSON debe ser objeto (no array)
- Cada recurso debe ser array
- Puerto debe ser número válido

## Persistencia
- Cambios (POST/PUT/PATCH/DELETE) se escriben al archivo JSON
- Si read-only: cambios solo en memoria

---

# RESUMEN DE DEPENDENCIAS COMUNES

| Paquete | Usado en | Propósito |
|---------|----------|-----------|
| commander | Todas | CLI parsing |
| chalk | Todas | Output colorido |
| sharp | qr-forge, placehold | Manipulación imágenes |
| qrcode | qr-forge | Generación QR |
| @faker-js/faker | data-gen | Datos falsos |
| express | serve-json | HTTP server |

---

# ORDEN DE DESARROLLO SUGERIDO

1. **qr-forge** (2-3 hrs) - Más simple, warm-up
2. **placehold** (3 hrs) - Similar a qr-forge, recicla sharp
3. **data-gen** (3-4 hrs) - Lógica de parsing campos
4. **serve-json** (4 hrs) - Más complejo, Express + CRUD

Total: ~12-14 hrs

---

# CHECKLIST POR TOOL

Para cada tool:
- [ ] npm init + instalar deps
- [ ] Crear estructura de carpetas
- [ ] Implementar CLI entry point
- [ ] Implementar lógica core
- [ ] Validaciones de input
- [ ] Mensajes de error claros
- [ ] Help command (automático con Commander)
- [ ] README con ejemplos
- [ ] Test básico
- [ ] Publicar en npm
