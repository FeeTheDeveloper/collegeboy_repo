param([string]$Source = 'output/college-boy-opening/arrival-headon-master.mp4')
$ErrorActionPreference = 'Stop'
$encoder = (python -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())").Trim()
if (-not (Test-Path -LiteralPath $Source)) { throw "Opening source is missing: $Source" }
$audioMix = '[0:a]volume=0.18[bed];[1:a]highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=7,adelay=2500|2500[voice];[bed][voice]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.891[mix]'
& $encoder -hide_banner -loglevel error -y -i $Source -i output/college-boy-opening/narration.mp3 -filter_complex $audioMix -map 0:v:0 -map '[mix]' -c:v libx264 -crf 22 -preset medium -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart public/media/college-boy-opening.mp4
if ($LASTEXITCODE -ne 0) { throw 'Opening video encoding failed.' }
& $encoder -hide_banner -loglevel error -y -ss 0 -i $Source -frames:v 1 -q:v 2 public/media/college-boy-opening-poster.jpg
if ($LASTEXITCODE -ne 0) { throw 'Poster extraction failed.' }
$brand = "[0:v]tpad=stop_mode=clone:stop_duration=2,drawbox=x=0:y=0:w=iw:h=ih:color=0x130f0f@0.82:t=fill:enable='gte(t,6)'[base];[1:v]scale=250:-1[logo];[base][logo]overlay=x=(W-w)/2:y=110:enable='gte(t,6)',drawtext=fontfile='C\:/Windows/Fonts/impact.ttf':text='REAL PHILLY':fontcolor=0xf8efdf:fontsize=78:x=(w-tw)/2:y=300:enable='gte(t,6)',drawtext=fontfile='C\:/Windows/Fonts/impact.ttf':text='CHEESESTEAKS.':fontcolor=0xffcc45:fontsize=78:x=(w-tw)/2:y=390:enable='gte(t,6)',drawtext=fontfile='C\:/Windows/Fonts/arialbd.ttf':text='FROM REAL PHILADELPHIANS.':fontcolor=0xf8efdf:fontsize=24:x=(w-tw)/2:y=505:enable='gte(t,6)'[branded]"
& $encoder -hide_banner -loglevel error -y -i public/media/college-boy-opening.mp4 -i public/media/college-boy-truck-logo-v2.png -filter_complex $brand -map '[branded]' -map 0:a -af apad=pad_dur=2 -t 10 -c:v libx264 -crf 21 -preset medium -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart public/media/college-boy-opening-branded.mp4
if ($LASTEXITCODE -ne 0) { throw 'Branded export encoding failed.' }
Write-Output 'Rendered opening, poster, and standalone branded export.'
