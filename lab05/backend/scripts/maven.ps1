param([Parameter(ValueFromRemainingArguments=$true)][string[]]$Goals)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $projectRoot
if (Test-Path 'C:\Program Files\Java\jdk-21') { $env:JAVA_HOME = 'C:\Program Files\Java\jdk-21' }
if (!$env:JAVA_HOME) { throw 'Set JAVA_HOME to JDK 21.' }
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
$maven = Get-Command mvn.cmd -ErrorAction SilentlyContinue
if ($maven) { $command = $maven.Source } else {
    $toolsRoot = Join-Path $env:LOCALAPPDATA 'SBA301Tools'
    $command = Join-Path $toolsRoot 'apache-maven-3.9.12\bin\mvn.cmd'
    if (!(Test-Path -LiteralPath $command)) {
        New-Item -ItemType Directory -Force -Path $toolsRoot | Out-Null
        $url = 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.12/apache-maven-3.9.12-bin.zip'
        $archive = Join-Path $toolsRoot 'maven.zip'
        Invoke-WebRequest -Uri $url -OutFile $archive
        $expected = ((Invoke-WebRequest -Uri ($url + '.sha512')).Content.Trim() -split '\s+')[0]
        if ((Get-FileHash -LiteralPath $archive -Algorithm SHA512).Hash.ToLowerInvariant() -ne $expected.ToLowerInvariant()) { throw 'Maven checksum mismatch.' }
        Expand-Archive -LiteralPath $archive -DestinationPath $toolsRoot -Force
    }
}
& $command @Goals
exit $LASTEXITCODE
