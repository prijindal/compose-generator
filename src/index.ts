import Handlebars from "handlebars";
import fs from "fs";

const paths = [
  {
    source: "example/docker-compose.yaml.hds",
    outputFolder: "dist_files",
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
      announceIp: "192.168.193.218"
    },
    configs: [
      {
        id: "redis_conf",
        source: "example/redis.conf.hds",
        variables: {},
      },
    ],
  },
];

const writeFile = (path: string, data: string) => {
  const pathSplit = path.split("/");
  console.log(`pathSplit: ${pathSplit}`);
  for (let index = 0; index < pathSplit.length - 1; index++) {
    const element = pathSplit[index];
    const dir =
      index == 0
        ? element
        : pathSplit.slice(0, index).join("/") + "/" + element;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  fs.writeFileSync(path, data, "utf-8");
};
for (const {
  source,
  outputFolder,
  variables,
  configs,
  eachVariables,
  configPath,
} of paths) {
  const target = outputFolder + "/" + source.replace(".hds", "");
  const file = fs.readFileSync(source, "utf-8");
  const template = Handlebars.compile(file);
  const targetVariables = {
    ...variables,
    ...eachVariables,
  };
  writeFile(target, template(targetVariables));
  for (let index = 0; index < configs.length; index++) {
    const config = configs[index];
    for (const each in eachVariables) {
      const eachValues = (eachVariables as any)[each];
      for (let j = 0; j < eachValues.length; j++) {
        let eachVariableValue = eachValues[j];
        const file = fs.readFileSync(config.source, "utf-8");
        const template = Handlebars.compile(file);
        const configVariables = {
          ...variables,
          ...config.variables,
          [each]: eachVariableValue,
        };
        const configPathResolved =
          Handlebars.compile(configPath)(configVariables);
        const target =
          outputFolder +
          "/" +
          `${configPathResolved}/` +
          config.source.replace(".hds", "");
        console.log(`target: ${target}`);
        console.log(`configVariables: ${JSON.stringify(configVariables)}`);
        writeFile(target, template(configVariables));
      }
    }
  }
}
