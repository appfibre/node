@ECHO OFF

SET OP=%1
IF "%OP%"=="" SET OP=/i

call :link core\node_modules\@appfibre\types types

call :link webapp\node_modules\@appfibre\types types
call :link webapp\node_modules\@appfibre\core core

call :link webcomponents\node_modules\@appfibre\core core
call :link webcomponents\node_modules\@appfibre\webapp webapp
call :link webcomponents\node_modules\@appfibre\types types

call :link webpack-plugin-jst\node_modules\@appfibre\core core
call :link webpack-plugin-jst\node_modules\@appfibre\types types
call :link webpack-plugin-jst\node_modules\@appfibre\webapp webapp

call :link bundles\node_modules\@appfibre\types types
call :link bundles\node_modules\@appfibre\core core
call :link bundles\node_modules\@appfibre\webapp webapp
call :link bundles\node_modules\@appfibre\webcomponents webcomponents

call :link tests\node_modules\@appfibre\types types
call :link tests\node_modules\@appfibre\core core
call :link tests\node_modules\@appfibre\webapp webapp
call :link tests\node_modules\@appfibre\services-ui-preact services-ui-preact
call :link tests\node_modules\@appfibre\services-ui-react services-ui-react
call :link tests\node_modules\@appfibre\webpack-plugin-jst webpack-plugin-jst
call :link tests\node_modules\@appfibre\bundles bundles

rem call :link examples\app\node_modules\@appfibre\core core
rem call :link examples\app\node_modules\@appfibre\webapp webapp
call :link examples\pwa\node_modules\@appfibre\types types
call :link examples\pwa\node_modules\@appfibre\core core
call :link examples\pwa\node_modules\@appfibre\webapp webapp
call :link examples\pwa\node_modules\@appfibre\services-ui-react services-ui-react
call :link examples\pwa\node_modules\@appfibre\webpack-plugin-jst webpack-plugin-jst

rem call :link app\node_modules\@appfibre\jst\dist jst\dist

rem call :link local-cdn\appfibre webcomponents\dist
rem call :link local-cdn\rollup-plugin-jst rollup-plugin-jst\dist
rem call :link local-cdn\systemjs local-cdn\node_modules\systemjs\dist
rem call :link local-cdn\react\cjs local-cdn\node_modules\react\cjs
rem call :link local-cdn\react\umd local-cdn\node_modules\react\umd
rem call :link local-cdn\react-dom\cjs local-cdn\node_modules\react-dom\cjs
rem call :link local-cdn\react-dom\umd local-cdn\node_modules\react-dom\umd
rem call :link local-cdn\preact local-cdn\node_modules\preact\dist
rem call :link local-cdn\es-module-loader local-cdn\node_modules\es-module-loader\core

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
