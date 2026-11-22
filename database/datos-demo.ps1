
param(
  [ValidateSet('usuarios', 'datos')]
  [string]$Fase = 'usuarios'
)

$ErrorActionPreference = 'Stop'
$base = 'http://localhost:3000'
$clave = 'Demo12345!'

function Api($ruta, $metodo, $datos, $token = '') {
  $headers = @{}

  if ($token) {
    $headers.Authorization = "Bearer $token"
  }

  $opciones = @{
    Uri = "$base$ruta"
    Method = $metodo
    Headers = $headers
    ContentType = 'application/json'
  }

  if ($null -ne $datos) {
    $opciones.Body = ($datos | ConvertTo-Json -Depth 10)
  }

  Invoke-RestMethod @opciones
}

if ($Fase -eq 'usuarios') {
  foreach ($n in @('admin', 'ana', 'bruno', 'carla')) {
    Api '/auth/registro' 'POST' @{
      nombre = "Demo $n"
      alias = "demo-$n"
      correo = "$n@example.test"
      password = $clave
    } | Out-Null
  }

  Write-Output 'Usuarios creados. Promover admin en Workbench antes de fase datos.'
  exit
}

function Login($correo) {
  (Api '/auth/login' 'POST' @{
    correo = $correo
    password = $clave
  }).access_token
}

$admin = Login 'admin@example.test'

if ((Api '/auth/yo' 'GET' $null $admin).rol -ne 'ADMIN') {
  throw 'Promover primero la cuenta demo admin a ADMIN en Workbench.'
}

$equipos = @()
$nombres = @('Dragones', 'Halcones', 'Titanes', 'Lobos')

$correos = @(
  'ana@example.test',
  'bruno@example.test',
  'carla@example.test',
  'ana@example.test'
)

for ($i = 0; $i -lt 4; $i++) {
  $sesion = Login $correos[$i]

  $equipos += Api '/equipos' 'POST' @{
    nombre = $nombres[$i]
    juegoPreferido = 'Rocket League'
    estado = 'ACTIVO'
    integrantesCorreos = @($correos[$i])
  } $sesion
}

$ahora = Get-Date
$torneos = @()

foreach ($juego in @('Rocket League', 'EA FC')) {
  $torneos += Api '/torneos' 'POST' @{
    nombre = "Demo $juego"
    videojuego = $juego
    modalidad = 'LIGA'
    fechaInicio = $ahora.AddDays(2).ToUniversalTime().ToString('o')
    cierreInscripcion = $ahora.AddDays(1).ToUniversalTime().ToString('o')
    cupoMaximo = 4
    estado = 'ABIERTO'
  } $admin
}

foreach ($t in $torneos) {
  foreach ($e in $equipos) {
    Api '/inscripciones' 'POST' @{
      torneoId = $t.id
      equipoId = $e.id
    } $admin | Out-Null
  }
}

$escenarios = @(
  @{ t = 0; a = 0; b = 1; local = 3; visitante = 1 },
  @{ t = 0; a = 2; b = 3; local = 2; visitante = 2 },
  @{ t = 1; a = 0; b = 2; local = 0; visitante = 1 }
)

foreach ($s in $escenarios) {
  $p = Api '/partidos' 'POST' @{
    torneoId = $torneos[$s.t].id
    equipoLocalId = $equipos[$s.a].id
    equipoVisitanteId = $equipos[$s.b].id
    fechaHora = $ahora.AddDays(2).AddHours(1).ToUniversalTime().ToString('o')
    ronda = 1
  } $admin

  Api "/partidos/$($p.id)/resultado" 'PUT' @{
    puntajeLocal = $s.local
    puntajeVisitante = $s.visitante
  } $admin | Out-Null
}

Api "/torneos/$($torneos[1].id)" 'PATCH' @{
  estado = 'CERRADO'
} $admin | Out-Null

foreach ($t in $torneos) {
  Write-Output "Torneo $($t.id): $($t.nombre)"
  Api "/ranking/$($t.id)" 'GET' $null $admin | Format-Table
}
