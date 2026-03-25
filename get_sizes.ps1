Add-Type -AssemblyName System.Drawing;
$files = @("01.jpg.jpeg","02.jpg.jpeg","04.jpg.jpeg","07.jpg.jpeg","IMG_1277.JPG.jpeg","IMG_1278.JPG.jpeg","IMG_1291.JPG.jpeg","IMG_1294.JPG.jpeg");
foreach($f in $files) {
  $p = Join-Path "d:\Clinix\SmileCraft\assets\images" $f;
  if(Test-Path $p) {
    try {
      $img = [System.Drawing.Image]::FromFile($p);
      Write-Host "$f : $($img.Width)x$($img.Height)";
      $img.Dispose();
    } catch {
      Write-Host "$f : error"
    }
  } else {
    Write-Host "$f : not found"
  }
}
