# Web Jam PG

## Initial Setup

- If you first start docker and it makes the uploads folder, it will be locked. Run the following command so that the app can create a logs subdirectory `sudo chmod 777 -R ./uploads`

## pgAdmin

- pgAdmin is accessible at <a href="http://localhost:3400">http&#x3A;//localhost:3400</a>

        -   Username: admin@web-jam.com
        -   Password: password
    <br>

- Configuration for pgAmin to create a new server and connect to postgres is as follows:

        -   Host name: wj-pg-db-service
        -   Port: 5432
        -   Maintenance database (dbname): webjam
        -   Username: root
        -   Password: password
