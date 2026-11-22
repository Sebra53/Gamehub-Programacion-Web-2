
param(
  [int]$TorneoId = 8
)

$ErrorActionPreference = 'Stop'
$base = 'http://localhost:3000'

# Obtener el token del administrador de demostración
$login = Invoke-RestMethod `
  -Uri "$base/auth/login" `
  -Method POST `
  -ContentType 'application/json' `
  -Body (@{
    correo = 'admin@example.test'
    password = 'Demo12345!'
  } | ConvertTo-Json)

$token = $login.access_token

# Archivo temporal para liberar ambas peticiones juntas
$gate = Join-Path $env:TEMP "gamehub-b06-$PID.gate"

Remove-Item $gate -ErrorAction SilentlyContinue

$jobs = @()

foreach ($equipoId in @(2, 3)) {
  $jobs += Start-Job -ArgumentList $TorneoId, $equipoId, $token, $gate, $base -ScriptBlock {
    param($torneoId, $equipoId, $token, $gate, $base)

    while (-not (Test-Path $gate)) {
      Start-Sleep -Milliseconds 20
    }

    try {
      $respuesta = Invoke-WebRequest `
        -Uri "$base/inscripciones" `
        -Method POST `
        -UseBasicParsing `
        -Headers @{ Authorization = "Bearer $token" } `
        -ContentType 'application/json' `
        -Body (@{
          torneoId = $torneoId
          equipoId = $equipoId
        } | ConvertTo-Json)

      [pscustomobject]@{
        Equipo = $equipoId
        Codigo = [int]$respuesta.StatusCode
      }
    }
    catch {
      $codigo = if ($_.Exception.Response) {
        [int]$_.Exception.Response.StatusCode
      } else {
        'ERROR'
      }

      [pscustomobject]@{
        Equipo = $equipoId
        Codigo = $codigo
      }
    }
  }
}

# Dar tiempo a los dos procesos para prepararse
Start-Sleep -Seconds 3

# Liberar ambas peticiones
New-Item -ItemType File -Path $gate -Force | Out-Null

$jobs | Wait-Job | Receive-Job
$jobs | Remove-Job

Remove-Item $gate -ErrorAction SilentlyContinue
