# Audrie_full
To update database: run postgres container and:

apt-get update && apt-get install -y wget

wget --no-check-certificate "https://docs.google.com/uc?export=download&id=1ZSl0tTUUwRrvTDiq_XssgYJtxD8IPAhE" -O drugs_db.pgdump

pg_restore --clean --if-exists --no-owner -U drugs_db_admin -d drugs_db -v drugs_db.pgdump

