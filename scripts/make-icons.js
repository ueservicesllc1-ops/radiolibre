const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const psScript = `
Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Image]::FromFile('${path.resolve('public/icon.png').replace(/\\/g, '\\\\')}')

# 1. 512x512 Transparent
$bmp1 = New-Object System.Drawing.Bitmap 512, 512
$g1 = [System.Drawing.Graphics]::FromImage($bmp1)
$g1.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g1.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g1.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g1.Clear([System.Drawing.Color]::Transparent)

# Centered padding
$pad = 20
$g1.DrawImage($src, $pad, $pad, 512 - ($pad * 2), 512 - ($pad * 2))
$bmp1.Save('${path.resolve('builds/icon-512x512.png').replace(/\\/g, '\\\\')}', [System.Drawing.Imaging.ImageFormat]::Png)
$g1.Dispose()
$bmp1.Dispose()

# 2. 512x512 White Background (Google Play recommended)
$bmp2 = New-Object System.Drawing.Bitmap 512, 512
$g2 = [System.Drawing.Graphics]::FromImage($bmp2)
$g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g2.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g2.Clear([System.Drawing.Color]::White)
$g2.DrawImage($src, $pad, $pad, 512 - ($pad * 2), 512 - ($pad * 2))
$bmp2.Save('${path.resolve('builds/icon-512x512-white.png').replace(/\\/g, '\\\\')}', [System.Drawing.Imaging.ImageFormat]::Png)
$g2.Dispose()
$bmp2.Dispose()

# 3. 1024x500 Feature Graphic (Gráfico de funciones)
$bmp3 = New-Object System.Drawing.Bitmap 1024, 500
$g3 = [System.Drawing.Graphics]::FromImage($bmp3)
$g3.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g3.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g3.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$rect = New-Object System.Drawing.Rectangle 0, 0, 1024, 500
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, ([System.Drawing.Color]::FromArgb(255, 17, 17, 17)), ([System.Drawing.Color]::FromArgb(255, 30, 30, 30)), 45.0
$g3.FillRectangle($brush, $rect)
$brush.Dispose()

$logoH = 380
$logoW = [int]($src.Width * ($logoH / $src.Height))
$logoX = [int]((1024 - $logoW) / 2)
$logoY = [int]((500 - $logoH) / 2)
$g3.DrawImage($src, $logoX, $logoY, $logoW, $logoH)
$bmp3.Save('${path.resolve('builds/feature-graphic-1024x500.png').replace(/\\/g, '\\\\')}', [System.Drawing.Imaging.ImageFormat]::Png)
$g3.Dispose()
$bmp3.Dispose()

$src.Dispose()
Write-Host "GENERATED_ALL_ASSETS"
`;

fs.writeFileSync(path.resolve('scripts/gen.ps1'), psScript);
const out = execSync('powershell -ExecutionPolicy Bypass -File scripts/gen.ps1', { encoding: 'utf-8' });
console.log(out);
