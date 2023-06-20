cd /d %~dp0
call 0000_setEnv.bat
"%JAVAEXE%" -jar h2runner.jar
pause
