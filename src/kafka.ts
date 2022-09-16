import { GenerateFile, RootConfig } from "./";

const paths: RootConfig[] = [
  {
    sourceFolder: "example/kafka",
    source: "docker-compose.yaml.hds",
    outputFolder: "dist_files/kafka",
    configPath: "{{ports.port}}",
    eachVariables: {
      ports: [
        { zookeeper_port: 12181, kafka_port: 19092 },
        { zookeeper_port: 22181, kafka_port: 29092 },
        { zookeeper_port: 32181, kafka_port: 39092 },
      ],
    },
    variables: {},
    configs: [],
  },
];

GenerateFile(paths);
