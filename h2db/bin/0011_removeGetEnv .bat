cd /d %~dp0
call 0000_setEnv.bat
setlocal
set sql=drop alias if exists public.getenv;
"%JAVAEXE%" -cp "%H2DRIVERS%;%CLASSPATH%" org.h2.tools.Shell -url "%H2URL%" -user "%H2USR%" -password "%H2PWD%" -sql "%sql%"
pause
