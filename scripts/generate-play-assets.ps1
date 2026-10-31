Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "..\assets\icon.png"
if (-not (Test-Path $srcPath)) {
    $srcPath = Join-Path $PSScriptRoot "..\public\icon.png"
}

$srcImage = [System.Drawing.Image]::FromFile((Resolve-Path $srcPath))
Write-Host "Source image loaded: $($srcImage.Width) x $($srcImage.Height)"

# 1. Generate 512x512 Google Play Icon (Transparent / Sleek Dark / White)
function Create-Icon512([string]$outputPath, [System.Drawing.Color]$bgColor, [bool]$transparent = $false) {
    $targetSize = 512
    $bitmap = New-Object System.Drawing.Bitmap $targetSize, $targetSize
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    if ($transparent) {
        $graphics.Clear([System.Drawing.Color]::Transparent)
    } else {
        $graphics.Clear($bgColor)
    }
    
    # Fit inside with 10% padding
    $pad = 28
    $drawW = $targetSize - ($pad * 2)
    $drawH = $targetSize - ($pad * 2)
    $graphics.DrawImage($srcImage, $pad, $pad, $drawW, $drawH)
    
    $graphics.Dispose()
    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bitmap.Dispose()
    Write-Host "Generated: $outputPath (512x512)"
}

# 2. Generate 1024x500 Google Play Feature Graphic
function Create-FeatureGraphic([string]$outputPath) {
    $targetW = 1024
    $targetH = 500
    $bitmap = New-Object System.Drawing.Bitmap $targetW, $targetH
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # Background: Dark sleek gradient
    $rect = New-Object System.Drawing.Rectangle 0, 0, $targetW, $targetH
    $colorStart = [System.Drawing.Color]::FromArgb(255, 17, 17, 17)
    $colorEnd = [System.Drawing.Color]::FromArgb(255, 28, 28, 30)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $colorStart, $colorEnd, 45.0
    $graphics.FillRectangle($brush, $rect)
    $brush.Dispose()
    
    # Draw centered logo
    $logoH = 380
    $logoW = [int]($srcImage.Width * ($logoH / $srcImage.Height))
    $logoX = [int](($targetW - $logoW) / 2)
    $logoY = [int](($targetH - $logoH) / 2)
    $graphics.DrawImage($srcImage, $logoX, $logoY, $logoW, $logoH)
    
    $graphics.Dispose()
    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bitmap.Dispose()
    Write-Host "Generated: $outputPath (1024x500)"
}

$buildsDir = Join-Path $PSScriptRoot "..\builds"
if (-not (Test-Path $buildsDir)) { New-Item -ItemType Directory -Path $buildsDir }

# Generate variations
Create-Icon512 (Join-Path $buildsDir "playstore-icon-512x512.png") ([System.Drawing.Color]::FromArgb(255, 255, 255, 255)) $false
Create-Icon512 (Join-Path $buildsDir "playstore-icon-dark-512x512.png") ([System.Drawing.Color]::FromArgb(255, 17, 17, 17)) $false
Create-Icon512 (Join-Path $buildsDir "playstore-icon-transparent-512x512.png") ([System.Drawing.Color]::Transparent) $true
Create-FeatureGraphic (Join-Path $buildsDir "playstore-feature-graphic-1024x500.png")

$srcImage.Dispose()
Write-Host "All Play Store assets successfully generated!"
