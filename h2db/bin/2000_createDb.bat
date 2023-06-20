cd /d %~dp0
call 0000_setEnv.bat
"%JAVAEXE%" -cp "%H2DRIVERS%;%CLASSPATH%" org.h2.tools.RunScript -url "%H2URL%" -user "%H2USR%" -password "%H2PWD%" -script "%SQLDIR%/0002_create.sql" -showResults
pause
