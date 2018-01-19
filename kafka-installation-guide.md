# Kafka Installation guide

Credit: Step 1, 2, 3, 4 taken from [this article](https://www.digitalocean.com/community/tutorials/how-to-install-apache-kafka-on-ubuntu-14-04)

## Step 1: Install Java
Before installing additional packages, update the list of available packages so you are installing the latest versions available in the repository:
```
sudo apt-get update
```
As Apache Kafka needs a Java runtime environment, use apt-get to install the default-jre package:
```
sudo apt-get install default-jre
```

## Step 2: Install ZooKeeper
Apache ZooKeeper is an open source service built to coordinate and synchronize configuration information of nodes that belong to a distributed system. A Kafka cluster depends on ZooKeeper to perform—among other things—operations such as detecting failed nodes and electing leaders.

Since the ZooKeeper package is available in Ubuntu's default repositories, install it using `apt-get`.
```
sudo apt-get install zookeeperd
```
After the installation completes, ZooKeeper will be started as a daemon automatically. By default, it will listen on port 2181. To make sure that it is working, connect to it via Telnet:
```
telnet localhost 2181
```
At the Telnet prompt, type in `ruok` and press `ENTER`. If everything's fine, ZooKeeper will say `imok` and end the Telnet session.

## Step 3: Download and Extract Kafka Binaries
Now that Java and ZooKeeper are installed, it is time to download and extract Kafka. To start, create a directory called Downloads to store all your downloads.
```
mkdir -p ~/Downloads
```
Use `wget` to download the Kafka binaries.
```
wget "http://www-eu.apache.org/dist/kafka/1.0.0/kafka_2.12-1.0.0.tgz" -O ~/Downloads/kafka.tgz
```
Create a directory called `kafka` and change to this directory. This will be the base directory of the Kafka installation.
```
tar -xvzf ~/Downloads/kafka.tgz --strip 1
```

## Step 4: Configure the Kafka Server
The next step is to configure the Kakfa server. Open `server.properties` using `vim`:
```
vim ~/kafka/config/server.properties
```
In production disable topics auto creation.
```
auto.create.topics.enable=false
```
And change kafka log directory.
```
/home/ubuntu/kafka-data/broker-0
```

## Step-5: Setup kafka service
1. Copy `kafka.service` script to `/etc/systemd/system`
```
sudo cp kafka.service /etc/systemd/system
```

2. Give the permissions to `kafka.service`
```
sudo chmod 755 /etc/systemd/system/kafka.service
```

3. Make the kafka service with these commands
```
sudo systemctl enable kafka.service
```
