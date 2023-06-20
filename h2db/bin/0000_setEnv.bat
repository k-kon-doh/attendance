rem @echo off

set JAVAEXE=%JAVA_HOME%/bin/java.exe
set JAVAWEXE=%JAVA_HOME%/bin/javaw.exe

set H2INST=C:/h2
set H2DRIVERS=

set CLASSPATH=%H2INST%/bin/*;%CLASSPATH%

set H2HOME=C:\attendance\h2db

set H2DBDIR=%H2HOME%/db

set H2DBNAME=mem:MYDB
set H2DBPARA=;MODE=PostgreSQL;DEFAULT_NULL_ORDERING=HIGH;CASE_INSENSITIVE_IDENTIFIERS=TRUE

set H2DBPATH=%H2DBDIR%/
if %H2DBNAME:~0,4%==mem: (
   set H2DBPATH=
   set H2DBPARA=%H2DBPARA%;DB_CLOSE_DELAY=-1
)

rem ==== Embedded ====
rem set H2URL=jdbc:h2:%H2DBPATH%%H2DBNAME%%H2DBPARA%

rem ==== Server ====
set H2URL=jdbc:h2:tcp://localhost/%H2DBPATH%%H2DBNAME%%H2DBPARA%

rem ==== H2Runner ====
set H2RUN=jdbc:h2:%H2DBPATH%%H2DBNAME%%H2DBPARA%

set H2USR=sa
set H2PWD=pw

set SQLDIR=%H2HOME%/sql
set CSVDIR=%H2HOME%/csv

set SCHEMA=MY_SCHEMA

set MASTER_TABLES=
set MASTER_TABLES=%MASTER_TABLES% SETTINGS
set MASTER_TABLES=%MASTER_TABLES% HOLIDAYS
set MASTER_TABLES=%MASTER_TABLES% CATEGORIES
set MASTER_TABLES=%MASTER_TABLES% LABELS
set MASTER_TABLES=%MASTER_TABLES% MESSAGES
set MASTER_TABLES=%MASTER_TABLES% ROLES
set MASTER_TABLES=%MASTER_TABLES% ROLE_FEATURES
set MASTER_TABLES=%MASTER_TABLES% ORGANIZATIONS
set MASTER_TABLES=%MASTER_TABLES% EMPLOYEES
set MASTER_TABLES=%MASTER_TABLES% ATTENDANCE_KINDS

set DATA_TABLES=
set DATA_TABLES=%DATA_TABLES% ATTENDANCES
set DATA_TABLES=%DATA_TABLES% ATTENDANCE_MEMBERS



set ID_GEN_TABLES=
set ID_GEN_TABLES=%ID_GEN_TABLES% ROLES
set ID_GEN_TABLES=%ID_GEN_TABLES% ROLE_FEATURES
set ID_GEN_TABLES=%ID_GEN_TABLES% ORGANIZATIONS
set ID_GEN_TABLES=%ID_GEN_TABLES% EMPLOYEES
set ID_GEN_TABLES=%ID_GEN_TABLES% ATTENDANCE_KINDS
set ID_GEN_TABLES=%ID_GEN_TABLES% ATTENDANCES

