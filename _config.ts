import lume from "lume/mod.ts";
import base_path from "lume/plugins/base_path.ts";
import date from "lume/plugins/date.ts";

const site = lume({
  src: "./src",
});

site.copy("assets");

site.use(base_path());
site.use(date());

export default site;
