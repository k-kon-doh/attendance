cd /d %~dp0
call 0000_setEnv.bat
setlocal enabledelayedexpansion
set sql=
for %%t in (%MASTER_TABLES%  %DATA_TABLES%) do (
  set sql=!sql!call csvwrite('%CSVDIR%/%%t.csv', 'select * from %SCHEMA%.%%t', 'UTF-8',  char(9^), '''', ''''^);
)
"%JAVAEXE%" -cp "%H2DRIVERS%;%CLASSPATH%" org.h2.tools.Shell -url "%H2URL%" -user "%H2USR%" -password "%H2PWD%" -sql "%sql%"
pause
