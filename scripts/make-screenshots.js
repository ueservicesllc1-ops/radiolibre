const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const psScript = `
Add-Type -AssemblyName System.Drawing

$logoPath = '${path.resolve('public/icon.png').replace(/\\/g, '\\\\')}'
$logoImg = [System.Drawing.Image]::FromFile($logoPath)

$w = 1080
$h = 1920

function Create-BasePhoneBitmap {
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    
    # Background: Dark sleek modern theme
    $rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
    $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 15, 15, 17))
    $g.FillRectangle($bgBrush, $rect)
    $bgBrush.Dispose()
    
    # Status bar area
    $timeFont = New-Object System.Drawing.Font ("Segoe UI", [float]28, [System.Drawing.FontStyle]::Bold)
    $whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $g.DrawString("9:39", $timeFont, $whiteBrush, 60, 30)
    
    # Header Navbar
    $navFont = New-Object System.Drawing.Font ("Segoe UI", [float]36, [System.Drawing.FontStyle]::Bold)
    $yellowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 199, 0))
    $g.DrawString("RADIO LIBRE", $navFont, $whiteBrush, 60, 110)
    $g.DrawString("93.9 FM", $navFont, $yellowBrush, 360, 110)
    
    $subFont = New-Object System.Drawing.Font ("Segoe UI", [float]20, [System.Drawing.FontStyle]::Regular)
    $grayBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 160, 160, 165))
    $g.DrawString("Guayaquil - Los Rios, Ecuador", $subFont, $grayBrush, 60, 165)
    
    $timeFont.Dispose()
    $navFont.Dispose()
    $subFont.Dispose()
    $whiteBrush.Dispose()
    $yellowBrush.Dispose()
    $grayBrush.Dispose()
    
    return @($bmp, $g)
}

# --- SCREENSHOT 1: REPRODUCTOR EN VIVO ---
$s1 = Create-BasePhoneBitmap
$bmp1 = $s1[0]; $g1 = $s1[1]

$badgeFont = New-Object System.Drawing.Font ("Segoe UI", [float]22, [System.Drawing.FontStyle]::Bold)
$redBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 239, 68, 68))
$whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$g1.DrawString("TRANSMISION EN VIVO 24/7", $badgeFont, $redBrush, 60, 240)

$logoRect = New-Object System.Drawing.Rectangle 190, 330, 700, 630
$cardBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 24, 24, 28))
$cardRect = New-Object System.Drawing.Rectangle 60, 300, 960, 920
$g1.FillRectangle($cardBg, $cardRect)
$g1.DrawImage($logoImg, $logoRect)

$progTitleFont = New-Object System.Drawing.Font ("Segoe UI", [float]42, [System.Drawing.FontStyle]::Bold)
$progSubFont = New-Object System.Drawing.Font ("Segoe UI", [float]26, [System.Drawing.FontStyle]::Regular)
$yellowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 199, 0))
$grayBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 180, 180, 185))

$g1.DrawString("Despierta Libre", $progTitleFont, $whiteBrush, 100, 950)
$g1.DrawString("Conduccion: Equipo Radio Libre  |  07:00 - 10:00", $progSubFont, $grayBrush, 100, 1015)

$playBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 199, 0))
$g1.FillEllipse($playBrush, 470, 1080, 140, 140)
$p1 = New-Object System.Drawing.Point 530, 1120
$p2 = New-Object System.Drawing.Point 530, 1180
$p3 = New-Object System.Drawing.Point 575, 1150
$darkBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 17, 17, 17))
$g1.FillPolygon($darkBrush, @($p1, $p2, $p3))

$featBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 28, 28, 34))
$featRect = New-Object System.Drawing.Rectangle 60, 1260, 960, 560
$g1.FillRectangle($featBg, $featRect)

$tagTitleFont = New-Object System.Drawing.Font ("Segoe UI", [float]32, [System.Drawing.FontStyle]::Bold)
$tagDescFont = New-Object System.Drawing.Font ("Segoe UI", [float]24, [System.Drawing.FontStyle]::Regular)

$g1.DrawString("Audio Digital HD sin cortes", $tagTitleFont, $yellowBrush, 100, 1310)
$g1.DrawString("- Reproduccion continua en segundo plano", $tagDescFont, $whiteBrush, 100, 1380)
$g1.DrawString("- Compatible con pantalla de bloqueo y notificaciones", $tagDescFont, $whiteBrush, 100, 1440)
$g1.DrawString("- Minimo consumo de datos moviles", $tagDescFont, $whiteBrush, 100, 1500)
$g1.DrawString("- Conexion directa a cabina de transmision", $tagDescFont, $whiteBrush, 100, 1560)

$g1.Dispose()
$bmp1.Save('${path.resolve('builds/screenshot-1-player.png').replace(/\\/g, '\\\\')}', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp1.Dispose()

# --- SCREENSHOT 2: PROGRAMACIÓN ---
$s2 = Create-BasePhoneBitmap
$bmp2 = $s2[0]; $g2 = $s2[1]

$titleFont = New-Object System.Drawing.Font ("Segoe UI", [float]44, [System.Drawing.FontStyle]::Bold)
$g2.DrawString("Parrilla de Programacion", $titleFont, $whiteBrush, 60, 240)

$cardY = 330
$programs = @(
    @("07:00 - 10:00", "Despierta Libre", "Noticias, opinion y debate de actualidad"),
    @("10:00 - 13:00", "Conexion 93.9", "Los mejores exitos musicales y entrevistas"),
    @("13:00 - 15:00", "Tribuna Libre", "Deportes, futbol nacional e internacional"),
    @("15:00 - 18:00", "Tardes de Exitos", "Musica variada, complacencias y entretenimiento"),
    @("18:00 - 20:00", "Radio Libre Noticias", "Resumen informativo y analisis del dia")
)

$timeBadgeBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 199, 0))
$timeF = New-Object System.Drawing.Font ("Segoe UI", [float]24, [System.Drawing.FontStyle]::Bold)
$pNameF = New-Object System.Drawing.Font ("Segoe UI", [float]32, [System.Drawing.FontStyle]::Bold)
$pDescF = New-Object System.Drawing.Font ("Segoe UI", [float]22, [System.Drawing.FontStyle]::Regular)

foreach ($item in $programs) {
    $cRect = New-Object System.Drawing.Rectangle 60, $cardY, 960, 230
    $cBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 25, 25, 30))
    $g2.FillRectangle($cBrush, $cRect)
    
    $g2.DrawString($item[0], $timeF, $timeBadgeBrush, 100, ($cardY + 30))
    $g2.DrawString($item[1], $pNameF, $whiteBrush, 100, ($cardY + 75))
    $g2.DrawString($item[2], $pDescF, $grayBrush, 100, ($cardY + 140))
    
    $cBrush.Dispose()
    $cardY += 260
}

$g2.Dispose()
$bmp2.Save('${path.resolve('builds/screenshot-2-programming.png').replace(/\\/g, '\\\\')}', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp2.Dispose()

# --- SCREENSHOT 3: NOTICIAS Y ACTUALIDAD ---
$s3 = Create-BasePhoneBitmap
$bmp3 = $s3[0]; $g3 = $s3[1]

$g3.DrawString("Noticias & Actualidad", $titleFont, $whiteBrush, 60, 240)

$newsList = @(
    @("Ecuador", "Avances en infraestructura y conectividad nacional", "Ultimo minuto"),
    @("Deportes", "Liga Pro: Resumen de la jornada y tabla de posiciones", "Futbol"),
    @("Comunidad", "Radio Libre presente en los eventos de la provincia", "Los Rios"),
    @("Cultura", "Musica nacional e internacional en la senal lider", "Entretenimiento")
)

$tagBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 199, 0))
$tagF = New-Object System.Drawing.Font ("Segoe UI", [float]22, [System.Drawing.FontStyle]::Bold)
$newsHeadF = New-Object System.Drawing.Font ("Segoe UI", [float]32, [System.Drawing.FontStyle]::Bold)
$srcF = New-Object System.Drawing.Font ("Segoe UI", [float]22, [System.Drawing.FontStyle]::Regular)

$nY = 330
foreach ($item in $newsList) {
    $cRect = New-Object System.Drawing.Rectangle 60, $nY, 960, 310
    $cBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 25, 25, 30))
    $g3.FillRectangle($cBrush, $cRect)
    
    $g3.DrawString($item[0].ToUpper(), $tagF, $tagBrush, 100, ($nY + 35))
    $g3.DrawString($item[1], $newsHeadF, $whiteBrush, 100, ($nY + 85))
    $g3.DrawString("Fuente: Radio Libre 93.9 FM  |  " + $item[2], $srcF, $grayBrush, 100, ($nY + 210))
    
    $cBrush.Dispose()
    $nY += 345
}

$g3.Dispose()
$bmp3.Save('${path.resolve('builds/screenshot-3-news.png').replace(/\\/g, '\\\\')}', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp3.Dispose()

# --- SCREENSHOT 4: LOCUTORES, STAFF & CONTACTO ---
$s4 = Create-BasePhoneBitmap
$bmp4 = $s4[0]; $g4 = $s4[1]

$g4.DrawString("Locutores & Comunidad", $titleFont, $whiteBrush, 60, 240)

$staffList = @(
    @("Staff de Cabina", "Voces que te acompanan todos los dias", "En Vivo 93.9 FM"),
    @("Participacion Ciudadana", "Envianos tus saludos, opiniones y mensajes", "WhatsApp & Redes"),
    @("Rendicion de Cuentas", "Transparencia e informes anuales a la comunidad", "Institucional"),
    @("Siguenos en Redes", "Instagram, Facebook, TikTok y canal de YouTube", "@radiolibre93.9")
)

$sY = 330
foreach ($item in $staffList) {
    $cRect = New-Object System.Drawing.Rectangle 60, $sY, 960, 310
    $cBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 25, 25, 30))
    $g4.FillRectangle($cBrush, $cRect)
    
    $g4.DrawString($item[2].ToUpper(), $tagF, $tagBrush, 100, ($sY + 35))
    $g4.DrawString($item[0], $newsHeadF, $whiteBrush, 100, ($sY + 85))
    $g4.DrawString($item[1], $srcF, $grayBrush, 100, ($sY + 210))
    
    $cBrush.Dispose()
    $sY += 345
}

$g4.Dispose()
$bmp4.Save('${path.resolve('builds/screenshot-4-community.png').replace(/\\/g, '\\\\')}', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp4.Dispose()

$logoImg.Dispose()
Write-Host "ALL_4_SCREENSHOTS_GENERATED"
`;

fs.writeFileSync(path.resolve('scripts/gen-screenshots.ps1'), psScript);
const out = execSync('powershell -ExecutionPolicy Bypass -File scripts/gen-screenshots.ps1', { encoding: 'utf-8' });
console.log(out);
