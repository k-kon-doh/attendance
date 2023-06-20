cd /d %~dp0
call 0000_setEnv.bat
"%JAVAWEXE%" -cp "%H2DRIVERS%;%CLASSPATH%" org.h2.tools.Cosole -baseDir "%H2DBDIR%" %*
if errorlevel 1 pause
