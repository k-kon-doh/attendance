cd /d %~dp0
call 0000_setEnv.bat
"%JAVAEXE%" -cp "%H2DRIVERS%;%CLASSPATH%" org.h2.tools.Console -baseDir "%H2DBDIR%" %*
if errorlevel 1 pause
