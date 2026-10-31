Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Freedom Labs\.gemini\antigravity-ide\brain\06a7126a-a18d-4dc1-96b7-60b63b0a334a\.user_uploaded\media_1793101530176.jpg"
$rawSrc = [System.Drawing.Bitmap]::FromFile($srcPath)

$minX = $rawSrc.Width
$minY = $rawSrc.Height
$maxX = 0
$maxY = 0

for ($y = 0; $y -lt $rawSrc.Height; $y++) {
    for ($x = 0; $x -lt $rawSrc.Width; $x++) {
        $c = $rawSrc.GetPixel($x, $y)
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

$cW = $maxX - $minX + 1
$cH = $maxY - $minY + 1
Write-Host "Detected Content: minX=$minX, minY=$minY, w=$cW, h=$cH"

$srcContent = New-Object System.Drawing.Bitmap $cW, $cH
$gCrop = [System.Drawing.Graphics]::FromImage($srcContent)
$gCrop.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gCrop.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gCrop.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$rectDest = New-Object System.Drawing.Rectangle 0, 0, $cW, $cH
$rectSrc = New-Object System.Drawing.Rectangle $minX, $minY, $cW, $cH
$gCrop.DrawImage($rawSrc, $rectDest, $rectSrc, [System.Drawing.GraphicsUnit]::Pixel)
$gCrop.Dispose()
$rawSrc.Dispose()

function Generate-IconFile {
    param(
        [int]$width,
        [int]$height,
        [double]$scaleRatio,
        [string]$outputPath,
        [System.Drawing.Color]$backgroundColor
    )
    $bmp = New-Object System.Drawing.Bitmap $width, $height
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear($backgroundColor)

    $targetDim = [Math]::Min($width, $height) * $scaleRatio
    $scale = [Math]::Min($targetDim / $cW, $targetDim / $cH)
    $drawW = [int]($cW * $scale)
    $drawH = [int]($cH * $scale)
    $drawX = [int](($width - $drawW) / 2)
    $drawY = [int](($height - $drawH) / 2)

    $g.DrawImage($srcContent, $drawX, $drawY, $drawW, $drawH)
    $g.Dispose()

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Generated: $outputPath (${width}x${height}, content=${drawW}x${drawH})"
}

# 1. Master icon for Capacitor (1024x1024, ratio ~0.82)
Generate-IconFile 1024 1024 0.82 "E:\RadioLibre\assets\icon.png" ([System.Drawing.Color]::White)
Generate-IconFile 1024 1024 0.82 "E:\RadioLibre\public\icon.png" ([System.Drawing.Color]::White)

# 2. Play Store 512x512 icon (ratio ~0.78 for safe rounded squircle corners)
Generate-IconFile 512 512 0.78 "E:\RadioLibre\builds\playstore-icon-512x512.png" ([System.Drawing.Color]::White)
Generate-IconFile 512 512 0.78 "E:\RadioLibre\builds\icon-512x512-white.png" ([System.Drawing.Color]::White)
Generate-IconFile 512 512 0.78 "E:\RadioLibre\builds\icon-512x512.png" ([System.Drawing.Color]::White)

# 3. Google Play Feature Graphic (1024 x 500)
$fgBmp = New-Object System.Drawing.Bitmap 1024, 500
$fgG = [System.Drawing.Graphics]::FromImage($fgBmp)
$fgG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$fgG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$fgG.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Dark luxury background
$bgRect = New-Object System.Drawing.Rectangle 0, 0, 1024, 500
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $bgRect, ([System.Drawing.Color]::FromArgb(255, 12, 12, 14)), ([System.Drawing.Color]::FromArgb(255, 25, 25, 30)), 45.0
$fgG.FillRectangle($brush, $bgRect)
$brush.Dispose()

# Clean circular badge in center
$badgeD = 410
$badgeX = [int]((1024 - $badgeD) / 2)
$badgeY = [int]((500 - $badgeD) / 2)
$whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$fgG.FillEllipse($whiteBrush, $badgeX, $badgeY, $badgeD, $badgeD)
$whiteBrush.Dispose()

# Yellow subtle accent ring around badge
$yellowPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 255, 204, 0)), 4.0
$fgG.DrawEllipse($yellowPen, ($badgeX - 6), ($badgeY - 6), ($badgeD + 12), ($badgeD + 12))
$yellowPen.Dispose()

# Draw logo inside circular badge
$logoScale = [Math]::Min(($badgeD * 0.82) / $cW, ($badgeD * 0.82) / $cH)
$logoW = [int]($cW * $logoScale)
$logoH = [int]($cH * $logoScale)
$logoX = [int]((1024 - $logoW) / 2)
$logoY = [int]((500 - $logoH) / 2)
$fgG.DrawImage($srcContent, $logoX, $logoY, $logoW, $logoH)

$fgG.Dispose()
$fgBmp.Save("E:\RadioLibre\builds\playstore-feature-graphic-1024x500.png", [System.Drawing.Imaging.ImageFormat]::Png)
$fgBmp.Save("E:\RadioLibre\builds\feature-graphic-1024x500.png", [System.Drawing.Imaging.ImageFormat]::Png)
$fgBmp.Dispose()
Write-Host "Generated: E:\RadioLibre\builds\playstore-feature-graphic-1024x500.png"

$srcContent.Dispose()
Write-Host "All icons generated successfully!"
