# Kafka plain authentication

Plain authentication is a simple mechanism based on username/password. It should be used with TLS for encryption to implement secure authentication. This playbook contains a simple configuration where SASL-Plain authentication is used for Kafka.

## Kafka

### server.properties
```
broker.id=0

security.inter.broker.protocol=SASL_PLAINTEXT
sasl.mechanism.inter.broker.protocol=PLAIN
sasl.enabled.mechanisms=PLAIN

advertised.host.name=localhost
listeners=SASL_PLAINTEXT://localhost:9092
advertised.listeners=SASL_PLAINTEXT://localhost:9092

authorizer.class.name=kafka.security.auth.SimpleAclAuthorizer
allow.everyone.if.no.acl.found=true
auto.create.topics.enable=false

num.network.threads=3
num.io.threads=8

socket.send.buffer.bytes=102400
socket.receive.buffer.bytes=102400
socket.request.max.bytes=104857600

log.dirs=/data/kafka/broker-0

num.partitions=1
num.recovery.threads.per.data.dir=1

offsets.topic.replication.factor=1
transaction.state.log.replication.factor=1
transaction.state.log.min.isr=1

log.retention.hours=168
log.segment.bytes=1073741824
log.retention.check.interval.ms=300000

zookeeper.connect=localhost:2181
zookeeper.connection.timeout.ms=6000

group.initial.rebalance.delay.ms=0

super.users=User:kafka
```

### consumer.properties  & producer.properties
```
sasl.mechanism=PLAIN
security.protocol=SASL_PLAINTEXT
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required \
  username="kafka" \
password="kafka";
```

### kafka_server_jaas.conf
```
KafkaServer {
	org.apache.kafka.common.security.plain.PlainLoginModule required
	username="kafka"
	password="kafka_secret"
	user_kafka="kafka_secret";
};
```

## Zookeeper

### zookeeper.properties
```
dataDir=/data/zookeeper
clientPort=2181
maxClientCnxns=0
authProvider.1=org.apache.zookeeper.server.auth.SASLAuthenticationProvider
requireClientAuthScheme=sasl
jaasLoginRenew=3600000
```

### zookeeper_jaas.conf
```
Server {
	org.apache.zookeeper.server.auth.DigestLoginModule required
	username="kafka"
	password="kafka_secret"
	user_kafka="kafka_secret";
};
```

## Start the server

Zookeeper:
```
$ export KAFKA_OPTS=-Djava.security.auth.login.config=/Users/aaroza/kafka/config/zookeeper_jaas.conf
$ bin/zookeeper-server-start.sh  config/zookeeper.properties &
```

Kafka:
```
$ export KAFKA_OPTS=-Djava.security.auth.login.config=/Users/aaroza/kafka/config/kafka_server_jaas.conf
$ bin/kafka-server-start.sh  config/server.properties &
```

Producer:
```
bin/kafka-console-producer.sh --broker-list localhost:9092 --producer.config ./config/producer.properties --topic test
```

Consumer:
```
bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --consumer.config ./config/consumer.properties --topic test --from-beginning
```
