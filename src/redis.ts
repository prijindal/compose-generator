import { GenerateFile, RootConfig } from "./";


const paths: RootConfig[] = [
  {
    sourceFolder: "example/redis",
    source: "docker-compose.yaml.hds",
    outputFolder: "dist_files/redis",
    configPath: "{{ports.port}}",
    eachVariables: {
      ports: [
        { port: 7000, clusterPort: 17000 },
        { port: 7001, clusterPort: 17001 },
        { port: 7002, clusterPort: 17002 },
        { port: 7003, clusterPort: 17003 },
        { port: 7004, clusterPort: 17004 },
        { port: 7005, clusterPort: 17005 },
      ],
    },
    variables: {
      announceIp: "192.168.193.218",
    },
    configs: [
      {
        id: "redis_conf",
        source: "redis.conf.hds",
        variables: {},
      },
    ],
  },
];

GenerateFile(paths);