# ============================================================================
# Git Auto-Commit PowerShell Script voor Bros&Baits Project
# ============================================================================
# Gebruik: Rechtsklik op bestand → "Run with PowerShell" 
# Of: Open PowerShell in project directory → .\commit.ps1
# ============================================================================

Write-Host "" -ForegroundColor White
Write-Host "🚀 ================================" -ForegroundColor Cyan
Write-Host "🚀    Bros&Baits Git Auto-Commit" -ForegroundColor Cyan  
Write-Host "🚀 ================================" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White

# Stel working directory in op script locatie
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath
Write-Host "📁 Working directory: $scriptPath" -ForegroundColor Blue
Write-Host "" -ForegroundColor White

# Controleer of we in een git repository zitten
if (-not (Test-Path ".git")) {
    Write-Host "❌ [ERROR] Geen git repository gevonden!" -ForegroundColor Red
    Write-Host "💡 Zorg ervoor dat dit een git project is of run 'git init'" -ForegroundColor Yellow
    Write-Host "" -ForegroundColor White
    Read-Host "Druk Enter om door te gaan"
    exit 1
}

# Haal huidige branch naam op
try {
    $currentBranch = git branch --show-current 2>$null
    if ([string]::IsNullOrWhiteSpace($currentBranch)) {
        $currentBranch = "main"
    }
    Write-Host "🌿 Huidige branch: $currentBranch" -ForegroundColor Green
}
catch {
    Write-Host "❌ [ERROR] Kan branch informatie niet ophalen" -ForegroundColor Red
    Write-Host "💡 Mogelijk is dit een nieuwe repository zonder commits" -ForegroundColor Yellow
    $currentBranch = "main"
}

Write-Host "" -ForegroundColor White

# Controleer voor uncommitted changes
$hasChanges = $false
try {
    git diff-index --quiet HEAD -- 2>$null
    if ($LASTEXITCODE -ne 0) {
        $hasChanges = $true
    }
}
catch {
    # Als er nog geen HEAD is (eerste commit), check voor untracked files
    $untrackedFiles = git ls-files --others --exclude-standard 2>$null
    if ($untrackedFiles) {
        $hasChanges = $true
    }
}

if ($hasChanges) {
    Write-Host "📝 [INFO] Changes gevonden - klaar voor commit..." -ForegroundColor Yellow
    Write-Host "" -ForegroundColor White
    
    # Toon status
    Write-Host "📊 === Git Status ===" -ForegroundColor Cyan
    git status --short
    Write-Host "" -ForegroundColor White
    
    # Intelligente commit message suggesties
    $suggestedMessages = @(
        "feat: Update Bros and Baits website functionality",
        "fix: Resolve issues and improve user experience", 
        "style: Update UI components and styling",
        "refactor: Code improvements and optimizations",
        "docs: Update documentation and comments"
    )
    
    Write-Host "💡 Suggesties voor commit messages:" -ForegroundColor Cyan
    for ($i = 0; $i -lt $suggestedMessages.Length; $i++) {
        Write-Host "   $($i + 1). $($suggestedMessages[$i])" -ForegroundColor Gray
    }
    Write-Host "" -ForegroundColor White
    
    # Vraag om commit message
    $commitMsg = Read-Host "✍️  Voer commit message in (of druk Enter voor auto-message)"
    
    # Gebruik automatische message als leeg
    if ([string]::IsNullOrWhiteSpace($commitMsg)) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
        $commitMsg = "feat: Bros and Baits updates - $timestamp"
        Write-Host "🤖 Auto-message: $commitMsg" -ForegroundColor Magenta
    }
    
    Write-Host "" -ForegroundColor White
    
    # Add alle changes
    Write-Host "➕ [INFO] Adding alle changes..." -ForegroundColor Yellow
    git add .
    
    # Commit
    Write-Host "💾 [INFO] Committing: '$commitMsg'" -ForegroundColor Yellow
    git commit -m $commitMsg
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ [SUCCESS] Commit succesvol!" -ForegroundColor Green
    } else {
        Write-Host "❌ [ERROR] Commit gefaald!" -ForegroundColor Red
        Write-Host "" -ForegroundColor White
        Read-Host "Druk Enter om door te gaan"
        exit 1
    }
} else {
    Write-Host "✨ [INFO] Geen uncommitted changes gevonden - repository is clean!" -ForegroundColor Green
}

Write-Host "" -ForegroundColor White

# Check of remote bestaat en push
try {
    $remoteUrl = git remote get-url origin 2>$null
    if ($LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace($remoteUrl)) {
        Write-Host "🌐 Remote repository gevonden: $remoteUrl" -ForegroundColor Blue
        Write-Host "📤 [INFO] Pushing naar GitHub..." -ForegroundColor Yellow
        
        # Push met progress indicator
        git push origin $currentBranch
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "🎉 [SUCCESS] Push naar GitHub succesvol!" -ForegroundColor Green
            Write-Host "🔗 Je changes zijn nu live op GitHub!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  [WARNING] Push naar GitHub gefaald." -ForegroundColor Yellow
            Write-Host "💡 Mogelijke oorzaken:" -ForegroundColor Yellow
            Write-Host "   - Geen internet verbinding" -ForegroundColor Gray
            Write-Host "   - GitHub credentials niet ingesteld" -ForegroundColor Gray
            Write-Host "   - Branch bestaat niet op remote" -ForegroundColor Gray
            Write-Host "   - Merge conflicts" -ForegroundColor Gray
        }
    } else {
        Write-Host "⚠️  [INFO] Geen remote repository gevonden." -ForegroundColor Yellow
        Write-Host "💡 Om naar GitHub te pushen, voeg eerst een remote toe:" -ForegroundColor Yellow
        Write-Host "   git remote add origin https://github.com/username/repo.git" -ForegroundColor Gray
    }
}
catch {
    Write-Host "⚠️  [WARNING] Kan remote informatie niet ophalen." -ForegroundColor Yellow
}

Write-Host "" -ForegroundColor White
Write-Host "🏁 [INFO] Bros and Baits commit script voltooid!" -ForegroundColor Green
Write-Host "🚀 ================================" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White

# Wacht 3 seconden en sluit automatisch (tenzij er een error was)
if ($hasChanges) {
    Write-Host "⏱️  Venster sluit automatisch in 5 seconden..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
} else {
    Read-Host "Druk Enter om door te gaan"
}