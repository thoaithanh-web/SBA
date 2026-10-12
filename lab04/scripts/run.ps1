
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

if($SqlServer){ $env:SQLSERVER_TESTS='true' }
if(($Task -eq 'run' -or $SqlServer) -and !$env:DB_URL){
    $dbName=if($SqlServer){'SBA_Lab04_Test'}else{'SBA_Lab04_Orchid'}
    $env:DB_URL="jdbc:sqlserver://localhost:1433;databaseName=$dbName;encrypt=true;trustServerCertificate=true;integratedSecurity=true"
    $driver=Join-Path $toolsRoot 'mssql-jdbc_auth-12.10.2.x64.dll'
    if(!(Test-Path -LiteralPath $driver)){
        Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/com/microsoft/sqlserver/mssql-jdbc_auth/12.10.2.x64/mssql-jdbc_auth-12.10.2.x64.dll' -OutFile $driver
    }
    $env:JAVA_TOOL_OPTIONS="$env:JAVA_TOOL_OPTIONS -Djava.library.path=`"$toolsRoot`""
    if(Get-Command sqlcmd -ErrorAction SilentlyContinue){
        & sqlcmd -S 'tcp:localhost,1433' -E -C -b -Q "IF DB_ID(N'$dbName') IS NULL CREATE DATABASE [$dbName];"
        if($LASTEXITCODE -ne 0){ throw 'Unable to prepare the lab database. Configure DB_URL, DB_USERNAME and DB_PASSWORD for your SQL Server instance.' }
    }
}

[string[]]$mavenArgs=switch($Task){'run'{@('spring-boot:run')};'test'{@('clean','test')};'package'{@('clean','verify')}}
& $maven @mavenArgs
exit $LASTEXITCODE
