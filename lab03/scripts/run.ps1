
param([ValidateSet('run','test','package')][string]$Task='run',[switch]$SqlServer)
$ErrorActionPreference='Stop'
$projectRoot=Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $projectRoot
if(Test-Path 'C:\Program Files\Java\jdk-21'){ $env:JAVA_HOME='C:\Program Files\Java\jdk-21' }
if(!$env:JAVA_HOME){ throw 'Set JAVA_HOME to JDK 21 before running this script.' }
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"
$toolsRoot=Join-Path $env:LOCALAPPDATA 'SBA301Tools'
New-Item -ItemType Directory -Force -Path $toolsRoot | Out-Null
$mavenCommand=Get-Command mvn.cmd -ErrorAction SilentlyContinue
if($mavenCommand){ $maven=$mavenCommand.Source }else{
    $maven=Join-Path $toolsRoot 'apache-maven-3.9.12\bin\mvn.cmd'
    if(!(Test-Path -LiteralPath $maven)){
        $url='https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.12/apache-maven-3.9.12-bin.zip'
        $archive=Join-Path $toolsRoot 'maven.zip'
        Invoke-WebRequest -Uri $url -OutFile $archive
        $expected=((Invoke-WebRequest -Uri ($url+'.sha512')).Content.Trim() -split '\s+')[0]
        if((Get-FileHash -LiteralPath $archive -Algorithm SHA512).Hash.ToLowerInvariant() -ne $expected.ToLowerInvariant()){ throw 'Maven checksum mismatch.' }
        Expand-Archive -LiteralPath $archive -DestinationPath $toolsRoot -Force
    }
}

[string[]]$mavenArgs=switch($Task){'run'{@('spring-boot:run')};'test'{@('clean','test')};'package'{@('clean','verify')}}
& $maven @mavenArgs
exit $LASTEXITCODE
