sudo docker rm -f maria_db
sudo docker run -d -p 3306:3306 --name maria_db jongheonkim/ubuntu_mariadb mysqld_safe
