@ECHO OFF

SET OP=%1
IF "%OP%"=="" SET OP=/i

call :link rollup-plugin-jst\node_modules\@appfibre\jst\dist jst\dist
call :link webpack-plugin-jst\node_modules\@appfibre\jst\dist jst\dist
call :link tests\node_modules\@appfibre\jst\dist jst\dist
call :link tests\node_modules\@appfibre\services-ui-preact\dist services-ui-preact\dist
call :link tests\node_modules\@appfibre\services-ui-react\dist services-ui-react\dist
call :link tests\node_modules\@appfibre\webpack-plugin-jst\dist webpack-plugin-jst\dist
call :link tests\node_modules\@appfibre\rollup-plugin-jst\dist rollup-plugin-jst\dist
call :link examples\app\node_modules\@appfibre\jst\dist jst\dist
call :link examples\app\cdn local-cdn
call :link examples\pwa\node_modules\@appfibre\jst\dist jst\dist
call :link examples\pwa\node_modules\@appfibre\services-ui-react\dist services-ui-react\dist
call :link examples\pwa\node_modules\@appfibre\webpack-plugin-jst\dist webpack-plugin-jst\dist
call :link local-cdn\jst jst\dist
call :link local-cdn\app app\dist
call :link local-cdn\rollup-plugin-jst rollup-plugin-jst\dist
call :link local-cdn\systemjs local-cdn\node_modules\systemjs\dist
call :link local-cdn\react\cjs local-cdn\node_modules\react\cjs
call :link local-cdn\react\umd local-cdn\node_modules\react\umd
call :link local-cdn\react-dom\cjs local-cdn\node_modules\react-dom\cjs
call :link local-cdn\react-dom\umd local-cdn\node_modules\react-dom\umd
call :link local-cdn\preact local-cdn\node_modules\preact\dist
call :link local-cdn\es-module-loader local-cdn\node_modules\es-module-loader\core
call :link app\node_modules\@appfibre\jst\dist jst\dist
call :link docs\cdn local-cdn
call :link docs\scripts\app app\dist

GOTO:eof




:REMOVELINK
IF NOT EXIST %1 GOTO:eof
IF /I "%OP%"=="/u" ECHO removing %1
fsutil reparsepoint query "%1" | find "Symbolic Link" >nul && rd %1 
fsutil reparsepoint query "%1" | find "The file or directory is not a reparse point" >nul && (rmdir /Q/S %1)
GOTO:eof

:CREATELINK
mklink /d %1 %2
GOTO:eof

:RESTOREDIR
MD %1
XCOPY /E/Q %2 %1 >NUL
GOTO:eof

:LINK
IF /I "%OP%"=="i" call :removelink %~f1
IF /I "%OP%"=="/i" call :removelink %~f1
IF /I "%OP%"=="u" call :removelink %~f1
IF /I "%OP%"=="/u" call :removelink %~f1

IF /I "%OP%"=="i" call :createlink %~f1 %~f2
IF /I "%OP%"=="/i" call :createlink %~f1 %~f2
IF /I "%OP%"=="u" call :restoredir %~f1 %~f2
IF /I "%OP%"=="/u" call :restoredir %~f1 %~f2
GOTO:eof
