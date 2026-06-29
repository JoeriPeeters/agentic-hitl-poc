import { farewell } from "./farewell.js";
import { greet } from "./greet.js";

const args = process.argv.slice(2);
const bye = args.includes("--bye");
const name = args.find((arg) => !arg.startsWith("--")) ?? "world";

console.log(bye ? farewell(name) : greet(name));
