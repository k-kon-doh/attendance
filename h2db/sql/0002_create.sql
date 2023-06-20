drop alias if exists public.getenv;
create alias if not exists public.getenv for 'java.lang.System.getenv';

set @sqldir = public.getenv('SQLDIR') || '/';

drop user if exists appuser;
drop schema if exists my_schema cascade;

runscript from @sqldir || '0100_user.sql';
runscript from @sqldir || '0101_schema.sql';
runscript from @sqldir || '0102_table.sql';

runscript from @sqldir || '9000_inithial_data.sql';

