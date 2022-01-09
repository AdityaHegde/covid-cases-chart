import {execSync} from "child_process";
const execSyncInData = (cmd) => {
  console.log(`Executing '${cmd}'`);
  execSync(cmd, {stdio: "inherit", cwd: "data"})
};

const COVID_REPO = "git@github.com:CSSEGISandData/COVID-19.git";
const COVID_REPORTS = "csse_covid_19_data/csse_covid_19_daily_reports";

(async () => {
  execSync("mkdir -p data", { stdio: "inherit" })
  execSyncInData("git init");
  execSyncInData(`git remote add -f origin ${COVID_REPO} | true`);
  execSyncInData("git config core.sparseCheckout true");
  execSyncInData(`echo ${COVID_REPORTS} > .git/info/sparse-checkout`);
  execSyncInData("git pull origin master");
})();
