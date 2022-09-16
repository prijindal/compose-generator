import Handlebars from "handlebars";
import fs from "fs";

type Variables = Record<string, any>;

type SubConfig = {
  id: string;
  source: string;
  variables: Variables;
};

type EachVariable = Record<string, any>;

export type RootConfig = {
  sourceFolder: string;
  source: string;
  outputFolder: string;
  configPath: string;
  eachVariables: Record<string, EachVariable>;
  variables: Variables;
  configs: SubConfig[];
};

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

export const GenerateFile = (paths: RootConfig[]) => {
  for (const {
    source,
    sourceFolder,
    outputFolder,
    variables,
    configs,
    eachVariables,
    configPath,
  } of paths) {
    const target = outputFolder + "/" + source.replace(".hds", "");
    const file = fs.readFileSync(sourceFolder + "/" + source, "utf-8");
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
          const file = fs.readFileSync(sourceFolder + "/" + config.source, "utf-8");
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
};
