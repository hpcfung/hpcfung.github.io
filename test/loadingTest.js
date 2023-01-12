import { Octokit, App } from "https://cdn.skypack.dev/octokit";

let token = prompt("Please enter your token");

const octokit = new Octokit({
  auth: token
})
