param([switch]$CheckOriginals, [switch]$CheckBackups)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot
$manifest = Get-Content -LiteralPath (Join-Path $root 'docs\provenance.json') -Raw | ConvertFrom-Json
function Read-Git([string]$directory, [string[]]$arguments) {
    $result = & git --no-optional-locks -C $directory @arguments
    if ($LASTEXITCODE -ne 0) { throw "Git operation failed: $($arguments[0])" }
    return ($result -join "`n").Trim()
}
foreach ($source in $manifest.sources) {
    $tree = Read-Git $root @('rev-parse',"HEAD:$($source.prefix)")
    if ($tree -ne $source.tree) { throw "Committed $($source.prefix) tree changed since import." }
    Read-Git $root @('diff','--exit-code','HEAD','--',$source.prefix) | Out-Null
    Read-Git $root @('merge-base','--is-ancestor',$source.head,'HEAD') | Out-Null
    foreach ($reference in $source.refs) {
        $archive="refs/archive/$($source.prefix)/$($reference.ref.Substring(5))"
        if ((Read-Git $root @('rev-parse',$archive)) -ne $reference.oid) { throw "Archived reference mismatch: $archive" }
    }
    if ($CheckOriginals) {
        if ((Read-Git $source.source @('rev-parse','HEAD')) -ne $source.head) { throw 'Original HEAD changed.' }
        if ((Read-Git $source.source @('status','--porcelain=v1')) -ne '') { throw 'Original working tree changed.' }
        if ((Read-Git $source.source @('config','--get','remote.origin.url')) -ne $source.origin) { throw 'Original remote changed.' }
        foreach ($reference in $source.refs) {
            if ((Read-Git $source.source @('rev-parse',$reference.ref)) -ne $reference.oid) { throw 'Original reference changed.' }
        }
    }
    if ($CheckBackups) {
        $hash=(Get-FileHash -LiteralPath $source.bundle -Algorithm SHA256).Hash.ToLowerInvariant()
        if($hash -ne $source.bundleSha256) { throw 'Backup checksum mismatch.' }
        Read-Git $root @('bundle','verify',$source.bundle) | Out-Null
    }
    Write-Output "PASS: $($source.prefix) content, ancestry and archived references"
}
Read-Git $root @('fsck','--full') | Out-Null
Write-Output 'PASS: Git object integrity'
