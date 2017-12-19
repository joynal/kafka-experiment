# Kafka experiment

Apache kafka message queue experiment with nodejs

## Pre-requisites

Install kafka from official [guide](https://kafka.apache.org/quickstart).

## Step 1: Start the server

Start a ZooKeeper server. Kafka has a single node Zookeeper configuration built-in.
```
$ bin/zookeeper-server-start.sh config/zookeeper.properties &
```
Now start Kafka itself:
```
$ bin/kafka-server-start.sh config/server.properties &
```

## Step 2: Create topics
```
$ bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic providers
$ bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic providers-retry-5min
$ bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic providers-retry-60min
$ bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic providers-failed
```
These can be easily listed
```
$ bin/kafka-topics.sh --list --zookeeper localhost:2181
providers
providers-retry-5min
providers-retry-60min
providers-retry-failed
```
Note: In production disable topics auto creation `auto.create.topics.enable=false`

## Step 3: Install package from npm
```
$ yarn
```

## Step 4: Setup environment variables

Copy .env.example to .env. Create a dummy campaign list at [klaviyo](https://klaviyo.com) and replace .env configuration with your credentials.

## Step 5: Start consumers

```
$ node app/consumers/providerConsumer.js
$ node app/consumers/consumerRetry5min.js
$ node app/consumers/consumerRetry60min.js
$ node app/consumers/consumerFailed.js
```

## Step 6: Send data to producer

```
$ node app/index.js
Sent msg number 0
...
Sent msg number 1000
```

## Cleaning Up
Stop Kafka and Zookeeper and delete the log directories

```
$ project-dir
bin/kafka-server-start.sh config/server.properties
^C
$ kill -9 [PORT]
```

```
$ project-dir
bin/zookeeper-server-start.sh config/zookeeper.properties
^C
$ kill -9 [PORT]
```

```
$ rm -rf /tmp/zookeeper/version-2/log.* && rm -rf /tmp/kafka-logs/
```

Note: find port number with `ps aux | grep zookeeper.properties`

## Authors

**Joynal Abedin** - [Joynal](https://twitter.com/joynaluu)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details